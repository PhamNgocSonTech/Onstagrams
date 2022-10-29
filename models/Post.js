const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
      desc: {
        type: String,
        max: 500,
      },
      img: {
        type: Array,
        default: [],
      },
      userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
      },
      likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
      comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
      
      // userId: {
      //   type: String,
      //   require: true,
      // },
      // likes: {
      //   type: Array,
      //   default: [],
      // },
      // comments: {
      //   type: Array,
      //   default: [],
      // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
