const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
// const cookieSession = require('cookie-session')
const passport = require("passport");
const cors = require("cors");
const userRoute = require("./route/users");
const authRoute = require("./route/auth");
const postRoute = require("./route/post");

// ENV Config
dotenv.config();
const port = process.env.PORT || 8080;

//MongoDB Connect
mongoose.connect(process.env.MONGO_URL, (err) => {
    if (err) console.log(err);
    else console.log("Connected to MongoDB");
});

// mongoose.connect(process.env.MONGO_URL, ()=>{
//     console.log("Connected to MongoDB");
// })

//MIDDLEWARE
app.use(express.json())
app.use(helmet())
app.use(morgan("dev"))
app.use(bodyParser.json())

// app.use(passport.initialize());
// app.use(passport.session());

app.use(cors({
  origin: true,
  credentials: true
}))

//ROUTE
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

app.listen(port, () => console.log("Server is running on port is:", port));
// COOKIES SESSION

// app.use(cookieSession({
//   name: 'session',
//   keys: 'ogdev',
//   // Cookie Options
//   maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }))

