const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { route } = require('./campground');
const user = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../utils/middleware');

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

    req.login(registeredUser, (err)=>{
        if(err) return next(err);
        req.flash( 'success',`Registration Successful, Welcome ${username}`);
    res.redirect('/campground');
    })
    
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
    
    
}))

//login
router.get('/login', (req,res)=>{
    res.render('users/login');
})

router.post('/login',storeReturnTo,passport.authenticate('local',{failureFlash: true, failureRedirect:'/login'}),(req,res)=>{
req.flash('success', `Welcome to Yelp Camp ${req.body.username}`);
console.log(res.locals.returnTo);
const redirectUrl = res.locals.returnTo || '/campground';
res.redirect(redirectUrl);
})

//logout

router.get('/logout',(req,res)=>{
    req.logOut(function (err){
        if(err){
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campground');
    });
})


module.exports=router;