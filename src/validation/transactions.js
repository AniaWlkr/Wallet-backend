const Joi = require('joi');

const transactionSchema = Joi.object({
  transType: Joi.string().allow('income', 'spend').only().required(),
  date: Joi.date().required(),
  month: Joi.number().required(),
  year: Joi.number().required(),
  sum: Joi.number().required(),
  comment: Joi.string().max(250),
});

module.exports = transactionSchema;
