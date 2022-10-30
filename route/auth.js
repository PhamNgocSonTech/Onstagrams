const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')

const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

// const passport = require('passport')

const dotenv = require('dotenv').config()
const jwt = require('jsonwebtoken');
const ResetToken = require("../models/ResetToken");

//const mySecretKey = "#2@!@$ndja45883 r7##";

//const CLIENT_URL = 'https://localhost:3000/'

//REGISTER NEW
router.post("/register", async(req, res) => {
    try {
        const { fullname, username, email, password, gender } = req.body
        let newUserName = username.toLowerCase().replace(/ /g, '')

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
            fullname, username: newUserName, email, password: hashedPassword, gender
        })

        const accessToken = jwt.sign({
                    id:newUser._id,
                    username:newUser.username
          }, process.env.ACCESS_TOKEN);
        
    

        await newUser.save()

        res.json({
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

//LOGIN
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


// LOGIN NEW 
router.post("/login", async(req, res) => {
    try {
        const user = await User.findOne({email:req.body.email});
        if(!user){
                return res.status(400).json("User doesn't found")  
        }

        const Comparepassword = await bcrypt.compare(req.body.password , user.password);
        if(!Comparepassword){
                  return res.status(400).json("Password error")
        }
        const accessToken = jwt.sign({
                  id:user._id,
                  username:user.username
        }, process.env.ACCESS_TOKEN);
        const {password , ...other} = user._doc
        res.status(200).json({other , accessToken});
                  
    } catch (error) {
          res.status(500).json("Internal error occured")        
    }
})



// const createAccessToken = (payload) => {
//     return jwt.sign(payload, process.env.ACCESS_TOKEN )
// }

module.exports = router