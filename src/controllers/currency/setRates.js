const axios = require('axios');
const { CurrencyService } = require('../../services');
const HttpCode = require('../../helpers/constants');

const setRates = async (req, res, next) => {
  const URL =
    'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';

  try {
    const { data } = await axios.get(URL);
    // console.log('setRates -> rates', data);
    // rates?.map(rate=>await CurrencyService.setRates(rates.data));
    const result = await CurrencyService.setRates(data);
    res.json({
      status: 'success',
      code: HttpCode.OK,
      message: 'Currency rate added',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = setRates;
