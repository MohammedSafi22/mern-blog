const router = require("express").Router();
const validateObjectId = require("../middlewares/validateObjectId");
const { photoUpload } = require("../middlewares/photoUpload");
const {
  createPostCtrl,
  getAllPostsCtrl,
  getSinglePostCtrl,
  getPostCountCtrl,
  deletePostCtrl,
  updatePostCtrl,
  updatePostImageCtrl,
  toggleLikeCtrl,
} = require("../controller/postsController");
const { verifyToken } = require("../middlewares/verifyToken");

// => api/users/profile
router
  .route("/")
  .post(verifyToken, photoUpload.single("image"), createPostCtrl)
  .get(getAllPostsCtrl);
// => api/users/count
router.route("/count").get(getPostCountCtrl);
// => api/users/profile/:id
router
  .route("/:id")
  .get(validateObjectId, getSinglePostCtrl)
  .delete(validateObjectId, verifyToken, deletePostCtrl)
  .put(validateObjectId, verifyToken, updatePostCtrl);
// => api/posts/update-image/:id
router
  .route("/update-image/:id")
  .put(validateObjectId, verifyToken,photoUpload.single("image"), updatePostImageCtrl)
module.exports = router;
// => api/posts/like/:id
router
  .route("/like/:id")
  .put(validateObjectId,verifyToken,toggleLikeCtrl);