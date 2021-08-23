const { TransactionService } = require('../../services');
const HttpCode = require('../../helpers/constants');

const getTransactionById = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const ownerId = req.user.id;
    const result = await TransactionService.getTransById(
      ownerId,
      transactionId,
    );

    if (!result) {
      res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Transaction with this id is not found',
      });
      return;
    }

    res.json({
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

module.exports = getTransactionById;
