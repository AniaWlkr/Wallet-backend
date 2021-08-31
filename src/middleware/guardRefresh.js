const passport = require('passport');

require('../config/passportRefresh');

const HttpCode = require('../helpers/constants');

const guard = (req, res, next) => {
  passport.authenticate('jwt2', { session: false }, (err, user) => {
    const headerAuth = req.get('Authorization');
    let token = null;
    if (headerAuth) {
      token = headerAuth.split(' ')[1];
    }

    if (err || !user || token !== user.refreshToken) {
      return next({
        status: HttpCode.UNAUTHORIZED,
        message: 'Not authorized',
      });
    }

    req.user = user.refreshToken;

    next();
  })(req, res, next);
};
module.exports = guard;
