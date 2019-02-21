"use strict";
const _ = require('lodash');
const schedule = require('node-schedule');
const fs = require('fs');
const path = require('path');

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
        let { method, args, v } = params
        try{
          if( _.isString(args)){
            args = JSON.parse(args || '{}')
          }
        }catch(e){
          fpm.logger.error(e);
          return false
        }
        fpm.execute(method, args, v)
          .then(data => {
            fpm.publish('#cronjob/done', {
              params,
              args,
              result: data
            })
          })
          .catch(err => {
            fpm.publish('#cronjob/error', {
              params,
              args,
              error: err
            })
          })
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
        if(!_.has(jobs, args.id)){
          return 0
        }
        const job = jobs[args.id]
        schedule.cancelJob(job)
        delete jobs[args.id]
        storage._cancel(args);  
        return 1;      
      },
      getJobs: async args => {
        return await storage._list();
      }
    }

    fpm.registerAction('BEFORE_SERVER_START', () => {

      //extend module
      fpm.extendModule('job', bizModule)
      autorunJobs()
    })

    return bizModule
  }
}