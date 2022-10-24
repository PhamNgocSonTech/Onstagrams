const router = require('express').Router()
const Post = require('../models/Post')

// router.get("/", async(req, res) =>{
//     res.send("Post")
// })

// ********************************************//
//CREATE POST
router.post("/", async(req, res) =>{
    const newUser = await new Post(req.body)
    try {
        const savePost = await newUser.save()
        res.status(200).json(savePost)    
    }catch(err){
        res.status(500).json(err)    

    }

})

// ********************************************//
//UPDATE POST
router.post("/update/:id", async(req, res) =>{
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await post.updateOne({$set: req.body})
            res.status(200).json('Your post has been updated')
        }else{
            res.status(403).json('You can only update your post')
        }
    }catch (err) {
        res.status(500).json(err)
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
//LIKE AND DISLIKE POST
    router.put("/like/:id", async (req, res) => {
        try {
            const post = await Post.findById(req.params.id)
            if(!post.likes.includes(req.body.userId)){
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
//GET POST
    router.get("/getPost/:id", async (req, res) => {
    try {
      const postGet = await Post.findById(req.params.id);
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
router.get("/timeline/all", async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId)
        const userPost = await Post.find({userId: currentUser._id})
        const friendPost = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({userId: friendId})
            })
        )
        res.json(userPost.concat(...friendPost))
    }catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router