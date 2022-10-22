const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')

//REGISTER
router.post("/register", async(req, res) => {
   
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
                email: req.body.email,
                password: hashedPassword
            })
            // save data from client to database and response
            const user = await newUser.save()
            res.status(200).json(user)
        } catch(err){
            console.log(err);
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
        console.log(err)
    }
})

module.exports = router