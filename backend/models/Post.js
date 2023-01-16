const mongoose = require('mongoose');
const joi = require('joi');

// post schema
const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    description:{
        type: String,
        required: true,
        trim: true,
        minlength: 10,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category:{
        type: String,
        required: true,
    },
    image:{
        type:Object,
        default:{
            url:'',
            publicId:null
        }
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
},{
    timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
// populate comments for this post
postSchema.virtual("comments",{
    ref: 'Comment',
    foreignField: 'postId',
    localField: '_id'
})

// post model 
const Post = mongoose.model('Post', postSchema);



// validation
function validateCreatePost(obj){
    const schema = joi.object({
        title: joi.string().min(2).max(100).required(),
        description: joi.string().min(10).required(),
        category: joi.string().trim().required(),
    })
   return schema.validate(obj);
}

function validateUpdatePost(obj){
    const schema = joi.object({
        title: joi.string().min(2).max(100),
        description: joi.string().min(10),
        category: joi.string().trim(),
    })
   return schema.validate(obj);
}

module.exports = {
    Post,
    validateCreatePost,
    validateUpdatePost
}