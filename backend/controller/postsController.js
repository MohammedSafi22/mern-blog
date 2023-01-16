const path = require("path");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const { Post, validateCreatePost ,validateUpdatePost } = require("../models/Post");
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require("../utils/cloudinary");
const { Comment } = require("../models/Coment");

/**
 *  create a new post
 *  route => api/posts
 *  access => private(just loggedin users)
 */
module.exports.createPostCtrl = asyncHandler(async (req, res) => {
  // validation for images
  if (!req.file) {
    return res.status(400).json({ message: "no image provided" });
  }
  // validation for data
  const { error } = validateCreatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // upload photo
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);
  // create post and save it in db
  const post = await Post.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    user: req.user.id,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });
  // send response to client
  res.status(201).json(post);
  // remove image from server
  fs.unlinkSync(imagePath);
});

/**
 *  get all posts
 *  route => api/posts
 *  access => public
 */
module.exports.getAllPostsCtrl = asyncHandler(async (req, res) => {
  const Post_Per_Page = 3;
  const { pageNumber, category } = req.query;
  let posts;

  if (pageNumber) {
    posts = await Post.find()
      .skip((pageNumber - 1) * Post_Per_Page)
      .limit(Post_Per_Page)
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else if (category) {
    posts = await Post.find({ category })
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else {
    posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  }
  res.status(200).json(posts);
});

/**
 *  get single post
 *  route => api/posts/:id
 *  access => public
 */
module.exports.getSinglePostCtrl = asyncHandler(async (req, res) => {
   const post = await Post.findById(req.params.id)
      .populate("user", ["-password"])
      .populate("comments")
   if(!post) {
     return res.status(404).json({message: 'Post not found'});
   }
    res.status(200).json(post);
});

/**
 *  get posts counts
 *  route => api/posts/count
 *  access => public
 */
module.exports.getPostCountCtrl = asyncHandler(async (req, res) => {
    const count = await Post.count()
    
     res.status(200).json(count);
});

/**
 *  delete post
 *  route => api/posts/:id
 *  access => private (admin or post owner)
 */
module.exports.deletePostCtrl = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if(!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    if(req.user.isAdmin || req.user.id === post.user.toString()) {
        await Post.findByIdAndDelete(req.params.id);
        await cloudinaryRemoveImage(post.image.publicId);

       // delete all comments that belongs post
       await Comment.deleteMany({ postId: post._id});

        res.status(200).json({ message: 'Post deleted successfully',postId: post.id });
    }else{
        res.status(403).json({message: 'Access Denied, forbidden'});

    }
})

/**
 *  update post
 *  route => api/posts/:id
 *  access => private (just post owner)
 */
module.exports.updatePostCtrl = asyncHandler(async(req, res) => {
    // validation
    const {error} = validateUpdatePost(req.body);
    if(error){
        return res.status(400).json({message: error.details[0].message});
    }
    // get the post from db and check if exists
    const post = await Post.findById(req.params.id);
    if(!post){
        return res.status(404).json({message: 'Post not found'})
    }
    // check if post belongs to logged in user
    if(req.user.id !== post.user.toString()){
        return res.status(403).json({message: 'Access Denied, you are not allowed'});
    }
    // update post
    const updatedPost = await Post.findByIdAndUpdate(req.params.id,{
        $set:{
            title: req.body.title,
            description: req.body.description,
            category: req.body.category
        }
    },{new: true}
    ).populate("user",["-password"]);
    // send response to client
    res.status(200).json(updatedPost);
})

/**
 *  update post Image
 *  route => api/posts/upload-image/:id
 *  access => private (just post owner)
 */
module.exports.updatePostImageCtrl = asyncHandler(async(req, res) => {
    // validation
    if(!req.file){
        return res.status(400).json({message:"no image provided"});
    }
    // get the post from db and check if exists
    const post = await Post.findById(req.params.id);
    if(!post){
        return res.status(404).json({message: 'Post not found'})
    }
    // check if post belongs to logged in user
    if(req.user.id !== post.user.toString()){
        return res.status(403).json({message: 'Access Denied, you are not allowed'});
    }
    // delete old image
    await cloudinaryRemoveImage(post.image.publicId);
    // upload new image
    const imagePath = path.join(__dirname,`../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);
    // upadte the image field in the db
    const updatedPost = await Post.findByIdAndUpdate(req.params.id,{
        $set:{
            image:{
                url: result.secure_url,
                publicId: result.public_id
            }
        }
    },{new: true}
    ).populate("user",["-password"]);
    // send response to client
    res.status(200).json(updatedPost);
    // remove image from server
    fs.unlinkSync(imagePath);
})

/**
 *  toggle like
 *  route => api/posts/like/:id
 *  access => private (just logged in user)
 */
module.exports.toggleLikeCtrl = asyncHandler(async(req, res) => {
  let post = await Post.findById(req.params.id)
  if(!post){
    return res.status(404).json({message: 'Post not found'})
  }
  const isPostAlreadyLiked = post.likes.find((user) => user.toString() === req.user.id);

  if(isPostAlreadyLiked){
    post = await Post.findByIdAndUpdate(req.params.id,{
      $pull:{likes:req.user.id}
    },{new: true})
  }else{
    post = await Post.findByIdAndUpdate(req.params.id,{
      $push:{likes:req.user.id}
    },{new: true})
  }
  res.status(200).json(post);
})
