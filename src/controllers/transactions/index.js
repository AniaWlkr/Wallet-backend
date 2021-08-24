const createTransaction = require('./createTransaction');
const getAllTransactions = require('./getAllTransactions');
const getTransactionById = require('./getTransactionById');
const updateTransaction = require('./updateTransaction');
const deleteTransaction = require('./deleteTransaction');

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
