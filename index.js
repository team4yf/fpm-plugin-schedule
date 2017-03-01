var schedule = require('node-schedule');
var _ = require('lodash');

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
