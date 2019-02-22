const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const DiskStorage = function( options ){
  this._options = options;
  const { filename, fpm } = options;
  this.dbFilePath = path.join(fpm.get('CWD'), filename);
  if(fs.existsSync(this.dbFilePath)){
    this.jobDB = require(this.dbFilePath);
  }else{
    this.jobDB = {}
  }
}

DiskStorage.prototype._onStart = function(){
  // onStart;
  return -1;
}

DiskStorage.prototype._onFinish = function(taskId, input){
}

DiskStorage.prototype._pause = function( input){
  const { id } = input;
  this.jobDB[id].autorun = 0;
  this._save();
  return 1;
}

DiskStorage.prototype._restart = function( input){
  const { id } = input;
  this.jobDB[id].autorun = 1;
  this._save();
  return 1;
}

DiskStorage.prototype._onError = function(taskId, input){

}

DiskStorage.prototype._save = function(){
  fs.createWriteStream(this.dbFilePath).write(JSON.stringify(this.jobDB), (err) => {
    if (err) throw err
  })
}

DiskStorage.prototype._create = function(args){
  const id = parseInt((_.max(_.keys(this.jobDB)) || 0)) + 1;
  args.id = id;
  this.jobDB[id] = args;
  this._save();
  return id;
}

DiskStorage.prototype._cancel = function(args){
  const { id } = args;
  assert(!_.isEmpty(id), 'Id required');
  delete this.jobDB[id];
  // save it
  this._save();
}

DiskStorage.prototype._get = function(args){
  const { id } = args;
  return Promise.resolve(this.jobDB[id]);
}

DiskStorage.prototype._list = function(){
  return Promise.resolve(this.jobDB);
}


module.exports = (options) => {
  return new DiskStorage(options);
};