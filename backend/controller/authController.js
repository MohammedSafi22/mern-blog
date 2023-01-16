const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const {User,validateRegisterUser,validateLoginUser} = require('../models/User');

/**
 *  register a user
 *  route => api/auth/register
 *  access => public
 */
module.exports.registerUserCtrl = asyncHandler(async(req, res) => {
    // validation ==> i do it in model
    const {error} = validateRegisterUser(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }
    // is user already exist 
    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(404).json({message:"user already exists"});
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // new user and save it in db
    user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    });
    await user.save();
        // *sending email (verify account) */

    // send response to client
    res.status(201).json({message:"your'e registerd successfully , please login"});
})

/**
 *  login user
 *  route => api/auth/login
 *  access => public
 */
module.exports.loginUserCtrl = asyncHandler(async(req, res) => {
    // validation ==> i do it in model
    const {error} = validateLoginUser(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }
    // if user exists
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(400).json({message:"Invalid email or password"}); 
    }
    // check password
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if(!isPasswordMatch){
        return res.status(400).json({message:"Invalid email or password"}); 
    }
    // *sending email (verify account if not verified) */

    // generate token jwt
    const token = user.generateAuthToken();
    // send response to client
    res.status(200).json({
        _id: user._id,
        isAdmin: user.isAdmin,
        profilePhoto:user.profilePhoto,
        token,
        username: user.username
    });
})