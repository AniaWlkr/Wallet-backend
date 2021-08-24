const Joi = require('joi');

const schemaCreateTransaction = Joi.object({
  transType: Joi.string().allow('income', 'spend').only().required(),
  date: Joi.date().required(),
  sum: Joi.number().min(0.01).required(),
  balance: Joi.number().required(),
  comment: Joi.string().max(250).optional(),
  categoryId: Joi.string(),
  owner: Joi.string(),
});

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (error) {
    next({
      status: 400,
      message: `Field: ${error.message.replace(/"/g, '')}`,
    });
  }
};

const validateCreateTransaction = (req, res, next) => {
  validate(schemaCreateTransaction, req.body, next);
};

module.exports = { validateCreateTransaction };
