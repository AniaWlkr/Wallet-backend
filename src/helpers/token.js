const jwt = require('jsonwebtoken');

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

  const newTokens = {
    accessToken: accessToken(payload),
    refreshToken: refreshToken(payload),
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

const getIdUser = (accessToken, refreshToken) => {
  const resultOne = jwt.decode(accessToken, JWT_SECRET_KEY_ACCESS);
  const resultTwo = jwt.decode(refreshToken, JWT_SECRET_KEY_REFRESH);
  if (resultOne.id !== resultTwo.id) return null;
  return resultTwo.id;
};

module.exports = { createTokens, verifyRefreshToken, getIdUser };
