// PACKAGE REQUIRE
const express = require("express");
const router = express.Router();
const {
  registerUser,
  verifyEmail,
  loginUser,
  google,
  logout,
  forgotPassword,
  resetPassword,
  refreshToken,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.post("/verify/mail", verifyEmail);
router.post("/forgot/password", forgotPassword);
router.put("/reset/password", resetPassword);
router.post("/refreshToken", refreshToken);
// router.get("/google", google);
// router.get("/google/callback");

module.exports = router;
