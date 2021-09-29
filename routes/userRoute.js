const express = require('express');
const userController =  require('../controllers/userController');
const authController = require('../controllers/authController');
const acaiRoute =  require('./acaiRoute');

const router = express.Router();
  
router.use('/:id/acai', acaiRoute);

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.delete('/:id', userController.deleteUser);

router.route('/').get(userController.getAllUsers);


module.exports =  router;