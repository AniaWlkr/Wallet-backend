const { TransactionService: service } = require('../../services');
const { UsersService } = require('../../services');
const HttpCode = require('../../helpers/constants');

const deleteTransaction = async (req, res, next) => {
  const ownerId = req.user.id;
  const { transactionId } = req.params;

  try {
    const isPresentTransaction = await service.getTransById(
      ownerId,
      transactionId,
    );

    if (!isPresentTransaction) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Incorrect id. Not found',
      });
    }

    // -------------------------------------------------------------------------
    await service.deleteTransaction(ownerId, transactionId);

    const docs = await service.getAllTransactions(ownerId);

    const arr = [...docs];

    if (arr.length === 0) {
      await UsersService.updateBalance(ownerId, { balance: 0 });
      await service.deleteTransaction(ownerId, transactionId);
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Transaction deleted',
      });
    }

    const transactionBalance = [];

    arr
      .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
      .reduce((acc, el) => {
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
          await service.updateTransaction(ownerId, el.id, {
            balance: el.balance,
          }),
      ),
    );

    await UsersService.updateBalance(ownerId, {
      balance: transactionBalance[transactionBalance.length - 1].balance,
    });

    // --------------------------------------------------------------------------

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      message: 'Transaction deleted',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteTransaction;
