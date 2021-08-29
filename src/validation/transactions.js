const Joi = require('joi');
const HttpCode = require('../helpers/constants');

const schemaCreateTransaction = Joi.object({
  transType: Joi.string().allow('income', 'spend').only().required(),
  date: Joi.date().required(),
  sum: Joi.number().min(0.01).required(),
  // balance: Joi.number().required(),
  // balance: Joi.number(),
  comment: Joi.string().max(250),
  categoryId: Joi.string(),
  owner: Joi.string(),
});

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (error) {
    next({
      status: HttpCode.BAD_REQUEST,
      message: `Field: ${error.message.replace(/"/g, '')}`,
    });
  }
};

const validateCreateTransaction = (req, res, next) => {
  validate(schemaCreateTransaction, req.body, next);
};

module.exports = { validateCreateTransaction };
