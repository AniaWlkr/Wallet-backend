const Joi = require('joi');

const categorySchema = Joi.object({
  categoryName: Joi.string().min(1).required(),
});

module.exports = categorySchema;
