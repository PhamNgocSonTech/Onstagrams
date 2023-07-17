const nodemailer = require("nodemailer");
const mailConfig = require("../configs/mailConfig");
const fs = require("fs");
const path = require("path");

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
  const emailTemplatePath = path.join(
    __dirname,
    "../public/html/templateEmailVerify.html"
  );
  const emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");
  let mailOptions = {
    from: `Admin_Onstagram💎 <${mailConfig.FROM_EMAIL_ADDRESS}>`,
    to: toEmail,
    subject: "Verify Your Email Using OTP From Onstagrams",
    html: emailTemplate.replace("{username}", username).replace("{otp}", otp),
    // html: `<h1>Hello ✔ <span style="color:blue;text-align:center;">${username}</span> <p>I'm SonAdmin in Onstgrams Web,I Send Your OTP CODE IS => <span style="color:red;">${otp}</span> </p></h1>`,
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
  const emailNotifyPath = path.join(
    __dirname,
    "../public/html/notifyEmailVerify.html"
  );
  const emailNotify = fs.readFileSync(emailNotifyPath, "utf8");
  let mailOptions = {
    from: `Admin_Onstagram💎 <${mailConfig.FROM_EMAIL_ADDRESS}>`,
    to: email,
    subject: "Successfully Verify Your Email",
    html: emailNotify.replace("{email}", email),
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

  const emailForgotPasswordPath = path.join(
    __dirname,
    "../public/html/templateEmailForgotPass.html"
  );
  const emailForgot = fs.readFileSync(emailForgotPasswordPath, "utf8");
  let mailOptions = {
    from: `Admin_Onstagram💎 <${mailConfig.FROM_EMAIL_ADDRESS}>`,
    to: currentEmail,
    subject: "Using Token From Onstagrams To Reset Password",
    html: emailForgot
      .replace("{username}", username)
      .replace("{codeRandom}", codeRandom),
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
  const emailNotifyForgotPassPath = path.join(
    __dirname,
    "../public/html/notifyPasswordReset.html"
  );
  const notifyResetPass = fs.readFileSync(emailNotifyForgotPassPath, "utf8");
  let mailOptions = {
    from: `Admin_Onstagram💎 <${mailConfig.FROM_EMAIL_ADDRESS}>`,
    to: email,
    subject: "Your Password Successfully Updated",
    html: notifyResetPass.replace("{username}", username),
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendEmailVerify,
  sendMailForgotPass,
  notifyEmailIsConfirm,
  sendMailResetPassword,
};
