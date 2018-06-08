"use strict";
import _ from 'lodash'
import schedule from 'node-schedule'
import fs from 'fs'
import path from 'path'

const E = {
  Job: {
    JOB_CREATE_ERROR: {
      errno: -10031, 
      code: 'JOB_CREATE_ERROR', 
      message: 'The args should be an object-like'
    }
  }
}

export default {
  bind: (fpm) => {
    // The Jobs Collection
    const jobs = {}

    let jobDB = {}

    let dbFilePath = path.join(fpm.get('CWD'), 'schedule.json') 

    const loadJobs = () =>{
      if(fs.existsSync(dbFilePath)){
        jobDB = require(dbFilePath)
      }    
    }

    const saveJobs = (op, args) =>{
      let id
      if('create' === op){
        id = parseInt((_.max(_.keys(jobDB)) || 0)) + 1
        jobDB[id] = args
      }else if('cancel' === op){
        delete jobDB[args.id]
      }
      // flush
      fs.createWriteStream(dbFilePath).write(JSON.stringify(jobDB), (err) => {
        if (err) throw err
      })
      return id
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
        let { method, args, v } = params
        try{
          args = JSON.parse(args || '{}')
        }catch(e){
          return false
          args = {}
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

    const cancelJob = args => {
      if(!_.has(jobs, args.id)){
        return 0
      }
      const job = jobs[args.id]
      schedule.cancelJob(job)
      delete jobs[args.id]
      saveJobs('cancel', args)
      return 1
    }

    const autorunJobs = () => {      
      _.map(jobDB, (item, id) => {
        if(item.autorun)
          createCronJob(item)
      })
    }

    const bizModule = {
      createCronJob: (args) => {
        let id = saveJobs('create', args)
        args.id = id
        let data = createCronJob(args)
        if(data === false){
          return Promise.reject(E.Job.JOB_CREATE_ERROR)
        }
        return Promise.resolve(data)
      },
      cancelJob: cancelJob,
      getJobs: args => {
        return _.map(jobDB, (job, id) => {
          return _.assign(job, {id})
        })
      }
    }

    fpm.registerAction('BEFORE_SERVER_START', () => {

      //extend module
      fpm.extendModule('job', bizModule)

      loadJobs()
      autorunJobs()
    })

    return bizModule
  }
}