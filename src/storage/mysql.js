const _ = require('lodash');
const assert = require('assert');

const MysqlStorage = function( options ){
  this._options = options;
  const { fpm } = options;
  assert(fpm.M != undefined, 'Mysql Plugin Required');
  this.M = fpm.M;
  this.logger = fpm.logger;
}

MysqlStorage.prototype._onStart = async function(params){
  // onStart;
  // create a task for save the job info
  const { id } = params;
  const NOW = _.now();
  const data = await this.M.createAsync({
    table: 'job_task',
    row: {
      createAt: NOW,
      updateAt: NOW,
      schedule_id: id,
      startAt: NOW,
      status: 'PENDING',
    }
  });
  return data.id;
}

MysqlStorage.prototype._onFinish = function(taskId, input){
  const NOW = _.now();
  let { result } = input;
  if(_.isObjectLike(result)){
    result = JSON.stringify(result);
  }
  this.M.updateAsync({
    table: 'job_task',
    condition: `id = ${ taskId }`,
    row: {
      finishAt: NOW,
      updateAt: NOW,
      status: 'DONE',
      result: `${result}`
    }
  }).catch(error => {
    this.logger.error(error);
  })
}

MysqlStorage.prototype._onError = function(taskId, input){
  const NOW = _.now();
  let { error } = input;
  if(_.isObjectLike(error)){
    error = JSON.stringify(error);
  }
  this.M.updateAsync({
    table: 'job_task',
    condition: `id = ${ taskId }`,
    row: {
      finishAt: NOW,
      updateAt: NOW,
      status: 'ERROR',
      error: `${error}`
    }
  }).catch(error => {
    this.logger.error(error);
  })
}

MysqlStorage.prototype._create = async function(args){
  if(_.isObjectLike(args.args)){
    args.args = JSON.stringify(args.args);
  }  
  const data = await this.M.createAsync({
    table: 'job_schedule',
    row: args,
  });
  return data.id;
}

MysqlStorage.prototype._cancel = function(args){
  const { id } = args;
  assert(id != undefined, 'Id required');
  this.M.removeAsync({
    table: 'job_schedule',
    id: id
  }).catch(err => {
    this.logger.error(err);
  })
  return 1;
}

MysqlStorage.prototype._pause = function( input){
  const NOW = _.now();
  let { id } = input;
  this.M.updateAsync({
    table: 'job_schedule',
    condition: `id = ${ id }`,
    row: {
      updateAt: NOW,
      autorun: 0,
    }
  }).catch(error => {
    this.logger.error(error);
  })
  return 1;
}

MysqlStorage.prototype._restart = function( input){
  const NOW = _.now();
  let { id } = input;
  this.M.updateAsync({
    table: 'job_schedule',
    condition: `id = ${ id }`,
    row: {
      updateAt: NOW,
      autorun: 1,
    }
  }).catch(error => {
    this.logger.error(error);
  })
  return 1;
}

MysqlStorage.prototype._get = async function(args){
  const { id } = args;
  const data = await this.M.getAsync({
    table: 'job_schedule',
    id,
  })

  return data;
}

MysqlStorage.prototype._list = async function(){
  const list = await this.M.findAsync({
    table: 'job_schedule',
    limit: 100,
  })
  return _.keyBy(list, 'id');
}


module.exports = (options) => {
  return new MysqlStorage(options);
};