const item = require('./item');

exports.getAll = async () => {
    return await item.find({});
  };

exports.getByName = async(name) => {
  return await item.findOne({name})
}