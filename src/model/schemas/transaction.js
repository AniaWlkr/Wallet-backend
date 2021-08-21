const { Schema, SchemaTypes } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const transactionSchema = new Schema(
  {
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    commentary: {
      type: String,
      default: 'Please add commentary',
    },
    money: {
      type: Number,
      default: 0,
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true },
);

transactionSchema.plugin(mongoosePaginate);
module.exports = { transactionSchema };
