const mongoose = require ("mongoose")

const ChatSchema = new mongoose.Schema(
    {
        members: {
            type: Array,
          },    
    },
    
    {
        latestMessageDate: {
            type: Date,
            default: Date.now,
          },
    }
  );


module.exports = mongoose.model('ChatRoom', ChatSchema)