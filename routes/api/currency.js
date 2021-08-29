const express = require('express');
const router = express.Router();
const { currencyControllers } = require('../../src/controllers');

router.get('/', currencyControllers.getRates);
router.post('/', currencyControllers.setRates);

module.exports = router;
