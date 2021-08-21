const { UsersService: serviceUsers } = require('../../services');
const HttpCode = require('../../helpers/constants');

const verification = async (req, res, next) => {
  try {
    const result = await serviceUsers.verify(req.params);
    if (result) {
      return res.redirect('http://google.com'); // add site_url for redirect to login page
    } else {
      return next({
        status: HttpCode.NOT_FOUND,
        message: 'User not found',
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = verification;
