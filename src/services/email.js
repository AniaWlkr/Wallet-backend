const sgMail = require('@sendgrid/mail');
const Mailgen = require('mailgen');

const { SENDGRID_API_KEY, PORT, SENDER_EMAIL } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

const emailTemplate = verifyToken => {
  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'SiteName',
      link: `http://localhost:${PORT}/`,
    },
  });
  const message = {
    body: {
      name: 'new User',
      intro: "Welcome to our site! We're very excited to have you on board.",
      action: {
        instructions: 'To get verify your email, please click here:',
        button: {
          color: '#22BC66',
          text: 'Confirm your account',
          link: `http://localhost:${PORT}/api/users/verify/${verifyToken}`,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
  const emailBody = mailGenerator.generate(message);
  return emailBody;
};

const sendEmail = async (verifyToken, email) => {
  const emailBody = emailTemplate(verifyToken);

  const msg = {
    to: email,
    from: SENDER_EMAIL,
    subject: 'User email verification',
    html: emailBody,
  };

  await sgMail.send(msg);
};

module.exports = { sendEmail };
