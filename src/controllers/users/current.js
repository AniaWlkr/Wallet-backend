const { UsersService: serviceUsers } = require('../../services');
const HttpCode = require('../../helpers/constants');

const current = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await serviceUsers.findById(userId);
    if (!result) {
      res.status(HttpCode.UNAUTHORIZED).json({
        status: HttpCode.UNAUTHORIZED,
        message: 'Not authorized',
      });
    }
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        id: result.id,
        name: result.name,
        email: result.email,
        balance: result.balance,
        createdAt: result.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = current;
