## 2.2.3(2019-03-26)
Change
- Update the `fpm-plugin-mysql`
- autorun the sql scripts

## 2.2.0

Add
- support more data storage method.
  - [x] Mysql
  - [x] Disk
  
## 2.1.0

Change
- Remove `yarn.lock`
- Add `nodemon.json`

Fixbugs
- add type check in `JSON.parse`
  ```javascript
  // ignore parse JSON if args is object ;
  if( _.isString(args)){
    args = JSON.parse(args || '{}')
  }
  ```

## 2.0.2

Change 
  - Create Job Accept `args(Object?)`

