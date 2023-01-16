const mongoose = require('mongoose');

// verification Token schema 
const  verificationTokenSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token:{
        type: String,
        required: true,
    }
},{
    timestamps:true,  
})

// verification Token model
const VerificationToken = mongoose.model("VerificationToken", verificationTokenSchema);


module.exports = VerificationToken;