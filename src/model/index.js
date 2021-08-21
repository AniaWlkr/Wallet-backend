const { model } = require('mongoose');

const { userSchema } = require('./schemas/user');
const { transactionSchema } = require('./schemas/transactions.model');
const { categorySchema } = require('./schemas/categories.model');

const User = model('user', userSchema);
const Transaction = model('transaction', transactionSchema);
const Category = model('category', categorySchema);

module.exports = { User, Transaction, Category };
