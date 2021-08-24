const { TransactionService: service } = require('../../services');
const HttpCode = require('../../helpers/constants');

const deleteTransaction = async (req, res, next) => {
  const ownerId = req.user.id;
  const { transactionId } = req.params;

  if (!transactionId) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      status: 'error',
      code: STATUS_CODES.NOT_FOUND,
      message: 'Incorrect id. Not found',
    });
  }

  try {
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
