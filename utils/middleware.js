const {campgroundSchema, reviewSchema} = require('../schema')
const ExpressError = require('./ExpressError');
const Campground = require('../models/campground');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        res.redirect('/login');
    }else{
        next();
    }
    
}

module.exports.storeReturnTo = (req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

//validating campground data
module.exports.validateCampground = (req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body, { abortEarly: false });
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        return next(new ExpressError(msg,400));
    }else{
        next();
    }
}

//checking if currentUser is authorized to make edit and delete
module.exports.isAuthor = async (req,res,next)=>{
    const camp = await Campground.findById(req.params.id);
    if(!req.user._id.equals(camp.author)){
        req.flash('error','You do not have the permission to perform the operation!');
        return res.redirect(`/campground/${camp._id}`);
    }
    next();
}


//validating review data
module.exports.validateReview= (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body, { abortEarly: false });
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        return next(new ExpressError(msg,400));
    }else{
        next();
    }
}

