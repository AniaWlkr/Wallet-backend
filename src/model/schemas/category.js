const { Schema } = require('mongoose');

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
  },
  { versionKey: false, timestamps: true },
);

module.exports = { categorySchema };
