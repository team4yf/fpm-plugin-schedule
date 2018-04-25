"use strict";
import _ from 'lodash'
import schedule from 'node-schedule'

export default {
  bind: (fpm) => {
    const jobs = {}
    /**
     * id!
     * name!
     * method!
     * v!
     * cron!
     * @param {*} args 
     */
    const createJob = (args) =>{
      jobs[args.id] = schedule.scheduleJob(args.cron, () =>{
        let { method, v } = args
        fpm.execute(method, args, v)
          .then(data => {
            //TODO: how to recode the DATA
            //Use Publish ? pub/sub Is suport one process Mode
          })
          .catch(err => {
            //TODO: how to handle the ERROR
            //Use Publish ? pub/sub Is suport one process Mode
          })
      })
      return {
        data: {
          jobId: args.id,
          jobName: args.name
        }
      }
    }
    fpm.registerAction('BEFORE_SERVER_START', () => {

      
      //extend module
      fpm.extendModule('job', {
        create: (args) => {
          let data = createJob(args)
          console.log(data)
          return Promise.resolve(data)
        }
      })
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