const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const { verifyToken } = require("../middleware/verifyToken");
const {
  searchUserWithUsername,
  getUserByID,
  getAllUsers,
  updateUser,
  deleteUser,
  deleteAllUser,
  followUser,
  unfollowUser,
  fetchingPostUserFollowing,
  detailUserFollowingById,
  detailUserFollowersById,
} = require("../controllers/userController");

router.get("/search/:username", searchUserWithUsername);
router.get("/get/:id", getUserByID);
router.get("/getListUsers/", getAllUsers);
router.put("/updateProfile/:id", verifyToken, upload.single("img"), updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.delete("/deleteAll", deleteAllUser);
router.put("/:id/follow", verifyToken, followUser);
router.put("/:id/unfollow", verifyToken, unfollowUser);
router.get("/fetchPostFlw/:id", verifyToken, fetchingPostUserFollowing);
router.get("/getUserFollowings/:id", detailUserFollowingById);
router.get("/getUserFollowers/:id", detailUserFollowersById);

module.exports = router;
