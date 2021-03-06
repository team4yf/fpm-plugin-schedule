"use strict";
const _ = require('lodash');
const parser = require('cron-parser');
const schedule = require('node-schedule');
const fetch = require('node-fetch');
const path = require('path');
const assert = require('assert');

const Storage = require('./storage/index.js');
const E = {
  Job: {
    JOB_CREATE_ERROR: {
      errno: -10031, 
      code: 'JOB_CREATE_ERROR', 
      message: 'The args should be an object-like'
    }
  }
}

module.exports = {
  bind: (fpm) => {
    
    const config = fpm.getConfig('schedule', { storage: 'disk', filename: 'schedule.json' });
    const options = _.assign({ fpm, storage: 'disk', filename: 'schedule.json' }, config)
    const storage = Storage(options);

    // The Jobs Collection
    const jobs = {}


    const once = async (params) => {
      const taskId = await storage._onStart(params);
      let { method, args, v } = params
      try{
        if( _.isString(args)){
          args = JSON.parse(args || '{}')
        }
      }catch(e){
        fpm.logger.error(e);
        return false
      }
      const { webhook, job_type = 'BIZ' } = params;
      let isOk = true, feedback, data;
      try {
        
        if(job_type == 'BIZ'){
          data = await fpm.execute(method, args, v);
          
        }else{
          const rsp = await fetch(method, {
            method: 'post',
            body:    JSON.stringify(args),
            headers: { 'Content-Type': 'application/json' },
          })
          data = await rsp.json();
        }
        storage._onFinish(taskId, {
          params,
          args,
          result: data
        });
        fpm.publish('#cronjob/done', {
          params,
          args,
          result: data
        })
        feedback = data;
      } catch (error) {
        storage._onError(taskId, {
            params,
            args,
            error
          })
          fpm.publish('#cronjob/error', {
            params,
            args,
            error
          })
          isOk = false;
          feedback = error;
      }
      if(webhook){
        // need feedback
        fetch(webhook, {
          method: 'post',
          body:    JSON.stringify({ code: isOk?0: -1, content: feedback }),
          headers: { 'Content-Type': 'application/json' },
        })
      }
      if( isOk )
        return feedback;
      return Promise.reject(feedback)
    }
    /**
     * id!
     * name!
     * method!
     * v!
     * cron!
     * @param {*} args 
     */
    const createCronJob = (params) =>{
      jobs[params.id] = schedule.scheduleJob(params.name, params.cron, () =>{
        once(params).catch(( error ) => {
          // ignore the error!
        });
      })
      const {id, name} = params
      return {id, name}
    }

    const autorunJobs = () => {  
      storage._list()
        .then(data => {
          _.map(data, (item, id) => {
            if(item.autorun)
              createCronJob(item)
          })
        })
      
    }

    const bizModule = {
      getCronNext: async (args) => {
        return parser.parseExpression(args.cron).next().getTime();
      },
      getCronPrev: async (args) => {
        return parser.parseExpression(args.cron).prev().getTime();
      },
      createCronJob: async (args) => {
        let id = await storage._create(args);
        args.id = id
        let data = createCronJob(args)
        if(data === false){
          return Promise.reject(E.Job.JOB_CREATE_ERROR)
        }
        return data;
      },
      cancelJob: async (args) => {
        storage._cancel(args);  
        if(!_.has(jobs, args.id)){
          return 0
        }
        const job = jobs[args.id]
        schedule.cancelJob(job)
        delete jobs[args.id]
        return 1;      
      },
      pauseJob: async args => {
        const job = jobs[args.id]
        schedule.cancelJob(job)
        delete jobs[args.id]
        return storage._pause(args);
      },
      restartJob: async args => {
        try {
          const param = await storage._get(args);
          if(param.autorun == 1){
            return 1; // already running.
          }
          createCronJob(param);
          return storage._restart(args);  
        } catch (error) {
          // cant get the job
          return Promise.reject({
            message: 'Job Not Exists'
          })
        }
        
      },
      callJob: async args => {
        try {
          // call job once
          const param = await storage._get(args);
          const rsp = await once(param);
          return rsp
        } catch (error) {
          // cant get the job
          return Promise.reject(error)
        }
      },
      getJob: async args => {
        try {
          return await storage._get(args);
        } catch (error) {
          // cant get the job
          return Promise.reject({
            message: 'Job Not Exists'
          })
        }
      },
      getJobs: async args => {
        return await storage._list();
      }
    }

    fpm.registerAction('BEFORE_SERVER_START', async () => {
      // install the meta sql script if the storage is mysql
      try {
        if( config.storage === 'mysql' ){
          assert(!!fpm.M, 'Mysql Plugin Not Installed!');
          await fpm.M.install(path.join(__dirname, '../sql'))
        }
        fpm.extendModule('job', bizModule)
        // auto run the jobs when startup
        autorunJobs()
      } catch (error) {
        fpm.logger.error(error);
        throw error;
      }
    })

    return bizModule
  }
}