const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const {
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
} = require("../controllers/postController");

const router = express.Router();
router.post("/", verifyToken, createPost);
router.put("/updatePost/:id", verifyToken, updatePost);
router.delete("/delete/:id", verifyToken, deletePost);
router.put("/comment/post/:id", verifyToken, comment);
router.delete("/delComment/post/:firstId/:secondId", deleteComment);
router.put(
  "/updateComment/post/:firstId/:secondId",
  verifyToken,
  updateComment
);
router.put("/like/:id", verifyToken, likePost);
router.get("/getPost/:id", getPostById);
router.get("/getPostUser/:id", getPostByUserId);
router.get("/getListPosts/", getAllPost);
router.get("/timeline/:userId", verifyToken, allTimelinePost);
router.get("/profile/:username", getAllPostForUser);
router.delete("/deleteAll", deleteAllPost);
module.exports = router;
