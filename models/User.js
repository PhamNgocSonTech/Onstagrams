const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

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
      //required: true
    },
    gender: {
      type: String,
      enum: [1, 2, 3],
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
    bio: {
      type: String,
      max: 50,
    },
    external: {
      type: String,
      max: 50,
    },
    followers: [{type: mongoose.Types.ObjectId, ref: 'user'}],
    followings: [{type: mongoose.Types.ObjectId, ref: 'user'}],
    verifed:{
      type:Boolean,
      required:true,
      default:false
    },
    accountType:{
      type: String,
      default: 'system_account'
    }
   
  },
  { timestamps: true }
);

UserSchema.pre('save', async function(next) {
  try {
    // check method of register
    const user = this;
    if (!user.isModified('password')) next();
    // generate salt
    const salt = await bcrypt.genSalt(10);
    // hash the password
    const hashedPassword = await bcrypt.hash(this.password, salt);
    // replace plain text password with hashed password
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});
module.exports = mongoose.model("User", UserSchema);
