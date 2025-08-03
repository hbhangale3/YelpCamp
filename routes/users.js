const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { route } = require('./campground');
const user = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

//registration
router.get('/register', (req,res)=>{

    res.render('users/register');
})


router.post('/register', catchAsync(async(req,res)=>{
    //res.send(req.body);
    try{
        const {email, username, password} = req.body;
    const newUser = new User({
        username: username,
        email: email
    })
    const registeredUser= await User.register(newUser, password);
    req.flash( 'success','Registration Successful!, Please Login');
    res.redirect('/campground');
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
    
    
}))

//login
router.get('/login', (req,res)=>{
    res.render('users/login');
})

router.post('/login',passport.authenticate('local',{failureFlash: true, failureRedirect:'/login'}),(req,res)=>{
req.flash('success', `Welcome to Yelp Camp ${req.body.username}`);
res.redirect('/campground');
})


module.exports=router;