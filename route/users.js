const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')
router.get("/", (req, res) => {
    res.send("Welcome to User Route!")
})

//GET USER BY ID
router.get("/get/:id", async (req, res) => {
    try {
        const userGet = await User.findById(req.params.id)
        res.status(200).json(userGet)
    }catch(err){
        return res.status(500).json(err)
    }
})

//GET LIST USERS
router.get("/get/", async (req, res) => {
    try {
        const userGet = await User.find()
        res.status(200).json(userGet)
    }catch(err){
        return res.status(500).json(err)
    }
})

//UPDATE USER
router.put("/update/:id", async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            }catch(err){
                return res.status(500).json(err)
            }
        }
        try {
            const userUpdate = await User.findByIdAndUpdate(req.params.id, {$set: req.body})
            //console.log(userUpdate)
            res.status(200).json("Update User Success")
        }catch(err){
            return res.status(500).json(err)

        }
    }else{
        return res.status(403).json("You can update only your account")
    }
})


//DELETE USER
router.delete("/delete/:id", async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        
        try {
            const userDelete = await User.findByIdAndDelete({_id: req.params.id})
            res.status(200).json("Delete User Success")
        }catch(err){
            return res.status(500).json(err)

        }
    }else{
        return res.status(403).json("You can update only your account")
    }
})


//FOLLOWER USER
//UNFOLLOWER USER


module.exports = router