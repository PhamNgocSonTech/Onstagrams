const router = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')
const {verifyToken} = require('../utils/verifyToken')
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

// router.get("/", async(req, res) =>{
//     res.send("Post")
// })

// ********************************************//
//CREATE POST
router.post("/", verifyToken, upload.single("img"), async(req, res) =>{
    try {
        const {desc, image, video} = req.body
      
        //let user = await User.findById(req.params.id);
        // Upload image to cloudinary
        const data = {
            image: req.file.path,
        };
        //if (req.file) {
            result = await cloudinary.uploader.upload(data, {
                upload_preset: "post_upload",
            });
            // Delete image from cloudinary
            // await cloudinary.uploader.destroy(user.cloudinary_id);
        //}
       
        //user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
        //await updateuser.save();
        //res.status(200).json(user);
        const newPost = await new Post({
            desc, 
            //$push:{image:result?.secure_url},
            image: result.secure_url, 
            userId: req.user._id
        })
        const savePost = await newPost.save()
        res.status(200).json(savePost)    
    }catch(err){
        res.status(500).json({msg: err.message})    
    }

})

// ********************************************//
//UPDATE POST
router.put("/updatePost/:id", verifyToken, async(req, res) => {
    try {
        let post = await Post.findById(req.params.id)
        if(post == 0){
            return res.status(400).json('Post not found')
        }
        const data = {
            $set: req.body
        }
        post = await Post.findByIdAndUpdate(req.params.id, data)
        res.status(200).json(post)
        
    }catch(err){
        return res.status(500).json({msg: err.message})
    }
      
   
})

// ********************************************//
//DELETE POST
router.delete("/delete/:id", async(req, res) =>{
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await post.deleteOne()
            res.status(200).json('Your post has been deleted')
        }else{
            res.status(403).json('You can only delete your post')
        }
    }catch (err) {
        res.status(500).json(err)
    }
})

// ********************************************//
//COMMENT 
router.put("/comment/post/:id" , verifyToken , async(req , res)=>{
     try {
          const {comment} = req.body;
          const commentObj={
                userId:req.user._id,
                username:req.user.username,
                comment,
          }
          const post = await Post.findById(req.params.id);
          post.comments.push(commentObj);
          await post.save();
          res.status(200).json(post);
    } catch (err) {
          return res.status(500).json({msg: err.message})
    }
})
// ********************************************//
//LIKE AND DISLIKE POST
router.put("/like/:id", verifyToken, async (req, res) => {
        try {
            const post = await Post.findById(req.params.id)
            if(!post.likes.includes(req.user.userId)){
                await post.updateOne({$push: {likes: req.body.userId}})
                res.status(200).json('You has been liked')

            }else{
                await post.updateOne({$pull: {likes: req.body.userId}})
                res.status(200).json('You has been disliked')
            }
        }catch(err){
            res.status(500).json(err)
        }
    })

// ********************************************//
//GET POST BY USERID
router.get("/getPost/:id", async (req, res) => {
    try {
      const postGet = await Post.find({userId: req.params.id});
      res.status(200).json(postGet);
    } catch (err) {
      return res.status(500).json(err);
    }
  });

// ********************************************//
//GET ALL POST
router.get("/getListPosts/", async (req, res) => {
    try {
      const postGet = await Post.find();
      res.status(200).json(postGet);
    } catch (err) {
      return res.status(500).json(err);
    }
  });

// ********************************************//
//GET ALL TIMELINE POST
router.get("/timeline/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId)
        const userPost = await Post.find({userId: currentUser._id})
        const friendPost = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({userId: friendId})
            })
        )
        res.status(200).json(userPost.concat(...friendPost))
    }catch (err) {
        res.status(500).json(err)
    }
})

// ********************************************//
//GET USER'S ALL POSTS
router.get("/profile/:username", async (req, res) => {
        try {
            const user = await User.findOne({username: req.params.username})
            const post = await Post.find({userId: user._id})
            res.status(200).json(post)

        }catch(err){
            return res.status(500).json(err)
        }
    })

// ********************************************//
//DELETE ALL POSTS
router.delete("/deleteAll", async (req, res) => {
    try {
      const userDelete = await Post.deleteMany();
      res.status(200).json("Delete Posts Success");
    } catch (err) {
      return res.status(500).json(err);
    }
});

module.exports = router