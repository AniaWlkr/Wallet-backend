const express = require('express');
const router = express.Router();
const { transactionsControllers: ctrl } = require('../../src/controllers');
const {
  validateCreateTransaction,
} = require('../../src/validation/transactions');
const guard = require('../../src/middleware/guard');

router.post('/', validateCreateTransaction, guard, ctrl.createTransaction);
router.get('/', guard, ctrl.getAllTransactions);
router.get('/:transactionId', guard, ctrl.getTransactionById);
router.delete('/:transactionId', guard, ctrl.deleteTransaction);
router.put('/:transactionId', guard, ctrl.updateTransaction);

module.exports = router;
