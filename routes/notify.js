// const router = require("express").Router();
// const Notifies = require('../models/Notify')
// const {verifyToken} = require('../utils/verifyToken')

// router.post('/createNotify', verifyToken, async (req, res) => {
//     try {
//         const {recipients, url, text, content, image } = req.body

//         //if(recipients.includes(req.user._id.toString())) return;

//         const notify = new Notifies({
//             recipients,
//             url,
//             text,
//             content,
//             user: req.user._id
//         })

//         await notify.save()
//         return res.json({notify})
//     } catch (err) {
//         return res.status(500).json({msg: err.message})
//     }
// })

// router.get('/getNotify', verifyToken, async (req, res) => {
//     try {
//         const notifies = await Notifies.find({recipients: req.user._id})

//         return res.json({notifies})
//     } catch (err) {
//         return res.status(500).json({msg: err.message})
//     }
// })

// router.post('/isReadNotify', verifyToken, async (req, res) => {
//     try {
//         const notifies = await Notifies.findOneAndUpdate({user: req.user._id}, {
//             isRead: true
//         })

//         return res.status(200).json('You Are Read Notify')
//     } catch (err) {
//         return res.status(500).json({msg: err.message})
//     }
// })

// router.delete('/deleteNotify/:id', verifyToken, async (req, res) => {
//     try {
//         const notify = await Notifies.findOneAndDelete({
//             user: req.user._id,
//             //url: req.params.id
//         })

//         return res.status(200).json('Delete Success Notify')
//     } catch (err) {
//         return res.status(500).json({msg: err.message})
//     }
// })

// router.delete('/deleteAllNotify', verifyToken, async (req, res) => {
//     try {
//         const notifies = await Notifies.deleteMany({recipients: req.user._id})

//         return res.status(200).json('Delete Success All Notify')
//     } catch (err) {
//         return res.status(500).json({msg: err.message})
//     }
// })

// module.exports = router
