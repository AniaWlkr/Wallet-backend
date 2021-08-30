const { TransactionService: service } = require('../../services');
const { UsersService } = require('../../services');
const HttpCode = require('../../helpers/constants');

const updateTransaction = async (req, res, next) => {
  const newData = req.body;
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
        message: `No transaction with id ${transactionId} found`,
      });
    }

    await service.updateTransaction(ownerId, transactionId, newData);
    // ---------------------------------------------------------------------------------
    const { docs, totalDocs } = await service.getAllTransactions(ownerId);
    const arr = [...docs];
    arr.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

    const transIndex = arr.findIndex(
      el => String(el._id) === String(transactionId),
    );

    let initBalance = null;
    const startBalance = 0;

    if (transIndex === 0) {
      initBalance =
        arr[0].transType === 'income'
          ? Number(startBalance) + Number(arr[0].sum)
          : Number(startBalance) - Number(arr[0].sum);

      await service.updateTransaction(ownerId, arr[transIndex]._id, {
        balance: initBalance,
      });
    } else {
      initBalance =
        req.body.transType === 'income'
          ? Number(arr[transIndex - 1].balance) + Number(arr[transIndex].sum)
          : Number(arr[transIndex - 1].balance) - Number(arr[transIndex].sum);

      await service.updateTransaction(ownerId, arr[transIndex]._id, {
        balance: initBalance,
      });
    }

    for (let i = transIndex + 1; i < totalDocs; i++) {
      initBalance =
        arr[i].transType === 'income'
          ? Number(initBalance) + Number(arr[i].sum)
          : Number(initBalance) - Number(arr[i].sum);
      await service.updateTransaction(ownerId, arr[i]._id, {
        balance: initBalance,
      });
    }
    const data = await service.getTransById(ownerId, arr[totalDocs - 1]._id);
    // ----------------------------------------------------------------------------

    // if (!result) {
    //   return res.status(HttpCode.NOT_FOUND).json({
    //     status: 'error',
    //     code: HttpCode.NOT_FOUND,
    //     message: `No transaction with id ${transactionId} found`,
    //   });
    // }

    await UsersService.updateBalance(ownerId, { balance: data.balance });
    const result = await service.getTransById(ownerId, transactionId);

    return res.status(HttpCode.OK).json({
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
