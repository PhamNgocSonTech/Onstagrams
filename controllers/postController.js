const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

// ********************************************//
//CREATE POST
const createPost = async (req, res) => {
  try {
    upload.array("img", 10);
    const { desc, video, hashtag } = req.body;
    const imgFiles = req.files;
    if (!imgFiles) return res.status(500).json({ msg: "No image file" });
    let multiplePicturePromise = imgFiles.map((picture) =>
      cloudinary.uploader.upload(picture.path, { upload_preset: "post_upload" })
    );
    let imageResponses = await Promise.all(multiplePicturePromise);
    //res.status(200).json({ images: imageResponses });
    //let user = await User.findById(req.params.id);
    // Upload image to cloudinary
    // const data = {
    //     image: req.file,
    // };

    // if (req.file) {
    //     result = await cloudinary.uploader.upload(req.file.path, {
    //         upload_preset: "post_upload",
    //     });
    //     // Delete image from cloudinary
    //     // await cloudinary.uploader.destroy(user.cloudinary_id);
    // }
    const newPost = await new Post({
      desc,
      hashtag,
      img: imageResponses || post.img,
      video,
      userId: req.user._id,
    });
    const savePost = await newPost.save();
    res.status(200).json(savePost);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ********************************************//
//UPDATE POST
const updatePost = async (req, res) => {
  try {
    upload.array("img", 10);
    const { desc, hashtag } = req.body;
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(500).json("Post not found");

    const imgFiles = req.files;
    //if(imgFiles){
    let multiplePicturePromise = imgFiles.map((picture) =>
      cloudinary.uploader.upload(picture.path, {
        upload_preset: "post_upload",
      })
    );
    let imageResponses = await Promise.all(multiplePicturePromise);
    //Delete image from cloudinary
    //await cloudinary.uploader.destroy(user.cloudinary_id);
    //}
    const data = {
      desc,
      hashtag,
      img: imageResponses || post.img,
      //cloudinary_id: multiplePicturePromise?.public_id || post.cloudinary_id,
    };
    post = await Post.findByIdAndUpdate(req.params.id, data);
    const updatPost = await post.save();
    res.status(200).json(updatPost);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// ********************************************//
//DELETE POST
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (req.user._id != post.userId) {
      res.status(403).json("You can only delete your post");
    } else {
      //await cloudinary.uploader.destroy(post.img);
      await post.deleteOne();
      res.status(200).json("Your post has been deleted");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// ********************************************//
//COMMENT
const comment = async (req, res) => {
  try {
    const { comment } = req.body;
    const commentObj = {
      userId: req.user._id,
      username: req.user.username,
      comment,
    };
    const post = await Post.findById(req.params.id);
    post.comments.push(commentObj);
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// ********************************************//
//DELETE COMMENT
// firstId => id post
// secondId => id comment

const deleteComment = async (req, res) => {
  try {
    // const { comment } = req.body;
    // const commentObj = {
    //     userId: req.user._id,
    //     username: req.user.username,
    //     comment,
    // };
    const post = await Post.findById(req.params.firstId);
    await post.update({ $pull: { comments: { _id: req.params.secondId } } });

    // await post.save();
    res.status(200).json(post);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// firstId => postId
// secondId => commentId
// NOT WORKING

const updateComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const postId = await Post.findById(req.params.firstId);
    //const cmtId = await Post.findById(comments: { _id: req.params.secondId });
    const data = {
      comment,
    };
    await postId.updateOne({ comments: { comment: data } });
    // postId = await Post.findByIdAndUpdate(cmtId, { comments: { comment: data } });
    const updateCmt = await postId.save();
    res.status(200).json(updateCmt);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// ********************************************//
//LIKE AND DISLIKE POST
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user._id)) {
      await post.updateOne({ $push: { likes: req.user._id } });
      res.status(200).json("You has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.user._id } });
      res.status(200).json("You has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// ********************************************//
//GET POST BY postId
const getPostById = async (req, res) => {
  try {
    const postGet = await Post.find({ _id: req.params.id });
    res.status(200).json(postGet);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// ********************************************//
//GET POST BY userId
const getPostByUserId = async (req, res) => {
  try {
    const postGetUserId = await Post.find({ userId: req.params.id });
    res.status(200).json(postGetUserId);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// ********************************************//
//GET ALL POST
const getAllPost = async (req, res) => {
  try {
    const postGet = await Post.find();
    res.status(200).json(postGet);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// ********************************************//
//GET ALL TIMELINE POST
const allTimelinePost = async (req, res) => {
  if (req.user._id === req.params.userId)
    return res.status(500).json({ msg: "You can not get your timeline" });
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPost = await Post.find({ userId: currentUser._id });
    const friendPost = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPost.concat(...friendPost));
  } catch (err) {
    res.status(500).json(err);
  }
};

// ********************************************//
//GET USER'S ALL POSTS
const getAllPostForUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const post = await Post.find({ userId: user._id });
    res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// ********************************************//
//DELETE ALL POSTS
const deleteAllPost = async (req, res) => {
  try {
    const userDelete = await Post.deleteMany();
    res.status(200).json("Delete Posts Success");
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  comment,
  deleteComment,
  updateComment,
  likePost,
  getPostById,
  getPostByUserId,
  getAllPost,
  allTimelinePost,
  getAllPostForUser,
  deleteAllPost,
};
