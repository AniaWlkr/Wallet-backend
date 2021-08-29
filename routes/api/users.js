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
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         verify:
 *           type: boolean
 *           description: Is user verify email?
 *         verifyToken:
 *           type: string
 *           description: The verify token of the user
 *         accessToken:
 *           type: string
 *           description: The access token of the user
 *         refreshToken:
 *           type: string
 *           description: The refresh token of the user
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date of the user creation
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date of the user updated
 *       example:
 *         name: test
 *         email: test@example.com
 *         password: 12345678
 *         verify: false
 *         verifyToken: null
 *         accessToken: null
 *         refreshToken: null
 *         createdAt: 2021-08-18T19:30:05.799+00:00
 *         updatedAt: 2021-08-18T19:30:05.799+00:00
 */

router
  /**
   * @openapi
   * /api/users/signup:
   *   post:
   *     tags: [Users]
   *     description: End-point for registration of users
   *     summary: Register users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example : testname
   *               email:
   *                 type: string
   *                 example : testemail@gmail.com
   *               password:
   *                 type: string
   *                 example : 12345678
   *     responses:
   *       201:
   *         description: Created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example : success
   *                 code:
   *                   type: number
   *                   example: 201
   *                 data:
   *                   type: object
   *                   properties:
   *                     user:
   *                       type: object
   *                       properties:
   *                         name:
   *                          type: string
   *                          description: The user's name.
   *                          example: test
   *                         email:
   *                           type: string
   *                           description: The user's email.
   *                           example: test@gmail.com
   *                     message:
   *                       type: string
   *                       description: Service message
   *                       example: Registration successful, please verify your email
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example : error
   *                 code:
   *                   type: number
   *                   example: 400
   *                 message:
   *                   type: string
   *                   description: Service message
   *                   example: \email\ is required
   *       409:
   *         description: Conflict
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example : error
   *                 code:
   *                   type: number
   *                   example: 409
   *                 message:
   *                   type: string
   *                   description: Service message
   *                   example: Email in use
   *       429:
   *         description: Too many request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example : error
   *                 code:
   *                   type: number
   *                   example: 429
   *                 message:
   *                   type: string
   *                   description: Service message
   *                   example: Too many request from this IP, please try again after an hour
   *
   *       500:
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example : fail
   *                 code:
   *                   type: number
   *                   example: 500
   *                 message:
   *                   type: string
   *                   description: Service message
   *                   example: Internal Server Error
   *                 data:
   *                   type: string
   *                   description: Service message
   *                   example: Internal Server Error
   */
  .post(
    '/signup',
    limiter(createAccountLimit),
    validateSignUpUser,
    usersControllers.signUp,
  )

  /**
   * @openapi
   * /api/users/verify/:verificationToken:
   *   get:
   *     tags: [Users]
   *     description: End-point for verification email. After successful verification redirect for login page
   *     summary: Verification email.
   *     responses:
   *       404:
   *          description: User not found.
   *       500:
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example : fail
   *                 code:
   *                   type: number
   *                   example: 500
   *                 message:
   *                   type: string
   *                   description: Service message
   *                   example: Internal Server Error
   *                 data:
   *                   type: string
   *                   description: Service message
   *                   example: Internal Server Error
   */
  .get('/verify/:verificationToken', usersControllers.verification)

  /**
   * @openapi
   * /api/users/login:
   *   post:
   *     tags: [Users]
   *     description: End-point for login users
   *     summary: Login users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example : test@gmail.com
   *               password:
   *                 type: string
   *                 example : 12345678
   *     responses:
   *       200:
   *         description: Login success
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example : success
   *                 code:
   *                   type: number
   *                   example: 200
   *                 data:
   *                   type: object
   *                   properties:
   *                     accessToken:
   *                       type: string
   *                       description: Access Token
   *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMWRmN2YwMWZiYWI1MWQ3ODZmNDc1NSIsImlhdCI6MTYyOTM3Nzc3NSwiZXhwIjoxNjI5Mzc3Nzc1fQ.ZnzGmtum4XSQ8kAKLxwlETcaMmuOJWZbdM7LUpCYwIw
   *                     refreshToken:
   *                       type: string
   *                       description: Refresh Token
   *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMWRmN2YwMWZiYWI1MWQ3ODZmNDc1NSIsImlhdCI6MTYyOTM3Nzc3NSwiZXhwIjoxNjI5Mzc3Nzc1fQ.uSWIJUl1YP2tpkGIA9WQuMGvc7Mfh--lM5TswkaJRzE
   *                     user:
   *                       type: object
   *                       properties:
   *                         name:
   *                          type: string
   *                          description: The user's name.
   *                          example: test
   *                         email:
   *                           type: string
   *                           description: The user's email.
   *                           example: test@gmail.com
   *                     message:
   *                       type: string
   *                       description: Service message
   *                       example: Authentication successful
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example : error
   *                 code:
   *                   type: number
   *                   example: 400
   *                 message:
   *                   type: string
   *                   description: Service message
   *                   example: \password\ length must be at least 8 characters long
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example : error
   *                 code:
   *                   type: number
   *                   example: 401
   *                 message:
   *                   type: string
   *                   description: Service message
   *                   example: Please verify your email
   *       429:
   *         description: Too many request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example : error
   *                 code:
   *                   type: number
   *                   example: 429
   *                 message:
   *                   type: string
   *                   description: Service message
   *                   example: Too many request from this IP, please try again after an hour
   *       500:
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example : fail
   *                 code:
   *                   type: number
   *                   example: 500
   *                 message:
   *                   type: string
   *                   description: Service message
   *                   example: Internal Server Error
   *                 data:
   *                   type: string
   *                   description: Service message
   *                   example: Internal Server Error
   */
  .post('/login', validateSignInUser, usersControllers.login)
  /**
   * @openapi
   * /api/users/logout:
   *   post:
   *     tags: [Users]
   *     description: End-point for logout users
   *     summary: Logout users
   *     security:
   *       - tokenAuth: []
   *     responses:
   *       204:
   *         description: No content.
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example : error
   *                 code:
   *                   type: number
   *                   example: 401
   *                 message:
   *                   type: string
   *                   description: Service message
   *                   example: Not authorized
   *       500:
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example : fail
   *                 code:
   *                   type: number
   *                   example: 500
   *                 message:
   *                   type: string
   *                   description: Service message
   *                   example: Internal Server Error
   *                 data:
   *                   type: string
   *                   description: Service message
   *                   example: Internal Server Error
   */
  .post('/logout', guard, usersControllers.logout)
  /**
   * @openapi
   * /api/users/updateTokens:
   *   post:
   *     tags: [Users]
   *     description: End-point for update tokens
   *     summary: Update tokens
   *     security:
   *       - tokenAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               refreshToken:
   *                 type: string
   *                 example : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMWRmN2YwMWZiYWI1MWQ3ODZmNDc1NSIsImlhdCI6MTYyOTM3Nzc3NSwiZXhwIjoxNjI5Mzc3Nzc1fQ.uSWIJUl1YP2tpkGIA9WQuMGvc7Mfh--lM5TswkaJRzE
   *     responses:
   *       200:
   *         description: Token updated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example : success
   *                 code:
   *                   type: number
   *                   example: 200
   *                 data:
   *                   type: object
   *                   properties:
   *                     accessToken:
   *                       type: string
   *                       description: Access Token
   *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMWRmN2YwMWZiYWI1MWQ3ODZmNDc1NSIsImlhdCI6MTYyOTM3Nzc3NSwiZXhwIjoxNjI5Mzc3Nzc1fQ.ZnzGmtum4XSQ8kAKLxwlETcaMmuOJWZbdM7LUpCYwIw
   *                     refreshToken:
   *                       type: string
   *                       description: Refresh Token
   *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMWRmN2YwMWZiYWI1MWQ3ODZmNDc1NSIsImlhdCI6MTYyOTM3Nzc3NSwiZXhwIjoxNjI5Mzc3Nzc1fQ.uSWIJUl1YP2tpkGIA9WQuMGvc7Mfh--lM5TswkaJRzE
   *                     message:
   *                       type: string
   *                       description: Service message
   *                       example: Tokens updated successful
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example : error
   *                 code:
   *                   type: number
   *                   example: 401
   *                 message:
   *                   type: string
   *                   description: Service message
   *                   example: Not authorized
   *       500:
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example : fail
   *                 code:
   *                   type: number
   *                   example: 500
   *                 message:
   *                   type: string
   *                   description: Service message
   *                   example: Internal Server Error
   *                 data:
   *                   type: string
   *                   description: Service message
   *                   example: Internal Server Error
   */
  .post('/updateTokens', guard, usersControllers.updateTokens)

  /**
   * @openapi
   * /api/users/current:
   *   get:
   *     tags: [Users]
   *     summary: Current users
   *     description: Retrieving data of the current user
   *     security:
   *       - tokenAuth: []
   *     responses:
   *       200:
   *         description: Сurrent user data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example : success
   *                 code:
   *                   type: number
   *                   example: 200
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                       description: The user ID.
   *                       example: 0
   *                     name:
   *                       type: string
   *                       description: The user's name
   *                       example: Name Surname
   *                     email:
   *                       type: string
   *                       description: The user's email
   *                       example: test@example.com
   *                     balance:
   *                       type: number
   *                       description: The user's balance
   *                       example: 0.00
   *                     createdAt:
   *                       type: string
   *                       format: date
   *                       description: The user's date creation
   *                       example: 2021-08-22T11:57:44.980+00:00
   *
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example : error
   *                 code:
   *                   type: number
   *                   example: 401
   *                 message:
   *                   type: string
   *                   description: Service message
   *                   example: Not authorized
   *       500:
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example : fail
   *                 code:
   *                   type: number
   *                   example: 500
   *                 message:
   *                   type: string
   *                   description: Service message
   *                   example: Internal Server Error
   *                 data:
   *                   type: string
   *                   description: Service message
   *                   example: Internal Server Error
   */

  .get('/current', guard, usersControllers.current);

module.exports = router;
