const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
  categoryName: {
    type: String,
    required: [true, 'Укажите название категории'],
  },
});

const Category = model('category', categorySchema);

module.exports = Category;
