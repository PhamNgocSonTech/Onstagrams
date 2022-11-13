// PACKAGE REQUIRE
const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const {OAuth2Client} = require('google-auth-library')
const { nanoid } = require('nanoid');
const passport = require('passport')
require('../utils/passport')


// UTILS REQUIRE
const cloudinary = require('../utils/cloudinary')
const upload = require('../utils/multer')
const mailConfig = require('../utils/mail')
const {verifyToken} = require('../utils/verifyToken')

// MODELS REQUIRE
const VerificationMail = require('../models/VerificationMail')
const ResetToken = require("../models/ResetToken")
const {generateOTP} = require('../utils/generateOTP')
const User = require('../models/User')

// ENV CONFIG REQUIRE
const dotenv = require('dotenv').config()


// DECLARE VARIABLE refreshTokens IS TYPE ARRAY TO STORE REFRESH_TOKEN ELEMENT
let refreshTokens = []

//const CLIENT_URL = "http://localhost:3000";


// CONFIG FOR GOOGLE SEND MAIL
// Khởi tạo OAuth2Client với Client ID và Client Secret 
const myOAuth2Client = new OAuth2Client(
    process.env.GOOGLE_MAILER_CLIENT_ID,
    process.env.GOOGLE_MAILER_CLIENT_SECRET
  )
// Set Refresh Token vào OAuth2Client Credentials
  myOAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN
  })

// NEW REGISTER CAN SEND OTP CODE TO EMAIL FOR USERS
router.post("/register", async(req, res) => {
    try {
        const { fullname, username, email, password, gender, bio, external } = req.body
        // let newUserName = username.toLowerCase().replace(/ /g, '')

        const userName = await User.findOne({username: username})
        if(userName) return res.status(400).json({msg: "This user name already exists."})

        const userEmail = await User.findOne({email})
        if(userEmail) return res.status(400).json({msg: "This email already exists."})

        if(password.length < 6)
        return res.status(400).json({msg: "Password must be at least 6 characters."})

        //hash password  => generate new password
        /* const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt) */
        // const passwordHash = await bcrypt.hash(password, 12)

        const newUser = new User({
            fullname, username, email, password: hashedPassword, gender, bio, external
        })

        const accessTokenJWT = jwt.sign({
                    _id: newUser._id,
                    username: newUser.username
          }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
          await newUser.save()
          
          const OTP = generateOTP();
          const verificationMail = await VerificationMail.create({
              user: newUser._id,
              token: OTP
          })
          verificationMail.save();
          /**
           */
          let transporter = nodemailer.createTransport({
            host: mailConfig.HOST,
            auth: {
            type: "OAuth2",
            user: mailConfig.FROM_EMAIL_ADDRESS,
            clientId: mailConfig.GOOGLE_CLIENT_ID,
            clientSecret: mailConfig.GOOGLE_SECRET_ID,
            refreshToken: mailConfig.GOOGLE_REFRESH_TOKEN                              
            },
          });
         
          let mailOptions = {
            from: `Admin_Onstagram💎 <${mailConfig.FROM_EMAIL_ADDRESS}>`, 
            to: newUser.email, 
            subject: 'Verify your email using OTP from Onstagrams', 
            html:`<h1>Hello ✔ <span style="color:blue;text-align:center;">${newUser.username}</span> <p>I'm SonAdmin in Onstgrams Web,I Send Your OTP CODE IS => <span style="color:red;">${OTP}</span> </p></h1>`, 
          };

          await transporter.sendMail(mailOptions)
          res.status(200).json({
            Status:"Pending" , 
            msg:"Register Success! Please check your email", 
            accessTokenJWT,
            user: {
                      ...newUser._doc,
                  }
            })
        // res.status(200).json({
        //     msg: 'Register Success!',
        //     accessTokenJWT,
        //     user: {
        //         ...newUser._doc,
        //         password: ''
        //     }
        // })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

// VERIFY EMAIL WHEN USE REGISTERED
router.post('/verify/mail', async(req, res) => {
    const {userId, otp} = req.body
    const getUser = await User.findById(userId)
    if(!getUser) return res.status(400).json('User Not Found')
    if(getUser.verifed === true)return res.status(400).json('User Already Verify Mail')
    const getToken = await VerificationMail.findOne({user: getUser._id})
    if(!getToken)return res.status(400).json('OTP Not Found')
    const checkMatch = await bcrypt.compareSync(otp, getToken.token)
    if(!checkMatch)return res.status(400).json('WRONG OTP')
    getUser.verifed = true;
    await VerificationMail.findByIdAndDelete(getToken._id)
    getUser.save()
    const accessToken = jwt.sign({
        _id: getUser._id,
        username: getUser.username
    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m' });
    const {password , ...other} = getUser._doc

    let transporter = nodemailer.createTransport({
      host: mailConfig.HOST,
      auth: {
      type: "OAuth2",
      user: mailConfig.FROM_EMAIL_ADDRESS,
      clientId: mailConfig.GOOGLE_CLIENT_ID,
      clientSecret: mailConfig.GOOGLE_SECRET_ID,
      refreshToken: mailConfig.GOOGLE_REFRESH_TOKEN                              
      },
    });
   
    let mailOptions = {
      from: `Admin_Onstagram💎 <${mailConfig.FROM_EMAIL_ADDRESS}>`, 
      to: getUser.email, 
      subject: 'Successfully verify your email', 
      html:`<h1>Now you can login Onstagrams</h1>`, 
    };

    await transporter.sendMail(mailOptions)
 
      return res.status(200).json({other , accessToken})

})

// NEW LOGIN CAN CREATE ACCESS_TOKEN AND REFRESH_TOKEN
router.post("/login", async(req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user)return res.status(400).json("User doesn't found")  
        

        const Comparepassword = await bcrypt.compare(req.body.password , user.password);
        if(!Comparepassword) return res.status(400).json("Password error")
        let data = {
            _id: user._id,
            username: user.username
        }
        const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
        const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
        refreshTokens.push(refreshToken);
        const {password , ...other} = user._doc
        res.status(200).json({other , accessToken, refreshToken});
                  
    } catch (err) {
          res.status(500).json({msg: err.message});        
    }     
})

// Function for generating jwt tokens
// const generateJwtToken = (user) => {
//   jwt.sign({user: req.user }, process.env.SESSION_SECRET, {expiresIn: '7d'});
//   return token;
// };

// This is the route for initiating the OAuth flow to Google
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']})
);

// This is the route for initiating the OAuth flow to Facebook
/* router.get('/facebook',
  passport.authenticate('facebook', { scope: 'email' })
); */


// This is the callback\redirect url after the OAuth login at Google.
// router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
//     const token = generateJwtToken(req.user);
//     res.cookie('jwt', token);
//     res.redirect('/');
//   }
// );
router.get("/google/callback", passport.authenticate('google', { session: false }), (req, res) => {
    jwt.sign({ user: req.user }, process.env.SESSION_SECRET, { expiresIn: "1h" }, (err, token) => {
        if (err) {
          return res.json({
            token: null,
          });
        }
        res.json({token});
      });
  }
);


// This is the callback\redirect url after the OAuth login at Facebook.
/* router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateJwtToken(req.user);
    res.cookie('jwt', token);
    res.redirect('/');
  }
); */

// Navigating to the root url will ask passport to check for a valid token
router.get('/', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), (req, res) => {
    //res.render('home', { user: req.user });
  }
);

router.get('/logoutSso', (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/');
});


/* router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

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
// LOGOUT USER WILL DELETE REFRESH_TOKEN
router.post('/logout', (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((refToken) => refToken !== refreshToken);
  res.status(200).json('Logout Success');
});

router.post('/forgot/password', async(req, res) => {
  const {email} = req.body
  const user = await User.findOne({email: email})
  if(!user) return res.status(500).json('User not found')
  const token = await ResetToken.findOne({user: user._id})
  if(token) return res.status(500).json('Token already exists')
  const codeRandom = nanoid(10)
  const resetToken = new ResetToken({
    user: user._id,
    token: codeRandom
  })
  resetToken.save()
  
  let transporter = nodemailer.createTransport({
    host: mailConfig.HOST,
    auth: {
    type: "OAuth2",
    user: mailConfig.FROM_EMAIL_ADDRESS,
    clientId: mailConfig.GOOGLE_CLIENT_ID,
    clientSecret: mailConfig.GOOGLE_SECRET_ID,
    refreshToken: mailConfig.GOOGLE_REFRESH_TOKEN                              
    },
  });
 
  let mailOptions = {
    from: `Admin_Onstagram💎 <${mailConfig.FROM_EMAIL_ADDRESS}>`, 
    to: user.email, 
    subject: 'Using Token From Onstagrams To Reset Password', 
    html:`<h1>Hello ✔ <span style="color:blue;text-align:center;">${user.username}</span> <p>Your TOKEN RESET PASSWORD => <span style="color:red;">${codeRandom}</span> </p></h1>`, 
  };

  await transporter.sendMail(mailOptions)
  res.status(200).json({msg:"Send Success! Please check your email to reset password"})

})

router.put('/reset/password', verifyToken, async(req, res) => {
  try{
    const {password, token} = req.body
  if(!token || !req.user._id){
      return res.status(500).json('Request failed')
  }
  const user = await User.findOne({_id: req.user._id})
  if(!user){
    return res.status(500).json('User not found')
  }
  const resetToken = await ResetToken.findOne({user: user._id})
  if(!resetToken){
    return res.status(500).json('Reset token not found')
  }
  console.log(resetToken.token)
  const isMatch = await bcrypt.compareSync(token, resetToken.token)
  if(!isMatch){
    return res.status(500).json('Wrong reset token!!! Please try again')
  }
  const hashPass = await bcrypt.hash(password, 10)
  user.password = hashPass
  await user.save()

  let transporter = nodemailer.createTransport({
    host: mailConfig.HOST,
    auth: {
    type: "OAuth2",
    user: mailConfig.FROM_EMAIL_ADDRESS,
    clientId: mailConfig.GOOGLE_CLIENT_ID,
    clientSecret: mailConfig.GOOGLE_SECRET_ID,
    refreshToken: mailConfig.GOOGLE_REFRESH_TOKEN                              
    },
  });
 
  let mailOptions = {
    from: `Admin_Onstagram💎 <${mailConfig.FROM_EMAIL_ADDRESS}>`, 
    to: user.email, 
    subject: 'Your Password Successfully Updated', 
    html:`<h1>Hello ✔ <span style="color:blue;text-align:center;">${user.username}</span> <p>Now you can login new password</p></h1>`, 
  };

  await transporter.sendMail(mailOptions)
  res.status(200).json({msg:"Send Success! Check your mail!!"})
  }catch(err){
    return res.status(500).json({msg: err.message});
  }
  
})
   

// REFRESH ACCESS_TOKEN WHEN IT EXPIRES
router.post('/refreshToken', async (req, res) => {
    const refreshToken = req.body.token
    if(!refreshToken) return res.status(401).json('Refresh token not valid')
    if(!refreshTokens.includes(refreshToken)) return res.status(401).json('Refresh token not found')
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,(err, data) =>{
        console.log(err, data)
        if(err) res.status(403)
        const accessToken = jwt.sign(
            {username: data.username},
            process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'})
        res.status(200).json({accessToken})
    } )
})






  
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
module.exports = router