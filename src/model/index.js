const { model } = require('mongoose');

const { userSchema } = require('./schemas/user');
const { transactionSchema } = require('./schemas/transaction');
const { categorySchema } = require('./schemas/category');

const User = model('user', userSchema);
const Transaction = model('transaction', transactionSchema);
const Category = model('category', categorySchema);

module.exports = { User, Transaction, Category };
