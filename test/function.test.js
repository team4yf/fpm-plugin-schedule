const { init, Func } = require("fpmc-jssdk");
const assert = require('assert');
init({ appkey:'123123', masterKey:'123123', endpoint: 'http://localhost:9999/api' });


describe('SCHEDULE', function(){
  beforeEach(done => {
    var func = new Func('job.createCronJob');
    func.invoke({method: 'demo.foo', v: '0.0.1', cron: '* * * * *', name: 'demo', autorun: 1, args: {message: 1}})
      .then(function(data){
        console.log(data)
        done();
      }).catch(function(err){
        done(err);
      })
  })
  

  afterEach(done => {
    console.log('done')
    done()
  })

  it('getJobs function', function(done){
    var func = new Func('job.getJobs');
    func.invoke({})
      .then(function(data){
        console.log(data)
        done();
      }).catch(function(err){
        done(err);
      })
  })
})
