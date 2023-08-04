// const jwt = require('jsonwebtoken');
// //const JWT_KEY = 'myaccesstoken';
// const dotenv = require('dotenv').config();
// const User = require("../models/User");

// const verifyToken = async(req , res , next)=>{
//           const authHeader = req.headers.token;
//           if(authHeader){
//                     const token = authHeader;
//                     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err , user)=>{
//                               if(err) return res.status(400).json("Token Expires");
//                               req.user = user;
//                               next();
//                     } )
//           }else{
//                     return res.status(400).json("Access Token Not Found")
//           }

//         // try {
//         //     const token = req.headers.token

//         //     if(!token) return res.status(400).json({msg: "Invalid Authentication."})

//         //     const decoded = jwt.verify(token, JWT_KEY)
//         //     if(!decoded) return res.status(400).json({msg: "Invalid Authentication."})

//         //     const user = await User.findOne({_id: decoded.id})

//         //     req.user = user
//         //     next()
//         // } catch (err) {
//         //     return res.status(500).json({msg: err.message})
//         // }
// }

// module.exports  = {verifyToken};
