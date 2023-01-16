const router = require('express').Router();
const {registerUserCtrl, loginUserCtrl, verifyUserAccountCtrl} =  require('../controller/authController');

// => api/auth/register
router.post('/register', registerUserCtrl);

// => api/auth/login
router.post('/login', loginUserCtrl);

module.exports = router;