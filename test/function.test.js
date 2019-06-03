const { init, Func } = require("fpmc-jssdk");
const assert = require('assert');
init({ appkey:'123123', masterKey:'123123', endpoint: 'http://localhost:9999/api' });


describe('SCHEDULE', function(){
  // before(done => {
  //   var func = new Func('job.createCronJob');
  //   func.invoke({method: 'demo.foo', v: '0.0.1', cron: '* * * * *', name: 'demo', autorun: 1, args: {message: 1}})
  //     .then(function(data){
  //       console.log(data)
  //       done();
  //     }).catch(function(err){
  //       done(err);
  //     })
  // })
  

  // afterEach(done => {
  //   var func = new Func('job.getJob');
  //   func.invoke({ id: 3 })
  //     .then(function(data){
  //       console.log('The latest', data)
  //       done();
  //     }).catch(function(err){
  //       done(err);
  //     })
  // })

  // it('getJobs function', function(done){
  //   var func = new Func('job.createCronJob');
  //   func.invoke({method: 'demo.foo', v: '0.0.1', cron: '* * * * *', name: 'demo', autorun: 1, args: {message: 1}})
  //     .then(function(data){
  //       console.log(data)
  //       done();
  //     }).catch(function(err){
  //       done(err);
  //     })
  // })
  // it('pauseJob function', function(done){
  //   var func = new Func('job.pauseJob');
  //   func.invoke({ id: 3 })
  //     .then(function(data){
  //       console.log(data)
  //       done();
  //     }).catch(function(err){
  //       done(err);
  //     })
  // })
  // it('callJob function', function(done){
  //   var func = new Func('job.callJob');
  //   func.invoke({ id: 1 })
  //     .then(function(data){
  //       console.log(data)
  //       done();
  //     }).catch(function(err){
  //       done(err);
  //     })
  // })
  // it('restartJob function', function(done){
  //   var func = new Func('job.restartJob');
  //   func.invoke({ id: 3 })
  //     .then(function(data){
  //       console.log(data)
  //       done();
  //     }).catch(function(err){
  //       done(err);
  //     })
  // })
  it('cancel function', function(done){
    var func = new Func('job.cancelJob');
    func.invoke({ id: 1 })
      .then(function(data){
        console.log(data)
        done();
      }).catch(function(err){
        done(err);
      })
    })
})

