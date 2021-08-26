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
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   Transaction:
 *     type: object
 *     required:
 *       - transType
 *       - date
 *       - month
 *       - year
 *       - sum
 *       - balance
 *       - categoryId
 *       - owner
 *     properties:
 *       id:
 *         type: string
 *         description: The auto-generated id of the transaction
 *       transType:
 *         type: string
 *         description: The type of the transaction 'income' or 'spend'
 *       date:
 *         type: String
 *         format: date
 *         description: The date of create transaction
 *       month:
 *         type: Number
 *         description: The month of create transaction
 *       year:
 *         type: Number
 *         description: The year of create transaction
 *       sum:
 *         type: Number
 *         description: Value of income or spend
 *       balance:
 *         type: Number
 *         description: Sum of income and spend values
 *       comment:
 *         type: string
 *         description: The comment to transaction
 *       categoryId:
 *         type: string
 *         description: The category id of transaction
 *       owner:
 *         type: string
 *         description: The owner id of this transaction
 *       createdAt:
 *         type: string
 *         format: date
 *         description: The date of the transaction creation
 *       updatedAt:
 *         type: string
 *         format: date
 *         description: The date of the transaction updated
 *     example:
 *       transType: spend
 *       date: 2021-08-23T00:00:00.000+00:00
 *       sum: 2000
 *       comment: some comment
 *       balance: 9000
 *       categoryId: 6122284cfd194a14a7cfe3c9
 *       owner: 6122e24471139f52f29f61f9
 *       month: 8
 *       year: 2021
 *       createdAt: 2021-08-24T15:20:53.957+00:00
 *       updatedAt: 2021-08-24T15:20:53.957+00:00
 */

router
  /**
   * @openapi
   * /api/transactions:
   *   post:
   *     tags: [Transactions]
   *     description: End-point for add new transaction
   *     summary: Add new transaction
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               transType:
   *                 type: string
   *                 example : spend
   *               date:
   *                 type: date
   *                 example : 2021-08-23
   *               sum:
   *                 type: Number
   *                 example : 2000
   *               comment:
   *                 type: string
   *                 example : some coment
   *               balance:
   *                 type: Number
   *                 example: 9000
   *               categoryId:
   *                 type: string
   *                 example : 6122284cfd194a14a7cfe3c9
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
   *                     transType:
   *                      type: string
   *                      description: Type of transaction 'spend' or 'income'.
   *                      example: spend
   *                     _id:
   *                       type: string
   *                       description: The transaction's id.
   *                       example: 61250e55283993330a85df6e
   *                     date:
   *                       type: string
   *                       example : 2021-08-23T00:00:00.000Z
   *                     sum:
   *                       type: Number
   *                       example : 2000
   *                     comment:
   *                       type: string
   *                       example : some coment
   *                     balance:
   *                       type: Number
   *                       example: 9000
   *                     categoryId:
   *                       type: string
   *                       example : 6122284cfd194a14a7cfe3c9
   *                     owner:
   *                       type: string
   *                       example : 6122e24471139f52f29f61f9
   *                     month:
   *                       type: Number
   *                       example : 8
   *                     year:
   *                       type: Number
   *                       example: 2021
   *                     createdAt:
   *                       type: string
   *                       example : 2021-08-24T15:29:54.369Z
   *                     updatedAt:
   *                       type: string
   *                       example : 2021-08-24T15:29:54.369Z
   *
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
   *                   example: Field sum is required
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
  .post('/', validateCreateTransaction, guard, ctrl.createTransaction);

/**
 * @openapi
 * /api/transactions?page=1&limit=5&transType=income&month=8&year=2021:
 *   get:
 *     tags: [Transactions]
 *     description: Retrieving the list of transactions
 *     summary: Get all transaction. Can be filtered by month and year.
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Page number
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         description: Quantity of transactions per page. Set 5 by default
 *         schema:
 *           type: number
 *       - in: query
 *         name: transType
 *         description: Transaction type
 *         schema:
 *           type: string
 *       - in: query
 *         name: month
 *         description: Month of transaction
 *         schema:
 *           type: number
 *       - in: query
 *         name: year
 *         description: Year of transaction
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Success
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
 *                     docs:
 *                       type: array
 *                       items:
 *                          type: object
 *                          properties:
 *                             transType:
 *                               type: string
 *                               description: Type of transaction 'spend' or 'income'.
 *                               example: spend
 *                             _id:
 *                               type: string
 *                               description: The transaction's id.
 *                               example: 61250e55283993330a85df6e
 *                             date:
 *                               type: string
 *                               example : 2021-08-23T00:00:00.000Z
 *                             sum:
 *                               type: double
 *                               example : 200.75
 *                             balance:
 *                               type: double
 *                               example: 9000.00
 *                             categoryId:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   example: 6122284cfd194a14a7cfe3c9
 *                                 categoryName:
 *                                   type: string
 *                                   example: Разное
 *                             owner:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   example : 6122e24471139f52f29f61f9
 *                                 name:
 *                                   type: string
 *                                   example : Kate
 *                                 email:
 *                                   type: string
 *                                   format: email
 *                                   example : kate@mail.com
 *                             month:
 *                               type: number
 *                               example : 8
 *                             year:
 *                               type: number
 *                               example: 2021
 *                             createdAt:
 *                               type: string
 *                               example : 2021-08-24T15:29:54.369Z
 *                             updatedAt:
 *                               type: string
 *                               example : 2021-08-24T15:29:54.369Z
 *                     totalDocs:
 *                       type: number
 *                       example: 4
 *                     limit:
 *                       type: number
 *                       example: 5
 *                     totalPages:
 *                       type: number
 *                       example: 1
 *                     page:
 *                       type: number
 *                       example: 1
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
router.get('/', guard, ctrl.getAllTransactions);
router
  /**
   * @openapi
   * /api/transactions/{transactionId}:
   *   get:
   *     tags: [Transactions]
   *     description: End-point for get  user's transaction by id
   *     summary: Get transaction by id
   *     parameters:
   *       - in: path
   *         name: TransactionId
   *         required: true
   *         description: Transaction id
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Success
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
   *                     transType:
   *                      type: string
   *                      description: Type of transaction 'spend' or 'income'.
   *                      example: spend
   *                     _id:
   *                       type: string
   *                       description: The transaction's id.
   *                       example: 61250e55283993330a85df6e
   *                     date:
   *                       type: string
   *                       example : 2021-08-23T00:00:00.000Z
   *                     sum:
   *                       type: Number
   *                       example : 2000
   *                     comment:
   *                       type: string
   *                       example : some coment
   *                     balance:
   *                       type: Number
   *                       example: 9000
   *                     categoryId:
   *                       type: object
   *                       properties:
   *                          _id:
   *                            type: string
   *                            example : 6122284cfd194a14a7cfe3c9
   *                          categoryName:
   *                            type: string
   *                            example : Дети
   *                     owner:
   *                       type: object
   *                       properties:
   *                          _id:
   *                            type: string
   *                            example : 6122e24471139f52f29f61f9
   *                          name:
   *                            type: string
   *                            example : Kate
   *                          email:
   *                            type: string
   *                            example : kate@mail.com
   *                     month:
   *                       type: Number
   *                       example : 8
   *                     year:
   *                       type: Number
   *                       example: 2021
   *                     createdAt:
   *                       type: string
   *                       example : 2021-08-24T15:29:54.369Z
   *                     updatedAt:
   *                       type: string
   *                       example : 2021-08-24T15:29:54.369Z
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
  .get('/:transactionId', guard, ctrl.getTransactionById);
router.delete('/:transactionId', guard, ctrl.deleteTransaction);
router.put('/:transactionId', guard, ctrl.updateTransaction);

module.exports = router;
