const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { UsersService: serviceUser } = require('../services');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET_KEY_REFRESH;

const params = {
  secretOrKey: SECRET_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  'jwt2',
  new Strategy(params, async (payload, done) => {
    try {
      const user = await serviceUser.findById(payload.id);
      if (!user) return done(new Error('User not found'));
      if (!user.refreshToken) return done(null, false);
      return done(null, user);
    } catch (error) {
      done(error);
    }
  }),
);
