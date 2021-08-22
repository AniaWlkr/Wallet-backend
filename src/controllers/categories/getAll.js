const { CategoriesService } = require('../../services');
const HttpCode = require('../../helpers/constants');

const getAll = async (req, res, next) => {
  try {
    const result = await CategoriesService.getAll();
    res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getAll;
