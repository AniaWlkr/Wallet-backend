const Joi = require('joi');
const HttpCode = require('../helpers/constants');

const schemaSignUpUser = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string()
    .email({ minDomainSegments: 1, tlds: { allow: ['com', 'net', 'ua'] } })
    .required(),
  password: Joi.string().min(8).required(),
});

const schemaSignInUser = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 1, tlds: { allow: ['com', 'net', 'ua'] } })
    .required(),
  password: Joi.string().min(8).required(),
});

const validate = (schema, body, next) => {
  const { error } = schema.validate(body);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: HttpCode.BAD_REQUEST,
      message: message,
    });
  }
  next();
};

const validateSignUpUser = (req, _, next) => {
  validate(schemaSignUpUser, req.body, next);
};

const validateSignInUser = (req, _, next) => {
  validate(schemaSignInUser, req.body, next);
};

module.exports = { validateSignUpUser, validateSignInUser };
