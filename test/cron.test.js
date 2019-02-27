const parser = require('cron-parser');
const assert = require('assert');


describe('SCHEDULE', function(){

  it('*/2 * * * *', function(done){
    try {
      var interval = parser.parseExpression('0 17 * * *');
    
      console.log('Date1: ', interval.next().getTime()); // Sat Dec 29 2012 00:42:00 GMT+0200 (EET)
      console.log('Date2: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET)
    
      console.log('Date3: ', interval.next().toString()); // Sat Dec 29 2012 00:42:00 GMT+0200 (EET)
      console.log('Date4: ', interval.next().toString()); // Sat Dec 29 2012 00:40:00 GMT+0200 (EET)
      done();
    } catch (err) {
      console.log('Error: ' + err.message);
    }
    
  })

})
