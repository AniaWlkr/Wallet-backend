const express = require('express');
const router = express.Router();
const { categoriesControllers } = require('../../src/controllers');

/**
 * @openapi
 * tags:
 *   name: Categories
 *   description: End-point for categories.
 *
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Returns list of categories
 *     description:  Retrieving list of categories' name
 *
 *     parameters: []
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
 *                       id:
 *                         type: integer
 *                         description: Category ID
 *                         example: 0
 *                       categoryName:
 *                         type: string
 *                         description: Category name
 *                         example: Mischellaneous
 *                       createdAt:
 *                         type: string
 *                         format: date
 *                         description: Category's creation date
 *                         example: 2021-08-22T11:57:44.980+00:00
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
router.get('/', categoriesControllers.getAll);

/**
 * @openapi
 *   components:
 *     schemas:
 *       Category:
 *         type: object
 *         required:
 *           - categoryName
 *         properties:
 *           id:
 *             type: string
 *             description: The auto-generated id of the category
 *           categoryName:
 *             type: string
 *             description: The name of the category
 *           createdAt:
 *             type: string
 *             format: date
 *             description: The date of category' creation
 *           updatedAt:
 *             type: string
 *             format: date
 *             description: The date of category' update
 *         example:
 *           categoryName: test
 *           createdAt: 2021-08-18T19:30:05.799+00:00
 *           updatedAt: 2021-08-18T19:30:05.799+00:00
 *
 */

module.exports = router;
