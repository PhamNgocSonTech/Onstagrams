// PACKAGE REQUIRE
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const {
  // sendEmailVerify,
  sendMailForgotPass,
  notifyEmailIConfirm,
  sendMailResetPassword,
} = require("../services/emailServices");
const { OAuth2Client } = require("google-auth-library");
const { nanoid } = require("nanoid");
const passport = require("passport");
require("../utils/passport");

// MODELS REQUIRE
const VerificationMail = require("../models/VerificationMail");
const ResetToken = require("../models/ResetToken");
const { generateOTP } = require("../utils/generateOTP");
const User = require("../models/User");
const { sendEmailVerify } = require('../utils/sendEmailVerify')

// ENV CONFIG REQUIRE
const dotenv = require("dotenv").config();

// DECLARE VARIABLE refreshTokens IS TYPE ARRAY TO STORE REFRESH_TOKEN ELEMENT
let refreshTokens = [];

const CLIENT_URL = "http://localhost:3000/";

// CONFIG FOR GOOGLE SEND MAIL
// Khởi tạo OAuth2Client với Client ID và Client Secret
const myOAuth2Client = new OAuth2Client(
  process.env.GOOGLE_MAILER_CLIENT_ID,
  process.env.GOOGLE_MAILER_CLIENT_SECRET
);

// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
});

// NEW REGISTER CAN SEND OTP CODE TO EMAIL FOR USERS
const registerUser = async (req, res) => {
  try {
    const { fullName, username, email, password, gender, bio, external } =
      req.body;

    const userName = await User.findOne({ username: username });
    if (userName)
      return res.status(400).json({ msg: "This user name already exists." });

    const userEmail = await User.findOne({ email });
    if (userEmail)
      return res.status(400).json({ msg: "This email already exists." });

    if (password.length < 6)
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters." });
    const newUser = new User({
        fullName,
        username,
        email,
        password,
        gender,
        bio,
        external,
    });

    const accessTokenJWT = jwt.sign(
      {
        _id: newUser._id,
        username: newUser.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    await newUser.save();

    const otp = generateOTP();
    const hashOtp = await bcrypt.hash(otp, 10)
    const verificationMail = await VerificationMail.create({
        user: newUser._id,
        token: hashOtp,
        expiresAt: Date.now() + 15 * 60 * 1000 // 15 phút
    });
    verificationMail.save();
    /**
     */
    await sendEmailVerify(newUser.email, newUser.username, otp);
    res.status(200).json({
      Status: "Pending",
      msg: "Register Success! Please check your email",
      accessTokenJWT,
      user: {
        ...newUser._doc,
      },
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// VERIFY EMAIL WHEN USE REGISTERED
const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  const getUser = await User.findById(userId);
  if (!getUser) return res.status(400).json("User Not Found");
  if (getUser.verifed) return res.status(400).json("User Already Verified");

  const getToken = await VerificationMail.findOne({ user: getUser._id });
  if (!getToken) return res.status(400).json("OTP Not Found");
  if(getToken.expiresAt < Date.now()) return res.status(400).json("OTP Expired");

  const checkMatch = await bcrypt.compareSync(otp, getToken.token);
  if (!checkMatch) return res.status(400).json("WRONG OTP");

  getUser.verifed = true;
  await VerificationMail.findByIdAndDelete(getToken._id);
  await getUser.save();
  await notifyEmailIConfirm(getUser.email);

  const accessToken = jwt.sign(
    {
      _id: getUser._id,
      username: getUser.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  const { password, ...other } = getUser._doc;

  return res.status(200).json({msg: "Email verified", other, accessToken });
};

// NEW LOGIN CAN CREATE ACCESS_TOKEN AND REFRESH_TOKEN
const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json("User doesn't found");

    const Comparepassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!Comparepassword) return res.status(400).json("Password error");
    let data = {
      _id: user._id,
      username: user.username,
    };
    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "7d",
    });
    const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    const { password, ...other } = user._doc;
    res
      .status(200)
      .json({ msg: "Login Success", other, accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// LOGOUT USER WILL DELETE REFRESH_TOKEN
const logout = (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((refToken) => refToken !== refreshToken);
  res.status(200).json("Logout Success");
};

const forgotPassword = async (req, res) => {
  //const {email} = req.body
  const getEmail = await User.findOne({ email: req.body.email });
  if (!getEmail) return res.status(500).json("User not found");

  const token = await ResetToken.findOne({ userEmail: getEmail.email });
  if (token) return res.status(500).json("Token already exists");

  const codeRandom = nanoid(10);
  const resetToken = new ResetToken({
    userEmail: getEmail.email,
    token: codeRandom,
  });
  resetToken.save();
  await sendMailForgotPass(getEmail.email, getEmail.username, codeRandom);
  res
    .status(200)
    .json({ msg: "Send Success! Please check your email to reset password" });
};

const resetPassword = async (req, res) => {
  try {
    const { password, token, email } = req.body;

    if (!token) {
      return res.status(500).json("Request failed");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(500).json("User not found");
    }
    const resetToken = await ResetToken.findOne({ userEmail: user.email });
    if (!resetToken) {
      return res.status(500).json("Reset token not found");
    }

    const isMatch = await bcrypt.compareSync(token, resetToken.token);
    if (!isMatch) {
      return res.status(500).json("Wrong reset token!!! Please try again");
    }
    user.password = password;
    await ResetToken.findByIdAndDelete(resetToken._id);

    // const hashPass = await bcrypt.hash(password, 10)
    // user.password = hashPass
    await user.save();

    await sendMailResetPassword(user.email, user.username);
    res.status(200).json({ msg: "Reset Password Success!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// REFRESH ACCESS_TOKEN WHEN IT EXPIRES
const refreshToken = async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.status(401).json("Refresh token not valid");
  if (!refreshTokens.includes(refreshToken))
    return res.status(401).json("Refresh token not found");
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    console.log(err, data);
    if (err) res.status(403);
    const accessToken = jwt.sign(
      {
        _id: data._id,
        username: data.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).json({ accessToken });
  });
};

// Function for generating jwt tokens
// const generateJwtToken = (user) => {
//   jwt.sign({user: req.user }, process.env.SESSION_SECRET, {expiresIn: '7d'});
//   return token;
// };

// This is the route for initiating the OAuth flow to Google

const google = passport.authenticate("google", { scope: ["profile", "email"] });
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    successRedirect: "CLIENT_URL",
  }),
  (req, res) => {
    jwt.sign(
      { user: req.user },
      process.env.SESSION_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          return res.json({
            token: null,
          });
        }
        res.json({ token });
      }
    );
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  (req, res) => {
    jwt.sign(
      { user: req.user },
      process.env.SESSION_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          return res.json({ token: null });
        }
        return res.json({ token });
      }
    );
  }
);

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  google,
  logout,
  forgotPassword,
  resetPassword,
  refreshToken,
};

// ***********CANCELED CODE***********
/* SEND MAIL
router.post('/send/mail', async (req, res) => {
    let subject = "Hello ✔️ This is mail for test send mail from Onstagrams"
    let contentHtml = '<b>Hello Mail Send Success</b>'
    // Generate test SMTP service account from ethereal.email
   // const info =  mailer.sendMail('khahankhung@gmail.com',subject,contentHtml)
    let transporter = nodemailer.createTransport({
      host: mailConfig.HOST,
      //port: 465,
      //secure: true,
      auth: {
      type: "OAuth2",
      user: mailConfig.FROM_EMAIL_ADDRESS,
      clientId: mailConfig.GOOGLE_CLIENT_ID,
      clientSecret: mailConfig.GOOGLE_SECRET_ID,
      refreshToken: mailConfig.GOOGLE_REFRESH_TOKEN                              
      },
    });
   
    let info = await transporter.sendMail({
      from: '"Admin_Onstagram💎" <phamngocson7a1@gmail.com>', 
      to: "khahankhung@gmail.com", 
      subject: "Hello ✔ This is mail for test send mail from Onstagrams", 
      //text: "Hello For Test", 
      html: "<b>Hello Mail Send Success</b>", 
    });
  
    console.log("Message sent: %s", info.messageId);
  
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  
  
  
  
})

router.post("/logout", verifyToken, async (req, res) => {
        try {
            req.user.token
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
})


REGISTER OLD
router.post("/register",  async(req, res) => {
    try {
        //hash password  => generate new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        //save data from input body to newUser
            const newUser = await new User({
                // username: "son",
                // email: "son@gmail.com",
                // password: "123",
            
                //get data from body input
                username: req.body.username,
                fullname: req.body.fullname,
                gender: req.body.gender,
                email: req.body.email,
                password: hashedPassword,
                
            })
        
        // save data from client to database and response
        const user = await newUser.save()
        res.status(200).json(user)
    } catch(err){
        return res.status(400).json({err: 'Something wrong hrouterened!!! Try again'})
    }
})


LOGIN OLD
router.post("/login", async(req, res) => {
try {
    const user = await User.findOne({email:req.body.email})
    !user && res.status(404).json("User Not Found")
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(404).json("Opps!! Wrong password, Please input again")
    res.status(200).json(user)
}catch(err){
    //console.log(err)
    return res.status(401).json(err)
}
})
 */
// This is the callback\redirect url after the OAuth login at Facebook.
/* router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateJwtToken(req.user);
    res.cookie('jwt', token);
    res.redirect('/');
  }
);

// Navigating to the root url will ask passport to check for a valid token
router.get('/', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), (req, res) => {
    //res.render('home', { user: req.user });
  }
);

router.get('/logoutSso', (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/');
});


router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/",
  })
);


router.get("/facebook", passport.authenticate("facebook", { scope: ["profile"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/",
  })
); */

// This is the callback\redirect url after the OAuth login at Google.
/* router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    const token = generateJwtToken(req.user);
    res.cookie('jwt', token);
    res.redirect('/');
  }
);

router.get("/facebook/callback", passport.authenticate("facebook", {
    successRedirect: "http://localhost:3000/",
    // failureRedirect: "/login/failed",
  })
);
 */
