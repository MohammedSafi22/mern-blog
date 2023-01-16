const asyncHandler = require('express-async-handler');
const {Category,validateCreateCategory} = require('../models/Category')

/**
 *  create a new category
 *  route => api/categories
 *  access => private(just admin)
 */
module.exports.createCategoryCtrl = asyncHandler(async(req, res)=>{
    const {error} = validateCreateCategory(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }
    const category = await Category.create({
        title: req.body.title,
        user:req.user.id,
    });
    res.status(201).json(category);
})

/**
 *  get all categories
 *  route => api/categories
 *  access => public
 */
module.exports.getAllCategoriesCtrl = asyncHandler(async(req, res)=>{
   const categories = await Category.find()
    res.status(200).json(categories);
})

/**
 *  delete category
 *  route => api/categories/:id
 *  access => private(just admin)
 */
module.exports.deleteCategoryCtrl = asyncHandler(async(req, res)=>{
    const category = await Category.findById(req.params.id);
    if(!category){
        res.status(404).json({ message : "category not found"})
    }
    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
        message: "category has been deleted",
        categoryId: category._id
    })
 })
 