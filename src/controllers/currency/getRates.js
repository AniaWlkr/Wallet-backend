const { CurrencyService } = require('../../services');
const HttpCode = require('../../helpers/constants');

const getRates = async (req, res, next) => {
  try {
    const result = await CurrencyService.getRates();
    res.json({
      status: 'success',
      code: HttpCode.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getRates;
