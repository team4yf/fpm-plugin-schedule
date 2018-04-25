var should = require("chai").should();
var YF = require("yf-fpm-client-nodejs").default;

YF.init({appkey: '123123', masterKey: '123123', endpoint: 'http://localhost:9999/api'});


describe('SCHEDULE', function(){
  it('createJob function', function(done){
    var func = new YF.Func('job.create');
    func.invoke({method: 'demo.foo', v: '0.0.1', cron: '35 11 * * *', id: 1, name: 'demo'})
      .then(function(data){
        console.log(data);
        done();
      }).catch(function(err){
        done(err);
      });
  });
})
