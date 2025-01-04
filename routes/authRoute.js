const express = require('express');
const router = express.Router();
const { verifyTokenMiddleware } = require('../middlewares/jwt');



const {handleRegisterUser, handleLoginUser, handleGetUserDetails } = require('../controllers/authController');


router.post('/register', handleRegisterUser);
router.post('/login', handleLoginUser);

router.get('/getUserDetails', verifyTokenMiddleware, handleGetUserDetails);

module.exports = router;