const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

const cloudinary = require('../utils/cloudinary')
const upload = require('../utils/multer')

//const passport = require('passport')

const jwt = require('jsonwebtoken')
const ResetToken = require("../models/ResetToken")

const nodemailer = require('nodemailer')
const {generateOTP} = require('../utils/mail')
const VerificationMail = require('../models/VerificationMail')

const dotenv = require('dotenv').config()
let refreshTokens = []

//const CLIENT_URL = 'https://localhost:3000/'


//REGISTER NEW
router.post("/register", async(req, res) => {
    try {
        const { fullname, username, email, password, gender } = req.body
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
            fullname, username, email, password: hashedPassword, gender
        })

        const accessToken = jwt.sign({
                    _id: newUser._id,
                    username: newUser.username
          }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '60s'});
        // const OTP = generateOTP();
        // const verificationMail = await VerificationMail.create({
        //     user: newUser._id,
        //     token: OTP
        // })
        // verificationMail.save();
        await newUser.save()
        // const transport = nodemailer.createTransport({
        //     host: "smtp.mailtrap.io",
        //     port: 2525,
        //     service: 'Gmail',
        //     auth: {
        //       user: process.env.USER,
        //       pass: process.env.PASS
        //     }
        //   });
        //   transport.sendMail({
        //     from:"onstgrams-dev",
        //     to:newUser.email,
        //     subject:"Verify your email using OTP",
        //     html:`<h1>Your OTP CODE ${OTP}</h1>`
        //   })
        //   res.status(200).json({
        //     Status:"Pending" , 
        //     msg:"Register Success! Please check your email", 
        //     accessToken,
        //     })
        res.status(200).json({
            msg: 'Register Success!',
            accessToken,
            user: {
                ...newUser._doc,
                password: ''
            }
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
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
        const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '60s'});
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
            process.env.ACCESS_TOKEN_SECRET, {expiresIn: '60s'})
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