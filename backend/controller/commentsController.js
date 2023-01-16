const asyncHandler = require('express-async-handler');
const {Comment,validateCreateComment,validateUpdateComment} = require('../models/Coment');
const {User} = require('../models/User');

/**
 *  create a new comment
 *  route => api/comments
 *  access => private(just loggedin users)
 */
module.exports.createCommentCtrl = asyncHandler(async(req,res)=>{
    const {error} = validateCreateComment(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }
    const profile = await User.findById(req.user.id);

    const comment = await Comment.create({
        postId: req.body.postId,
        text: req.body.text,
        user: req.user.id,
        username: profile.username
    });
     res.status(201).json(comment);
})

/**
 *  get all comments
 *  route => api/comments
 *  access => private(just admin)
 */
module.exports.getAllCommentsCtrl = asyncHandler(async(req,res)=>{
    const comments = await Comment.find().populate('user');
    res.status(200).json(comments);
})

/**
 *  delte comment
 *  route => api/comments/:id
 *  access => private(just admin or owner of comment)
 */
module.exports.deleteCommentsCtrl = asyncHandler(async(req,res)=>{
    const comment = await Comment.findById(req.params.id);
    if(!comment){
        return res.status(404).json({message: 'Comment not found'});
    }
    if(req.user.isAdmin || req.user.id === comment.user._id.toString()){
         await Comment.findByIdAndDelete(req.params.id);
         res.status(200).json({message: 'Comment deleted'});
    }
    else{
        res.status(403).json({message: 'Access denied, not allowed'}); 
    }
})

/**
 *  update comment
 *  route => api/comments/:id
 *  access => private(owner the comment)
 */
module.exports.updateCommentCtrl = asyncHandler(async(req,res)=>{
    const {error} = validateUpdateComment(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }
    const comment = await Comment.findById(req.params.id);
    if(!comment){
        return res.status(404).json({message: "comment not found"})
    }
    if(req.user.id !== comment.user.toString()){
        return res.status(403).json({message: 'Access denied, not allowed'})
    }
    const updatedComment = await Comment.findByIdAndUpdate(req.params.id,{
        $set:{
            text: req.body.text,
        }
    },{new:true});

     res.status(200).json(updatedComment);
})