const { AuthService: serviceAuth } = require('../../services');
const HttpCode = require('../../helpers/constants');

const logout = async (req, res, next) => {
  const id = req.user.id;
  await serviceAuth.logout(id);
  return res.status(HttpCode.NO_CONTENT).json({ status: HttpCode.NO_CONTENT });
};

module.exports = logout;
