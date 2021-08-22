const express = require('express');
const router = express.Router();
const { categoriesControllers } = require('../../src/controllers');

router.get('/', categoriesControllers.getAll);

module.exports = router;
