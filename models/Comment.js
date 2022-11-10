const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    //likes: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    userId: {type: mongoose.Types.ObjectId, ref: 'User'},
    postId: mongoose.Types.ObjectId,
    postUserId: mongoose.Types.ObjectId
}, 
{
    timestamps: true
})

module.exports = mongoose.model('Comment', commentSchema)