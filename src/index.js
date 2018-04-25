"use strict";
import _ from 'lodash'
import schedule from 'node-schedule'
import fs from 'fs'
import path from 'path'

export default {
  bind: (fpm) => {
    // The Jobs Collection
    const jobs = {}

    let jobDB = {}

    let isFileStore = true

    let dbFilePath

    // fpm-plugin-mysql installed ?
    // get datas from db
    if(fpm.isPluginInstalled('fpm-plugin-mysql')){
      // if table exists?

      // 
      
    }

    const loadJobs = () =>{
      if(isFileStore){
        // get datas from fs
        dbFilePath = path.join(fpm.get('CWD'), 'jobs.json')
        if(fs.existsSync(dbFilePath)){
          jobDB = require(dbFilePath)
        }        
      }else{
        // load from mysql db
        
      }      
    }

    const saveJobs = (op, args) =>{
      if('create' === op){
        jobDB[args.id] = args
      }else if('cannel' === op){
        delete jobDB[args.id]
      }
      // flush
      if(isFileStore){
        //dbFilePath
        fs.createWriteStream(dbFilePath).write(JSON.stringify(jobDB), (err) => {
          if (err) throw err
        })
      }else{
        // insert into db
      }
    }

    /**
     * id!
     * name!
     * method!
     * v!
     * cron!
     * @param {*} args 
     */
    const createCronJob = (args) =>{
      jobs[args.id] = schedule.scheduleJob(args.name, args.cron, () =>{
        let { method, v } = args
        fpm.execute(method, args, v)
          .then(data => {
            fpm.publish('cronjob.done', {
              args,
              result: data
            })
          })
          .catch(err => {
            fpm.publish('cronjob.error', {
              args,
              error: err
            })
          })
      })
      const {id, name} = args
      return {id, name}
    }

    const cancelJob = args => {
      if(!_.has(jobs, args.id)){
        return 0
      }
      const job = jobs[args.id]
      schedule.cancelJob(job)
      delete jobs[args.id]
      saveJobs('cannel', args)
      return 1
    }

    const autorunJobs = () => {      
      _.map(jobDB, (item) => {
        createCronJob(item)
      })
    }

    fpm.registerAction('BEFORE_SERVER_START', () => {

      //extend module
      fpm.extendModule('job', {
        createCronJob: (args) => {
          saveJobs('create', args)
          let data = createCronJob(args)
          return Promise.resolve(data)
        },
        cancelJob: cancelJob,
        getJobs: args => {
          return _.map(jobs, (job, id) => {
            return { id, name: job.name }
          })
        }
      })

      loadJobs()

      //autorun jobs 
      autorunJobs()
    })
  }
}
/*
var scheduleBiz = function(biz, fpm){

  var jobs = [];

  var startJob = function(args){
    var job = schedule.scheduleJob(args.cron, function(){
      var method = args.method;
      var v = args.v;
      fpm.execute(method, args, v)
        .then(function(data){
        })
        .catch(function(err){
          console.log('error from jobs');
          console.log(err)
        })
    });
    jobs[args.id] = job;
    return {
      data: {
        jobId: args.id,
        jobName: args.name
      }
    };
  };

  return {
    auto: function(){
      fpm.M.findAsync({table: 'fpm_schedule', condition: 'delflag = 0 and autorun = 1'})
        .then(function(list){
          _.map(list, function(j){
              startJob(j)
          })
        })
        .catch(function(err){
          console.log(err);
        })
      return {
        data: 1
      }
    },
    stop: function(args){
      var job = jobs[args.jobId];
      if(job){
        schedule.cancelJob(job)
      }
      return {
        data: 1
      }
    },
    start: startJob
  };
};

module.exports = {
  bind: function(fpm){
    fpm.registerAction('BEFORE_MODULES_ADDED', function (args) {
      var biz = args[0]
      if(biz.v === '0.0.1'){
        biz.m = _.assign(biz.m, {
          schedule: scheduleBiz(biz, fpm)
        })
        biz.m.schedule.auto();
      }
    });
  }

};
//*/