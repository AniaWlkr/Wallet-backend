const { Schema } = require('mongoose');

const currencySchema = new Schema(
  {
    ccy: {
      type: String,
    },
    base_ccy: {
      type: String,
    },
    buy: {
      type: String,
    },
    sale: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true },
);

module.exports = { currencySchema };
