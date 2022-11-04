const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

const cloudinary = require('../utils/cloudinary')
const upload = require('../utils/multer')

//const passport = require('passport')

const jwt = require('jsonwebtoken')
const ResetToken = require("../models/ResetToken")
const {verifyToken} = require('../utils/verifyToken')

const nodemailer = require('nodemailer')
const {OAuth2Client} = require('google-auth-library')

const {generateOTP} = require('../utils/mail')
const VerificationMail = require('../models/VerificationMail')

const dotenv = require('dotenv').config()
let refreshTokens = []
const GOOGLE_MAILER_CLIENT_ID = '251967640945-nnrjjfil8gjer0cpp7d1fd4rlghnhhs4.apps.googleusercontent.com'
const GOOGLE_MAILER_CLIENT_SECRET = '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'
const GOOGLE_MAILER_REFRESH_TOKEN = '1//04_aADufrusQvCgYIARAAGAQSNwF-L9IrwKbNDwCSsNqfZLbgQDEZNghvJlZYzmithGcdbnEyKeUq1q7KKm8oOiuEHK3skQFF8hI'
const ADMIN_EMAIL_ADDRESS = 'phamgocson7a1@gmail.com'
//const CLIENT_URL = 'https://localhost:3000/'

// CONFIG FOR GOOGLE SEND MAIL
// Khởi tạo OAuth2Client với Client ID và Client Secret 
const myOAuth2Client = new OAuth2Client(
    GOOGLE_MAILER_CLIENT_ID,
    GOOGLE_MAILER_CLIENT_SECRET
  )
  // Set Refresh Token vào OAuth2Client Credentials
  myOAuth2Client.setCredentials({
    refresh_token: GOOGLE_MAILER_REFRESH_TOKEN
  })

//REGISTER NEW
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
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        // const passwordHash = await bcrypt.hash(password, 12)

        const newUser = new User({
            fullname, username, email, password: hashedPassword, gender, bio, external
        })

        const accessTokenJWT = jwt.sign({
                    _id: newUser._id,
                    username: newUser.username
          }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
          await newUser.save()
          // const OTP = generateOTP();
          // const verificationMail = await VerificationMail.create({
          //     user: newUser._id,
          //     token: OTP
          // })
          // verificationMail.save();

        //Lấy AccessToken từ RefreshToken (bởi vì Access Token cứ một khoảng thời gian ngắn sẽ bị hết hạn)
        //Vì vậy mỗi lần sử dụng Access Token, chúng ta sẽ generate ra một thằng mới là chắc chắn nhất.
       //const myAccessTokenObject = await myOAuth2Client.getAccessToken()
        //Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
       //const accessTokenGG = myAccessTokenObject?.token


        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //         auth: {
        //         type: 'OAuth2',
        //         user: ADMIN_EMAIL_ADDRESS,
        //         clientId: GOOGLE_MAILER_CLIENT_ID,
        //         clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
        //         refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
        //         accessToken: myAccessTokenObject,
        //     }
        //   });
        //   const mailOptions = {
        //     from:"onstgrams-dev",
        //     to:newUser.email,
        //     subject:"Verify your email using OTP",
        //     html:`<h1>Hello I'm SonAdmin in Onstgrams Web, I Send Your OTP CODE ${OTP}</h1>`
        //   }
        //   transporter.sendMail(mailOptions, function(err, data) {
        //     if (err) {
        //       console.log("Error " + err);
        //     } else {
        //       console.log("Email sent successfully");
        //     }
        //   });
        //   await transport.sendMail(mailOptions)
        //   res.status(200).json({
        //     Status:"Pending" , 
        //     msg:"Register Success! Please check your email", 
        //     accessTokenJWT,
        //     })
        res.status(200).json({
            msg: 'Register Success!',
            accessTokenJWT,
            user: {
                ...newUser._doc,
                password: ''
            }
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})


router.post('/sendMail/:id', verifyToken,  async(req, res) => {
    const newUser = await User.findById(req.params.id)
    const OTP = generateOTP();
          const verificationMail = await VerificationMail.create({
              user: req.user._id,
              token: OTP
          })
          verificationMail.save();

        //Lấy AccessToken từ RefreshToken (bởi vì Access Token cứ một khoảng thời gian ngắn sẽ bị hết hạn)
        //Vì vậy mỗi lần sử dụng Access Token, chúng ta sẽ generate ra một thằng mới là chắc chắn nhất.
       const myAccessTokenObject = await myOAuth2Client.getAccessToken()
        //Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
       const ggToken = myAccessTokenObject?.token

        const transporter = nodemailer.createTransport({
            service: 'gmail',
                auth: {
                type: 'OAuth2',
                user: ADMIN_EMAIL_ADDRESS,
                clientId: GOOGLE_MAILER_CLIENT_ID,
                clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
                refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
                accessToken: ggToken,
            }
          });
          const mailOptions = {
            from:"onstgrams-dev",
            to:req.user.email,
            subject:"Verify your email using OTP",
            html:`<h1>Hello I'm SonAdmin in Onstgrams Web, I Send Your OTP CODE ${OTP}</h1>`
          }
          await  transporter.sendMail(mailOptions, function(err, data) {
            if (err) {
              console.log("Error " + err);
            } else {
              console.log("Email sent successfully");
            }
          });
        //   await transporter.sendMail(mailOptions)
        //   res.status(200).json({
        //     Status:"Pending" , 
        //     msg:"Register Success! Please check your email", 
        //     accessTokenJWT,
        //     })
})


// router.post('/verify/mail', async(req, res) => {
//     const {user, otp} = req.body
//     const getUser = await User.findById(user)
//     if(!getUser) return res.status(400).json('User not found')
//     if(getUser.verifed === true)return res.status(400).json('User already verify mail')
//     const getToken = await VerificationMail.findOne({user: getUser._id})
//     if(!getToken)return res.status(400).json('Token not found')
//     const checkMatch = await bcrypt.compareSync(otp, getToken.token)
//     if(!checkMatch)return res.status(400).json('Token not valid')
//     getUser.verifed = true;
//     await VerificationMail.findByIdAndDelete(token._id)
//     getUser.save()
//     const accessToken = jwt.sign({
//         _id: getUser._id,
//         username: getUser.username
//     }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 60 * 60 * 24 });
//     const {password , ...other} = getUser._doc

//     const transport = nodemailer.createTransport({
//         host: "smtp.mailtrap.io",
//         port: 2525,
//         auth: {
//           user: process.env.USER,
//           pass: process.env.PASS
//         }
//       });
//       transport.sendMail({
//         from:"onstgrams-dev",
//         to:getUser.email,
//         subject:"Successfully verify your email",
//         html:`Now you can login Onstagrams`
//       })
//       return res.status(200).json({other , accessToken})

// })

// LOGIN NEW 

router.post("/login", async(req, res) => {
    try {
        //const { email, password } = req.body
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
router.post('/logout', (req, res) => {
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter((refToken) => refToken !== refreshToken);
    res.status(200).json('Logout Success');
  });

// router.post("/logout", verifyToken, async (req, res) => {
//         try {
//             req.user.token
//         }catch(err){
//             return res.status(500).json({msg: err.message})
//         }
// })


//REGISTER OLD
// router.post("/register",  async(req, res) => {
//     try {
//         //hash password  => generate new password
//         const salt = await bcrypt.genSalt(10)
//         const hashedPassword = await bcrypt.hash(req.body.password, salt)

//         //save data from input body to newUser
//             const newUser = await new User({
//                 // username: "son",
//                 // email: "son@gmail.com",
//                 // password: "123",
            
//                 //get data from body input
//                 username: req.body.username,
//                 fullname: req.body.fullname,
//                 gender: req.body.gender,
//                 email: req.body.email,
//                 password: hashedPassword,
                
//             })
        
//         // save data from client to database and response
//         const user = await newUser.save()
//         res.status(200).json(user)
//     } catch(err){
//         return res.status(400).json({err: 'Something wrong happened!!! Try again'})
//     }
// })


//LOGIN OLD
// router.post("/login", async(req, res) => {
// try {
//     const user = await User.findOne({email:req.body.email})
//     !user && res.status(404).json("User Not Found")
//     const validPassword = await bcrypt.compare(req.body.password, user.password)
//     !validPassword && res.status(404).json("Opps!! Wrong password, Please input again")
//     res.status(200).json(user)
// }catch(err){
//     //console.log(err)
//     return res.status(401).json(err)
// }
// })

module.exports = router