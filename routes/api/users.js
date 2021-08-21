const router = require('express').Router();
const { createAccountLimit } = require('../../src/config/rateLimit.json');

const { usersControllers } = require('../../src/controllers');
const limiter = require('../../src/middleware/limiter');
const {
  validateSignUpUser,
  validateSignInUser,
} = require('../../src/validation/users');
const guard = require('../../src/middleware/guard');

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: End-points for users.
 */
router
  .post(
    '/signup',
    limiter(createAccountLimit),
    validateSignUpUser,
    usersControllers.signUp,
  )
  .get('/verify/:verificationToken', usersControllers.verification)
  .post('/login', validateSignInUser, usersControllers.login)
  .post('/logout', guard, usersControllers.logout)
  .post('/updateTokens', guard, usersControllers.updateTokens);

module.exports = router;
