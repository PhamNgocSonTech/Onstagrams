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

      cloudinary_image_id: {
        type: String,
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
