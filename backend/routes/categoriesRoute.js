const router = require('express').Router();
const { createCategoryCtrl, getAllCategoriesCtrl, deleteCategoryCtrl } = require('../controller/categoriesController');
const validateObjectId = require('../middlewares/validateObjectId');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');

// => api/categories
router
    .route('/')
    .post(verifyTokenAndAdmin,createCategoryCtrl)
    .get(getAllCategoriesCtrl)
// => api/categorires/:id
router
    .route('/:id')
    .delete(validateObjectId,verifyTokenAndAdmin,deleteCategoryCtrl)


module.exports = router;