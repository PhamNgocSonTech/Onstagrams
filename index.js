const express = require("express")
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const helmet = require('helmet')
const dotenv = require('dotenv')
const userRoute = require('./route/users')
const authRoute = require('./route/auth')


dotenv.config()
const port = process.env.PORT


mongoose.connect(process.env.MONGO_URL, ()=>{

    console.log("Connected to MongoDB");
})

app.use(express.json())
app.use(helmet())
app.use(morgan("common"))


//route
app.get("/", (req, res) => {
    res.send("Welcome to Home Page")
})

app.get("/users", (req, res) => {
    res.send("User")
})

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)


console.log("backend server is running on", port)


app.listen(port, () => {

})