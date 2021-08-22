const { Category } = require('../model');

const getAll = () => {
  const result = Category.find();
  return result;
};

module.exports = {
  getAll,
};
