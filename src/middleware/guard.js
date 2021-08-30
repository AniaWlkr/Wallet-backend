const passport = require('passport');

const { verifyRefreshToken } = require('../helpers/token');
require('../config/passport');

const HttpCode = require('../helpers/constants');

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    const headerAuth = req.get('Authorization');
    let token = null;
    if (headerAuth) {
      token = headerAuth.split(' ')[1];
    }
    const { refreshToken } = req.cookies;
    console.log(refreshToken);
    if (err || !user || token !== user.accessToken) {
      const { refreshToken } = req.body;
      // refreshToken.replaceAll(/);
      const isVerifyRefreshToken = verifyRefreshToken(refreshToken);

      if (isVerifyRefreshToken & (token === user.refreshToken)) {
        req.user = {
          accessToken: token,
          refreshToken,
        };
        return next();
      }

      return next({
        status: HttpCode.UNAUTHORIZED,
        message: 'Not authorized',
      });
    }

    req.user = user;

    next();
  })(req, res, next);
};
module.exports = guard;
