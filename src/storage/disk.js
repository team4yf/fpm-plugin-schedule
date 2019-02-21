const _ = require('lodash');
const fs = require('fs');
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

DiskStorage.prototype._save = function(){
  fs.createWriteStream(this.dbFilePath).write(JSON.stringify(this.jobDB), (err) => {
    if (err) throw err
  })
}

DiskStorage.prototype._create = function(args){
  const id = parseInt((_.max(_.keys(this.jobDB)) || 0)) + 1;
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


DiskStorage.prototype._list = function(){
  return Promise.resolve(this.jobDB);
}


module.exports = (options) => {
  return new DiskStorage(options);
};