const router = require('express').Router();
const User = require('../models/User')

//REGISTER
router.post("/register", async(req, res) => {
    const user = await new User({
        username: "son",
        email: "son@gmail.com",
        password: "123",

    })

    await user.save()
    res.send("ok")
})

module.exports = router