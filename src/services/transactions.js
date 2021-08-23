const { Transaction } = require('../model');

const addTrans = (ownerId, body) => {
  const result = Transaction.create(ownerId, body);
  return result;
};

const getAllTrans = ownerId => {
  const result = Transaction.find({ owner: ownerId });
  return result;
};

const getTransById = (ownerId, transId) => {
  const result = Transaction.findOne({
    _id: transId,
    owner: ownerId,
  });
  return result;
};

module.exports = {
  addTrans,
  getAllTrans,
  getTransById,
};
