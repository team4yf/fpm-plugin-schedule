'use strict';
import { Fpm } from 'yf-fpm-server'
import plugin from '../src'
let app = new Fpm()
plugin.bind(app)

let biz = app.createBiz('0.0.1');
biz.addSubModules('demo',{
    foo: (args) => {
        console.log('demo.foo called', args)
        return Promise.resolve(1)
    }
})
app.addBizModules(biz);
app.subscribe('cronjob.done', (topic, data) => {
    console.log(data)
})
app.subscribe('cronjob.error', (topic, data) => {
    console.log(data)
})
app.run()
