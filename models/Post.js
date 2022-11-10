const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
      desc: {
        type: String,
        max: 500,
      },
      
      hashtag: {
        type: String
      },

      img: {
        type: Array,
        default: [],
      },
      video: {
        type: Array,
        default: [],
      },
      userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
      },
      likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
      
      comments: 
      [
        { 
          userId:{
            type: mongoose.Types.ObjectId,
            require: true 
          },
          username:{
            type: String,
            require: true
          },
          comment:{
            type: String,
            require: true
          },
          createAt: {
            type: Date,
            require: true,
            default: Date.now()
          }
        }
      ],
      
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
