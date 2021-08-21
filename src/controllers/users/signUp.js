const { nanoid } = require('nanoid');
const {
  UsersService: serviceUser,
  /*  <--ON NEXT LINE  VERIFICATION EMAIL */
  // EmailService: serviceMail,
} = require('../../services');
const HttpCode = require('../../helpers/constants');
/*  <--ON NEXT LINE  VERIFICATION EMAIL */
// const { ErrorHandler } = require('../../helpers/errorHandler');

const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const user = await serviceUser.findByEmail(email);

    if (user) {
      return next({
        status: HttpCode.CONFLICT,
        message: 'Email in use',
      });
    }
    const verifyToken = nanoid();
    /* ON  VERIFICATION EMAIL */
    /*
    try {
      await serviceMail.sendEmail(verifyToken, email);
    } catch (error) {
      return next(
        new ErrorHandler(
          HttpCode.SERVICE_UNAVAILABLE,
          error.message,
          'Service unavailable',
        ),
      );
    }

    const newUser = await serviceUser.create({
      name,
      email,
      password,
      verifyToken,
    });
*/
    // ---------------------------------------------------------------------------------
    /* OFF  VERIFICATION EMAIL COMMIT NEXT BLOCK WHEN ON  VERIFICATION EMAIL */

    const verify = true;

    const newUser = await serviceUser.create({
      name,
      email,
      password,
      verifyToken,
      verify,
    });

    /* OFF  VERIFICATION EMAIL */
    // ---------------------------------------------------------------------------------

    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        user: {
          name: newUser.name,
          email: newUser.email,
        },
        message: 'Registration successful, please verify your email',
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = signUp;
