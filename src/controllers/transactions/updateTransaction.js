const { TransactionService: service } = require('../../services');
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
