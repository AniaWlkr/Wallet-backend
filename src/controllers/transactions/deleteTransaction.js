const { TransactionService: service } = require('../../services');
const { UsersService } = require('../../services');
const HttpCode = require('../../helpers/constants');

const deleteTransaction = async (req, res, next) => {
  const ownerId = req.user.id;
  const { transactionId } = req.params;

  if (!transactionId) {
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Incorrect id. Not found',
    });
  }

  try {
    // -------------------------------------------------------------------------
    const { docs, totalDocs } = await service.getAllTransactions(ownerId);
    const arr = [...docs];
    arr.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

    const transIndex = arr.findIndex(
      el => String(el._id) === String(transactionId),
    );

    const newArr = arr.filter(el => String(el._id) !== String(transactionId));

    if (newArr.length === 0) {
      await UsersService.updateBalance(ownerId, { balance: 0 });
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Transaction deleted',
      });
    }

    let initBalance = null;

    for (let i = transIndex; i < totalDocs - 1; i++) {
      console.log(i);
      initBalance =
        newArr[i].transType === 'income'
          ? newArr[i - 1].balance + newArr[i].sum
          : newArr[i - 1].balance - newArr[i].sum;

      if (i === 0) {
        initBalance =
          newArr[i + 1].transType === 'income'
            ? 0 + newArr[i + 1].sum
            : 0 - newArr[i + 1].sum;
      }
      await service.updateTransaction(ownerId, arr[i]._id, {
        balance: initBalance,
      });
    }

    const data = await service.getTransById(ownerId, newArr[totalDocs - 1]._id);
    console.log(data);

    await UsersService.updateBalance(ownerId, { balance: data.balance });
    // --------------------------------------------------------------------------

    const result = await service.deleteTransaction(ownerId, transactionId);

    res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      message: 'Transaction deleted',
      result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteTransaction;
