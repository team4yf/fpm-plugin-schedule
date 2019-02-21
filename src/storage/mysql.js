const _ = require('lodash');
const assert = require('assert');

const MysqlStorage = function( options ){
  this._options = options;
  const { fpm } = options;
  assert(fpm.M != undefined, 'Mysql Plugin Required');
  this.M = fpm.M;
  this.logger = fpm.logger;
}

MysqlStorage.prototype._create = async function(args){
  args.args = JSON.stringify(args.args);
  const data = await this.M.createAsync({
    table: 'job_schedule',
    row: args,
  });
  return data.id;
}

MysqlStorage.prototype._cancel = function(args){
  const { id } = args;
  assert(!_.isEmpty(id), 'Id required');
  this.M.removeAsync({
    table: 'job_schedule',
    id: id
  }).catch(err => {
    this.logger.error(err);
  })
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