const mongoose = require('mongoose');
const joi = require('joi');

// comment schema 
const commentSchema = new mongoose.Schema({
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    }
},{
    timestamps:true,  
})

// comment model
const Comment = mongoose.model("Comment", commentSchema);

// validation create comment
function validateCreateComment(obj){
    const schema = joi.object({
        postId: joi.string().required(),
        text: joi.string().required(),
    });
    return schema.validate(obj);
}

// validation update comment
function validateUpdateComment(obj){
    const schema = joi.object({
        text: joi.string().required(),
    });
    return schema.validate(obj);
}

module.exports = {
    Comment,
    validateCreateComment,
    validateUpdateComment
}