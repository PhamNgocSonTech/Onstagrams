const express = require("express");
const app = express();

const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const notifyRoute = require("./routes/notify");
const chatRoute = require("./routes/chat");

// ENV Config
dotenv.config();
const port = process.env.PORT || 8080;

//MongoDB Connect
mongoose.connect(process.env.MONGO_URL, (err) => {
  if (err) console.log(err);
  else console.log("Connected to MongoDB");
});

//MIDDLEWARE
// app.use(
//   cookieSession({ name: "son", keys: ["sonlogin"], maxAge: 24 * 60 * 60 * 100 })
// );
// app.use(session({ secret: 'sonlody' }));

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

//ROUTE
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
// app.use("/api/notify", notifyRoute);
// app.use("/api/chat", chatRoute);

app.use(express.static(path.join(__dirname, "build")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
// Serve static assets if in production
// if (process.env.NODE_ENV === 'production') {
//   // Set static folder
// app.use(express.static('client/build'));

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }

app.listen(port, () => console.log("Server is running on port is:", port));

// COOKIES SESSION

// app.use(cookieSession({
//   name: 'session',
//   keys: 'ogdev',
//   // Cookie Options
//   maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }))
