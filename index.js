const express = require("express")
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const helmet = require('helmet')
const dotenv = require('dotenv')
var bodyParser = require('body-parser')
const userRoute = require('./route/users')
const authRoute = require('./route/auth')
const postRoute = require('./route/post')


dotenv.config()
const port = process.env.PORT

mongoose.connect(
    process.env.MONGO_URL, (err) => {
     if(err) console.log(err) 
     else console.log("Connected to MongoDB");
    }
  );

// mongoose.connect(process.env.MONGO_URL, ()=>{
//     console.log("Connected to MongoDB");
// })

//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("dev"))
app.use(bodyParser.json())


//route
app.get("/", (req, res) => {
    res.send("Welcome to Home Page")
})

// app.get("/users", (req, res) => {
//     res.send("User")
// })

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/post", postRoute)


app.listen(port, () => console.log("Server is running on port is:", port)) 