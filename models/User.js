const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    fullname: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Secret'],
      default: 'Male'
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    avatar: {
      type: String,
      default: 'https://res.cloudinary.com/doapkbncj/image/upload/v1666857358/onstagram_v2/avt/default-avatar_et9ey8.jpg',
    },
    cloudinary_id: {
      type: String,
      default: 'default-avatar_et9ey8'
    },
    followers: {
      type: Array
    },
    followings: {
      type: Array
    },
    verifed:{
      type:Boolean,
      required:true,
      default:false
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
