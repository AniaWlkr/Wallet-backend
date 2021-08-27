const { TransactionService: service } = require('../../services');
const { UsersService } = require('../../services');
const HttpCode = require('../../helpers/constants');

const updateTransaction = async (req, res, next) => {
  const newData = req.body;
  const ownerId = req.user.id;
  const { transactionId } = req.params;

  try {
    const result = await service.updateTransaction(
      ownerId,
      transactionId,
      newData,
    );
    // ---------------------------------------------------------------------------------
    const { docs, totalDocs } = await service.getAllTransactions(ownerId);
    const arr = [...docs];
    arr.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

    const transIndex = arr.findIndex(
      el => String(el._id) === String(transactionId),
    );

    let initBalance = arr[transIndex].balance;

    for (let i = transIndex + 1; i < totalDocs; i++) {
      initBalance =
        arr[i].transType === 'income'
          ? initBalance + arr[i].sum
          : initBalance - arr[i].sum;
      await service.updateTransaction(ownerId, arr[i]._id, {
        balance: initBalance,
      });
    }
    const { data } = await service.getTransById(
      ownerId,
      arr[totalDocs - 1]._id,
    );
    await UsersService.updateBalance(ownerId, { balance: data.balance });
    // ----------------------------------------------------------------------------

    if (!result) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: `No transaction with id ${transactionId} found`,
      });
    }

    res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updateTransaction;
