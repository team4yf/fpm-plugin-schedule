## FPM-PLUGIN-SCHEDULE
用于管理定时任务的插件

### Install
```bash
npm i fpm-plugin-schedule --save
```

## Basic Info
- Run Action Hook Name: `BEFORE_SERVER_START`
- ExtendModule Name: `job`
- Exception
  - [x] `E.Job.JOB_CREATE_ERROR`
    ```javascript
    const E = {
      Job: {
        JOB_CREATE_ERROR: {
          errno: -10031, 
          code: 'JOB_CREATE_ERROR', 
          message: 'The args should be an object-like'
        }
      }
    }
    ```
- `getDependencies()`
  - [x] `[]`
- The Reference Of The `Bind()` Method
  An BizModule Object Contains The Belw Functions
  - [ ] `createCronJob`
  - [ ] `cancelJob(id:Number!)`
  - [ ] `getJobs`

### Useage

- Create A Job

  Call Function `job.createCronJob` 
  - Cycle Job Use Cron
    See Cron Detail -> [https://github.com/node-schedule/node-schedule#jobs-and-scheduling](https://github.com/node-schedule/node-schedule#jobs-and-scheduling)

- Get Jobs

  Call Function `job.getJobs()`

- Cancel Job

  Call Function `job.cancelJob(id:Number!)`


### Important

It will create schedule.json after you create anyone job

### Handle The Jobs' Result

You can call `fpm.subscribe('#cronjob/done')`; and the result in `data.result`
You should call `fpm.subscribe('#cronjob/error')`; and the error in `data.error`