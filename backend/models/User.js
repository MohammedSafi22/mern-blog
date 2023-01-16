const mongoose = require('mongoose');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const passwordComplexity = require('joi-password-complexity');

// user schema
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 55,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
    },
     profilePhoto:{
        type: Object,
        default:{
            url:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
            publicId:null,
        }
     },
     bio:{
        type: String,
     },
    isAdmin:{
        type: Boolean,
        default: false,
    },
    isAccountVerified:{
        type: Boolean,
        default: false,
    }
},{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},

});

// generate token
userSchema.methods.generateAuthToken = function(){
   return jwt.sign({id:this._id , isAdmin:this.isAdmin},process.env.JWT_SECRET,{
     expiresIn:'30d'
   })
}

// populate posts that belongs to this user when get his profile
userSchema.virtual('posts',{
    ref:'Post',
    foreignField:"user",
    localField:"_id"
})

//  user model
const User = mongoose.model('User', userSchema);

// validate registration 
function validateRegisterUser(obj){
 const schema = joi.object({
    username: joi.string().trim().min(5).max(100).required(),
    email: joi.string().trim().min(5).max(55).required().email(),
    password: passwordComplexity().required(),
 });
 return schema.validate(obj);
}

// validate login 
function validateLoginUser(obj){
    const schema = joi.object({
       email: joi.string().trim().min(5).max(55).required().email(),
       password: joi.string().trim().min(8).required(),
    });
    return schema.validate(obj);
   }

// validate update user
function validateUpdateUser(obj){
    const schema = joi.object({
        username: joi.string().trim().min(5).max(100),
        password: passwordComplexity(),
        bio: joi.string()
    });
    return schema.validate(obj);
   }

module.exports = {
    User,
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser
}