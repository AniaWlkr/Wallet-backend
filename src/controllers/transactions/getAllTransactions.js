const { TransactionService } = require('../../services');
const HttpCode = require('../../helpers/constants');

const getAllTransactions = async (req, res, next) => {
  try {
    const ownerId = req.user.id;

    const result = await TransactionService.getAllTrans(ownerId, req.query);
    res.json({
      status: 'success',
      code: HttpCode.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllTransactions;
