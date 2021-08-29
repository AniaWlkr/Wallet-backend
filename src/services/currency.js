const { Currency } = require('../model');

const getRates = () => {
  const result = Currency.find();
  return result;
};

const setRates = rates => {
  return rates.map(rate => Currency.create(rate));
};

module.exports = {
  getRates,
  setRates,
};
