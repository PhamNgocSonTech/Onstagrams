const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

//REGISTER
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
                    birthday: req.body.birthday,
                    gender: req.body.gender,
                    email: req.body.email,
                    password: hashedPassword,
                    
                })
            
            // save data from client to database and response
            const user = await newUser.save()
            res.status(200).json(user)
        } catch(err){
            return res.status(400).json({err: 'Something wrong happened!!! Try again'})
        }
    // await user.save()
    // res.send("ok")
})

//LOGIN
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

module.exports = router