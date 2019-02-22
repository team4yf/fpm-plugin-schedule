const assert = require('assert');
const fetch = require('node-fetch');


describe('fetch', function(){
 
  it('fetch', function(done){
    fetch('http://baidu.com', {
      method: 'post',
      body:    JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(data => {
        return data.json();
      })
      .then(data => {
        console.log(data)
        done();
      })
      .catch(done)
  })
})
