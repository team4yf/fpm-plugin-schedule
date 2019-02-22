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
  - [ ] `createCronJob(args)`
  - [ ] `cancelJob(id:Number!)`
  - [ ] `getJobs`
  - [ ] `getJob(id:Number)`
  - [ ] `pauseJob(id:Number)`
  - [ ] `restartJob(id:Number)`
  - [ ] `callJob(id:Number)`
  

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

**In Disk Mode It will create schedule.json after you create anyone job**

**In Mysql Mode It should connect a mysql server**


### Handle The Jobs' Result

You can call `fpm.subscribe('#cronjob/done')`; and the result in `data.result`
You should call `fpm.subscribe('#cronjob/error')`; and the error in `data.error`

### Webhook

Only support `POST` the `JSON` webhook!

You can add the webhook address when you create the schedule, it will be called after the job finished!

the arguments of the webhook should like
```javascript
{
  code: 0/-1, // 0: ok, -1: error
  content: {}, // the result / error content.
}
```