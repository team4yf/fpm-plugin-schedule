'use strict';
import { Fpm, Biz } from 'yf-fpm-server'
import plugin from '../src'
let app = new Fpm()
plugin.bind(app)

let biz = new Biz('0.0.1');
biz.addSubModules('demo',{
    foo: () => {
        console.log('demo.foo called')
        Pormise.resolve(1)
    }
})
app.addBizModules(biz);

app.run()
