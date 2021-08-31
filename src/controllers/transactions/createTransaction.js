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
      ? Number(req.user.balance) + Number(req.body.sum)
      : Number(req.user.balance) - Number(req.body.sum);

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

    const docs = await TransactionService.getAllTransactions(ownerId);

    if (docs.length > 1) {
      const arr = [...docs];
      arr.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

      const transIndex = arr.findIndex(
        el => String(el._id) === String(transactionId),
      );

      let initBalance = null;

      if (transIndex === 0) {
        const startBalance =
          arr[transIndex + 1].transType === 'income'
            ? Number(arr[transIndex + 1].balance) -
              Number(arr[transIndex + 1].sum)
            : Number(arr[transIndex + 1].balance) +
              Number(arr[transIndex + 1].sum);

        initBalance =
          req.body.transType === 'income'
            ? Number(startBalance) + Number(req.body.sum)
            : Number(startBalance) - Number(req.body.sum);

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
            ? Number(arr[transIndex - 1].balance) + Number(req.body.sum)
            : Number(arr[transIndex - 1].balance) - Number(req.body.sum);

        await TransactionService.updateTransaction(
          ownerId,
          arr[transIndex]._id,
          {
            balance: initBalance,
          },
        );
      }

      for (let i = transIndex + 1; i < arr.length; i++) {
        initBalance =
          arr[i].transType === 'income'
            ? Number(initBalance) + Number(arr[i].sum)
            : Number(initBalance) - Number(arr[i].sum);
        await TransactionService.updateTransaction(ownerId, arr[i]._id, {
          balance: initBalance,
        });
      }
    }

    const result = await TransactionService.getTransById(
      ownerId,
      transactionId,
    );
    await UsersService.updateBalance(ownerId, { balance: result.balance });

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
