const express = require('express');
const router = express.Router();
const { transactionsControllers: ctrl } = require('../../src/controllers');
const {
  validateCreateTransaction,
} = require('../../src/validation/transactions');
const guard = require('../../src/middleware/guard');

/**
 * @openapi
 * tags:
 *   name: Transactions
 *   description: End-points for transactions.
 *
 * /api/transactions?page=1&limit=5&transType=income&month=8&year=2021:
 *   get:
 *     tags: [Transaction]
 *     summary: Returns list of transactions
 *     description:  Retrieving list of transactions
 *
 *     parameters:
 *        - in: header
 *         name: Authorization
 *         required: true
 *         description: Access Token
 *         schema:
 *           type: string
 *          - in: query
 *         name: page
 *         type: integer
 *         required: false
 *         description: Page number. #1 by default
 *          - in: query
 *         name: limit
 *         type: integer
 *         required: false
 *         description: Quantity of transactions per page. Set 5 by default.
 *           - in: query
 *         name: transType
 *         type: string
 *         required: false
 *         description: Type of transaction ['income', 'spend']
 *          - in: query
 *         name: month
 *         type: integer
 *         required: false
 *         description: Month to filter transactions
 *          - in: query
 *         name: year
 *         type: integer
 *         required: false
 *         description: Year to filter transactions
 *
 *     responses:
 *       200:
 *         description: Successfull operation
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
 *                       docs:
 *                        type: array
 *                        properties:
 *                            transType:
 *                              type: string
 *                              description: Type of transaction
 *                              example: income
 *                            _id:
 *                               type: integer
 *                               description: Transaction ID
 *                               example: 0
 *                             date:
 *                                type: string
 *                                format: date
 *                                description: Transaction date
 *                                example: 2021-08-24T00:00:00.000Z
 *                              sum:
 *                                type: double
 *                                minimum: 0.01
 *                               description: Transaction sum
 *                               example: 157.75
 *                              balance:
 *                                type: double
 *                               description: Balance
 *                               example: 12568.53
 *                               categoryId:
 *                                type: object
 *                                properties:
 *                                   _id:
 *                                    type: integer
 *                                    description: Category ID
 *                                    example: 0
 *                                  categoryName:
 *                                    type: string
 *                                    description: Categoty name
 *                                    example: Разное
 *                                owner:
 *                                type: object
 *                                properties:
 *                                   _id:
 *                                    type: integer
 *                                    description: User ID (owner)
 *                                    example: 0
 *                                  name:
 *                                    type: string
 *                                    description: User name
 *                                    example: Игорь
 *                                  email:
 *                                    type: string
 *                                    format: email
 *                                    description: User email
 *                                    example: test@mail.com
 *                                month:
 *                                  type: integer
 *                                  description: Month of transaction
 *                                  example: 8
 *                                year:
 *                                  type: integer
 *                                  description: Year of transaction
 *                                  example: 2021
 *                       createdAt:
 *                         type: string
 *                         format: date
 *                         description: Transaction' creation date
 *                         example: 2021-08-22T11:57:44.980+00:00
 *                       updatedAt:
 *                         type: string
 *                         format: date
 *                         description: Transaction' creation date
 *                         example: 2021-08-22T11:57:44.980+00:00
 *                     totalDocs:
 *                       type: integer
 *                       description: Total quantity of transactions
 *                       example: 24
 *                    limit:
 *                       type: integer
 *                       description: Quantity of transactions per page
 *                       example: 5
 *                    totalPages:
 *                       type: integer
 *                       description: Total quantity of transactions' pages
 *                       example: 2
 *                     page:
 *                       type: integer
 *                       description: Page number
 *                       example: 1
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
router.get('/', guard, ctrl.getAllTransactions);
router.post('/', validateCreateTransaction, guard, ctrl.createTransaction);
router.get('/:transactionId', guard, ctrl.getTransactionById);
router.delete('/:transactionId', guard, ctrl.deleteTransaction);
router.put('/:transactionId', guard, ctrl.updateTransaction);

module.exports = router;
