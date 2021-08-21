const Joi = require('joi');

const transactionSchema = Joi.object({
  transType: Joi.string().allow('income', 'spend').only().required(),
  date: Joi.date().reqired(),
  month: Joi.number().reqired(),
  year: Joi.number().reqired(),
  sum: Joi.number().reqired(),
  comment: Joi.string().max(250),
});

module.exports = transactionSchema;
