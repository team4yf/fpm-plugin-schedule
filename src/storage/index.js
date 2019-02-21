const DiskStorage = require('./disk');
const MysqlStorage = require('./mysql');

module.exports = (options) => {
  const { storage } = options;
  if(storage == 'disk'){
    return DiskStorage(options);
  }
  return MysqlStorage(options);
};