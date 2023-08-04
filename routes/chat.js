// const router = require('express').Router();
// const ChatRoom = require('../models/ChatRoom')
// const {verifyToken} = require('../utils/verifyToken')

// router.post('/createChatRoom', verifyToken, async (req, res) => {
//     const newChatRoom = new ChatRoom({
//         members: [
//             req.user._id,
//             req.body.receverId,
//         ]
//     })
//     try{
//         const result = await newChatRoom.save()
//         return res.status(200).json(result)
//     }catch (err) {
//         return res.status(500).json({msg: err.message})
//     }
// })

// router.get('/userChatRoom', verifyToken, async (req, res) => {
//     try{
//         const userChatRoom = await ChatRoom.findOne({
//             members: {$in : [req.user._id]},
//         })
//         return res.status(200).json(userChatRoom)
//     }catch (err) {
//         return res.status(500).json({msg: err.message})

//     }
// })
// router.get('/getChatRoom/:secondId', verifyToken, async (req, res) => {
//     try {
//         const getChatRoom = await ChatRoom.findOne({
//           members: { $all: [req.user._id, req.params.secondId] },
//         });
//         return res.status(200).json(getChatRoom)
//       } catch (err) {
//         return res.status(500).json({msg: err.message})
//       }
// })

// module.exports = router
