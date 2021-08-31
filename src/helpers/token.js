const jwt = require('jsonwebtoken');
const ms = require('ms');

const {
  JWT_SECRET_KEY_ACCESS,
  JWT_SECRET_KEY_REFRESH,
  ACCESS_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_EXPIRE_TIME,
} = process.env;

const createTokens = id => {
  const payload = { id };
  const accessToken = payload =>
    jwt.sign(payload, JWT_SECRET_KEY_ACCESS, {
      expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
    });

  const refreshToken = payload =>
    jwt.sign(payload, JWT_SECRET_KEY_REFRESH, {
      expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
    });

  const accessTokenExpireAt = new Date(
    ms(ACCESS_TOKEN_EXPIRE_TIME) + Date.now(),
  );
  const refreshTokenExpireAt = new Date(
    ms(REFRESH_TOKEN_EXPIRE_TIME) + Date.now(),
  );

  const newTokens = {
    accessToken: accessToken(payload),
    accessTokenExpireAt,
    refreshToken: refreshToken(payload),
    refreshTokenExpireAt,
  };

  return newTokens;
};

const verifyRefreshToken = refreshToken => {
  try {
    jwt.verify(refreshToken, JWT_SECRET_KEY_REFRESH);
    return true;
  } catch (error) {
    return false;
  }
};

const getIdUser = ( refreshToken) => {
  const result = jwt.decode(refreshToken, JWT_SECRET_KEY_REFRESH);
  if (!result) return null;
  return result;
};

module.exports = { createTokens, verifyRefreshToken, getIdUser };
