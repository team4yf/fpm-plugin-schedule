## FPM-PLUGIN-SCHEDULE
用于管理定时任务的插件

### Install
```bash
yarn add fpm-plugin-schedule
```

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

You can call `fpm.subscribe('cronjob.done')`; and the result in `data.result`
You should call `fpm.subscribe('cronjob.error')`; and the error in `data.error`