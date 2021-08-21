const { Schema } = require('mongoose');

const categorySchema = new Schema(
  {
    categoryName: {
      type: String,
      required: [true, 'Укажите название категории'],
    },
  },
  { versionKey: false, timestamps: true },
);

module.exports = { categorySchema };
