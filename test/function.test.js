var should = require("chai").should();
var YF = require("yf-fpm-client-js").default;

YF.init({appkey: '123123', masterKey: '123123', domain: 'http://localhost:9999'});


describe('SCHEDULE', function(){
  beforeEach(done => {
    var func = new YF.Func('job.createCronJob');
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
    var func = new YF.Func('job.getJobs');
    func.invoke({})
      .then(function(data){
        console.log(data)
        done();
      }).catch(function(err){
        done(err);
      })
  })
})
