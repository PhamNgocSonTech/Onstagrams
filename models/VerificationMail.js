const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const VerificationMailSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        require: true,
        default: Date.now()
    }
})

VerificationMailSchema.pre("save", async function(next){
    const salt = await bcrypt.genSalt(10)
    if(this.isModified('token')){
            const hashCode = await bcrypt.hash(this.token, salt)
            this.token = hashCode
    }
    next()
})
module.exports = mongoose.model('VerificationMailSchema', VerificationMailSchema)