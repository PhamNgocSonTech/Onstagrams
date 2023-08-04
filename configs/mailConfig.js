const dotenv = require("dotenv").config();

module.exports = {
  HOST: process.env.HOST_SMTP,
  FROM_EMAIL_ADDRESS: process.env.ADMIN_EMAIL_ADDRESS,
  PASS_EMAIL_ADDRESS: process.env.ADMIN_PASS_ADDRESS,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_SECRET_ID: process.env.GOOGLE_MAILER_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
};
