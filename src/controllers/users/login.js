const { AuthService: serviceAuth } = require('../../services');
const HttpCode = require('../../helpers/constants');

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await serviceAuth.login({ email, password });

    if (result?.verifyMessage)
      return next({
        status: HttpCode.UNAUTHORIZED,
        message: result.verifyMessage,
      });

    if (result) {
      return res
        .cookie('refreshToken', result.refreshToken, {
          signed: true,
          httpOnly: true,
        })
        .status(HttpCode.OK)
        .json({
          status: 'success',
          code: HttpCode.OK,
          data: { ...result },
        });
    }
    next({
      status: HttpCode.UNAUTHORIZED,
      message: 'Email or password is wrong',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = login;
