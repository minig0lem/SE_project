const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const signupController = require('../controllers/signupController');
const findPWController = require('../controllers/findPWController');


router.get('/', loginController.CheckLogin);
router.post('/', loginController.Login);

router.get('/signup', loginController.CheckLogin);
router.post('/signup', signupController.Signup);

router.get('/findpw', loginController.CheckLogin);
router.post('/findpw', findPWController.CheckId);
router.post('/findpw_process', findPWController.findPW);

router.post('/logout', loginController.Logout);

module.exports = router;