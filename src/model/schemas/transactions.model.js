const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema } = require('mongoose');

const transactionSchema = new Schema(
  {
    transType: {
      type: String,
      enum: ['spend', 'income'],
      default: 'spend',
      required: true,
    },
    date: {
      type: Date,
      min: '2020-01-01',
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    sum: {
      type: Number,
      required: [true, 'Укажите сумму транзакции'],
    },
    balance: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      maxlength: 250,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

transactionSchema.plugin(mongoosePaginate);

module.exports = { transactionSchema };
