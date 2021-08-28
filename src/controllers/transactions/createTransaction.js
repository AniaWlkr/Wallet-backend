const { TransactionService } = require('../../services');
const { UsersService } = require('../../services');
const HttpCode = require('../../helpers/constants');

const createTransaction = async (req, res, next) => {
  const { date: value } = req.body;
  const date = new Date(value);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const ownerId = req.user.id;

  const newUserBalance =
    req.body.transType === 'income'
      ? req.user.balance + req.body.sum
      : req.user.balance - req.body.sum;

  const newTransactions = {
    ...req.body,
    owner: ownerId,
    balance: newUserBalance,
    month,
    year,
  };

  try {
    await UsersService.updateBalance(ownerId, { balance: newUserBalance });

    const data = await TransactionService.addTrans(newTransactions);

    const transactionId = data._id;

    const { docs, totalDocs } = await TransactionService.getAllTransactions(
      ownerId,
    );

    if (totalDocs > 1) {
      const arr = [...docs];
      arr.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

      const transIndex = arr.findIndex(
        el => String(el._id) === String(transactionId),
      );

      let initBalance = null;

      if (transIndex === 0) {
        const startBalance =
          arr[transIndex + 1].transType === 'income'
            ? arr[transIndex + 1].balance - arr[transIndex + 1].sum
            : arr[transIndex + 1].balance + arr[transIndex + 1].sum;

        initBalance =
          req.body.transType === 'income'
            ? startBalance + req.body.sum
            : startBalance - req.body.sum;

        await TransactionService.updateTransaction(
          ownerId,
          arr[transIndex]._id,
          {
            balance: initBalance,
          },
        );
      } else {
        initBalance =
          req.body.transType === 'income'
            ? arr[transIndex - 1].balance + req.body.sum
            : arr[transIndex - 1].balance - req.body.sum;

        await TransactionService.updateTransaction(
          ownerId,
          arr[transIndex]._id,
          {
            balance: initBalance,
          },
        );
      }

      for (let i = transIndex + 1; i < totalDocs; i++) {
        initBalance =
          arr[i].transType === 'income'
            ? initBalance + arr[i].sum
            : initBalance - arr[i].sum;
        await TransactionService.updateTransaction(ownerId, arr[i]._id, {
          balance: initBalance,
        });
      }
    }

    const result = await TransactionService.getTransById(
      ownerId,
      transactionId,
    );

    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = createTransaction;
