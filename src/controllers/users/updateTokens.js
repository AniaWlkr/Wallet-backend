const { AuthService: serviceAuth } = require('../../services');
const HttpCode = require('../../helpers/constants');

const updateTokens = async (req, res, next) => {
  const { accessToken, refreshToken } = req.user;

  try {
    const result = await serviceAuth.updateTokens(accessToken, refreshToken);

    if (!result) {
      return next({
        status: HttpCode.UNAUTHORIZED,
        message: 'Not authorized',
      });
    }

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { ...result },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updateTokens;
