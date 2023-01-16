const asyncHandler = require('express-async-handler');
const {User, validateUpdateUser} = require('../models/User');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require("fs");
const {cloudinaryRemoveImage,cloudinaryUploadImage,cloudinaryRemoveMultipleImage} = require('../utils/cloudinary');
const {Comment} = require('../models/Coment');
const {Post} = require('../models/Post');

/**
 *  get all users profile
 *  route => api/users/profile
 *  access => private(just admin)
 */
module.exports.getAllUsersCtrl = asyncHandler(async(req,res)=>{
    const users = await User.find().select('-password').populate("posts");
    res.status(200).json(users);
})

/**
 *  get user profile
 *  route => api/users/profile:id
 *  access => public
 */
module.exports.getUserProfileCtrl = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id).select('-password').populate("posts");
    if(!user){
        return res.status(404).json({message: 'User not found'});
    }
    res.status(200).json(user);
})

/**
 *  update user profile
 *  route => api/users/profile:id
 *  access => private(just user himself)
 */
module.exports.updateUserProfileCtrl = asyncHandler(async(req,res)=>{
    const {error} = validateUpdateUser(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }
    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt)
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id,{
        $set:{
            username:req.body.username,
            password:req.body.password,
            bio:req.body.bio
        }
    },{new:true}).select('-password').populate("posts");
    res.status(200).json(updatedUser);
})
 
/**
 *  get users count
 *  route => api/users/count
 *  access => private(just admin)
 */
module.exports.getUsersCountCtrl = asyncHandler(async(req,res)=>{
    const count = await User.count()
    res.status(200).json(count);
})

/**
 *  profile photo upload
 *  route => api/users/profile/profile-photo-upload
 *  access => private(just logged in)
 */
module.exports.profilePhotoUploadCtrl = asyncHandler(async(req,res)=>{
    // validation
    if(!req.file){
        return res.status(400).json({message: 'No file attached'});
    }
    // get the path of the image
    const imagePath = path.join(__dirname,`../images/${req.file.filename}`)
    // upload to cloudinary
    const result = await cloudinaryUploadImage(imagePath);
    // get the user from db
    const user = await User.findById(req.user.id)
    // delete the old profile photo if exists
    if(user.profilePhoto.publicId !== null){
        await cloudinaryRemoveImage(user.profilePhoto.publicId)
    }
    // change the profile photo field in db
    user.profilePhoto = {
        url: result.secure_url,
        publicId: result.public_id
    }
    await user.save();
    // send response to client
    res.status(200).json({
        message:"your profile photo uploaded successfully",
        profilePhoto: {url: result.secure_url, publicId:result.public_id}
    }) 
    // remove image from server
    fs.unlinkSync(imagePath);
});

/**
 *  delete user profile
 *  route => api/users/profile:id
 *  access => private(just admin or user himself)
 */
module.exports.deleteUserProfile = asyncHandler(async(req, res) =>{
    // get the user from db
    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(404).json({message: 'User not found'});
    }
    // get all posts from db
    const posts = await Post.find({user: user._id})
    // get the public id's from posts
    const publicIds = posts?.map((post) => post.image.publicId);
    // delete all posts image from cloudinary that belong to this user
    if(publicIds?.length > 0){
        await cloudinaryRemoveMultipleImage(publicIds)
    }
    // delete profile photo from cloudinary
    if(user.profilePhoto.publicId !== null){
       await cloudinaryRemoveImage(user.profilePhoto.publicId);
    }
    // delete user posts and comments
    await Post.deleteMany({ user: user._id});
    await Comment.deleteMany({ user: user._id});
    // delete the user
    await User.findByIdAndDelete(req.params.id)
    // send response to client
    res.status(200).json({message:"the profile has been deleted"})
})