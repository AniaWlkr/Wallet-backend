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
    },
    year: {
      type: Number,
    },
    sum: {
      type: Number,
      required: [true, 'Укажите сумму транзакции'],
    },
    comment: {
      type: String,
      maxlength: 250,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      default: 'разное',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true },
);

transactionSchema.plugin(mongoosePaginate);

module.exports = { transactionSchema };
