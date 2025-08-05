const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { route } = require('./campground');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../utils/middleware');
const users = require('../controllers/users');
//registration
router.get('/register', users.renderRegister)

router.post('/register', catchAsync(users.userRegistration))

//login
router.get('/login', users.loginRender)

router.post('/login',storeReturnTo,passport.authenticate('local',{failureFlash: true, failureRedirect:'/login'}),users.loginOps)

//logout

router.get('/logout',users.logoutOps)


module.exports=router;