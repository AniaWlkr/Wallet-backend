const { TransactionService } = require('../../services');
const HttpCode = require('../../helpers/constants');

const createTransaction = async (req, res, next) => {
  const { date: value } = req.body;
  const date = new Date(value);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const ownerId = req.user.id;
  const { categoryId } = req.body;

  try {
    const result = await TransactionService.addTrans({
      ...req.body,
      owner: ownerId,
      month,
      year,
    });

    res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = createTransaction;
