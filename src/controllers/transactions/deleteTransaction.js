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
    const { docs, totalDocs } = await service.getAllTransactions(ownerId);
    const arr = [...docs];

    if (arr.length === 1) {
      await UsersService.updateBalance(ownerId, { balance: 0 });
      await service.deleteTransaction(ownerId, transactionId);
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Transaction deleted',
      });
    }

    arr.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

    const transIndex = arr.findIndex(
      el => String(el._id) === String(transactionId),
    );

    if (transIndex === arr.length - 1) {
      await UsersService.updateBalance(ownerId, {
        balance: arr[transIndex - 1].balance,
      });
      await service.deleteTransaction(ownerId, transactionId);
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Transaction deleted',
      });
    }

    for (let i = transIndex + 1; i < totalDocs; i++) {
      const startBalance =
        arr[i - 1].transType === 'income'
          ? arr[i - 1].balance - arr[i].sum
          : arr[i - 1].balance + arr[i].sum;

      const initBalance =
        arr[i].transType === 'income'
          ? startBalance + arr[i].sum
          : startBalance - arr[i].sum;

      await service.updateTransaction(ownerId, arr[i]._id, {
        balance: initBalance,
      });
    }

    const data = await service.getTransById(ownerId, arr[totalDocs - 1]._id);
    // console.log(data);

    await UsersService.updateBalance(ownerId, { balance: data.balance });
    // --------------------------------------------------------------------------

    await service.deleteTransaction(ownerId, transactionId);
    // const result = await service.deleteTransaction(ownerId, transactionId);

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      message: 'Transaction deleted',
      // result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteTransaction;
