const nodemailer = require("nodemailer");
const mailConfig = require("../configs/mailConfig");

const sendEmailVerify = async (toEmail, username, otp) => {
  let transporter = nodemailer.createTransport({
    host: mailConfig.HOST,
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: mailConfig.FROM_EMAIL_ADDRESS,
      clientId: mailConfig.GOOGLE_CLIENT_ID,
      clientSecret: mailConfig.GOOGLE_SECRET_ID,
      refreshToken: mailConfig.GOOGLE_REFRESH_TOKEN,
    },
  });

  let mailOptions = {
    from: `Admin_Onstagram💎 <${mailConfig.FROM_EMAIL_ADDRESS}>`,
    to: toEmail,
    subject: "Verify Your Email Using OTP From Onstagrams",
    html: `<h1>Hello ✔ <span style="color:blue;text-align:center;">${username}</span> <p>I'm SonAdmin in Onstgrams Web,I Send Your OTP CODE IS => <span style="color:red;">${otp}</span> </p></h1>`,
  };

  await transporter.sendMail(mailOptions);
};

const notifyEmailIsConfirm = async (email) => {
  let transporter = nodemailer.createTransport({
    host: mailConfig.HOST,
    auth: {
      type: "OAuth2",
      user: mailConfig.FROM_EMAIL_ADDRESS,
      clientId: mailConfig.GOOGLE_CLIENT_ID,
      clientSecret: mailConfig.GOOGLE_SECRET_ID,
      refreshToken: mailConfig.GOOGLE_REFRESH_TOKEN,
    },
  });

  let mailOptions = {
    from: `Admin_Onstagram💎 <${mailConfig.FROM_EMAIL_ADDRESS}>`,
    to: email,
    subject: "Successfully Verify Your Email",
    html: `<h1>Email: ${email} Confirmed <p>Now you can <a href="http://localhost:3000/">LOGIN</a>  Onstagrams</p></h1>`,
  };

  await transporter.sendMail(mailOptions);
};

const sendMailForgotPass = async (currentEmail, username, codeRandom) => {
  let transporter = nodemailer.createTransport({
    host: mailConfig.HOST,
    auth: {
      type: "OAuth2",
      user: mailConfig.FROM_EMAIL_ADDRESS,
      clientId: mailConfig.GOOGLE_CLIENT_ID,
      clientSecret: mailConfig.GOOGLE_SECRET_ID,
      refreshToken: mailConfig.GOOGLE_REFRESH_TOKEN,
    },
  });

  let mailOptions = {
    from: `Admin_Onstagram💎 <${mailConfig.FROM_EMAIL_ADDRESS}>`,
    to: currentEmail,
    subject: "Using Token From Onstagrams To Reset Password",
    html: `<h1>Hello ✔ <span style="color:blue;text-align:center;">${username}</span> <p>Your TOKEN RESET PASSWORD => <span style="color:red;">${codeRandom}</span> </p></h1>`,
  };

  await transporter.sendMail(mailOptions);
};

const sendMailResetPassword = async (email, username) => {
  let transporter = nodemailer.createTransport({
    host: mailConfig.HOST,
    auth: {
      type: "OAuth2",
      user: mailConfig.FROM_EMAIL_ADDRESS,
      clientId: mailConfig.GOOGLE_CLIENT_ID,
      clientSecret: mailConfig.GOOGLE_SECRET_ID,
      refreshToken: mailConfig.GOOGLE_REFRESH_TOKEN,
    },
  });

  let mailOptions = {
    from: `Admin_Onstagram💎 <${mailConfig.FROM_EMAIL_ADDRESS}>`,
    to: email,
    subject: "Your Password Successfully Updated",
    html: `<h1>Hello ✔ <span style="color:blue;text-align:center;">${username}</span> <p>Now you can login new password</p></h1>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendEmailVerify,
  sendMailForgotPass,
  notifyEmailIsConfirm,
  sendMailResetPassword,
};
