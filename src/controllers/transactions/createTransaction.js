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
    const data = await TransactionService.addTrans(newTransactions);

    const transactionId = data._id;

    const docs = await TransactionService.getAllTransactions(ownerId);

    if (docs.length > 1) {
      const arr = [...docs];

      const sortArr = arr.sort(
        (a, b) => Date.parse(a.date) - Date.parse(b.date),
      );

      const transactionBalance = [];

      sortArr.reduce((acc, el) => {
        acc =
          el.transType === 'income'
            ? Number(acc) + Number(el.sum)
            : Number(acc) - Number(el.sum);

        transactionBalance.push({ id: el._id, balance: acc });

        return acc;
      }, 0);

      await Promise.all(
        transactionBalance.map(
          async el =>
            await TransactionService.updateTransaction(ownerId, el.id, {
              balance: el.balance,
            }),
        ),
      );
    }

    const result = await TransactionService.getTransById(
      ownerId,
      transactionId,
    );

    await UsersService.updateBalance(ownerId, { balance: newUserBalance });

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
