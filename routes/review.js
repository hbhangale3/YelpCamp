const express = require('express');
const app = express();

const Campground = require('../models/campground');
const Review = require('../models/reviews');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn } = require('../utils/middleware');
const {reviewSchema} = require('../schema');
const router = express.Router({mergeParams: true});

//validating review data
const validateReview= (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body, { abortEarly: false });
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        return next(new ExpressError(msg,400));
    }else{
        next();
    }
}

//creating reviews
router.post('/', validateReview, catchAsync(async (req,res)=>{
    const camp = await Campground.findById(req.params.id);
    const rev = new Review({
        comment: req.body.review,
        rating: req.body.rating
    })
    camp.review.push(rev);
    await rev.save();
    await camp.save();
    req.flash('success', 'Review Created Successfully')
    res.redirect(`/campground/${camp._id}`);
}))

//deleting reviews
router.delete('/:reviewId', isLoggedIn, catchAsync(async(req,res)=>{
    const camp = await Campground.findById(req.params.id);
    //camp.review = camp.review.filter(id => id.toString() !== req.params.reviewId);
    camp.review.pull(req.params.reviewId);
    await Review.findByIdAndDelete(req.params.reviewId);
    await camp.save();
    req.flash('success', 'Review Deleted Successfully')
    res.redirect(`/campground/${camp._id}`);
    
}))

module.exports= router