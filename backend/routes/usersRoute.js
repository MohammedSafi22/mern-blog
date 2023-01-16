const router = require("express").Router();
const {
  getAllUsersCtrl,
  getUserProfileCtrl,
  updateUserProfileCtrl,
  getUsersCountCtrl,
  profilePhotoUploadCtrl,
  deleteUserProfile,
} = require("../controller/userController");
const {
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyToken,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");
const { photoUpload } = require("../middlewares/photoUpload");

// => api/users/profile
router.route("/profile").get(verifyTokenAndAdmin, getAllUsersCtrl);

// => api/users/profile
router
  .route("/profile/:id")
  .get(validateObjectId, getUserProfileCtrl)
  .put(validateObjectId, verifyTokenAndOnlyUser, updateUserProfileCtrl)
  .delete(validateObjectId,verifyTokenAndAuthorization,deleteUserProfile)

// => api/users/profile/profile-photo-upload
router
  .route("/profile/profile-photo-upload")
  .post(verifyToken, photoUpload.single("image") ,profilePhotoUploadCtrl);

// => api/users/count
router.route("/count").get(verifyTokenAndAdmin, getUsersCountCtrl);

module.exports = router;
