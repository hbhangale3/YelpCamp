const express = require('express');
const app = express();

const Campground = require('../models/campground');
const Review = require('../models/reviews');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../utils/middleware');
const {reviewSchema} = require('../schema');
const router = express.Router({mergeParams: true});
const reviews = require('../controllers/reviews');

router.get('/',reviews.returnToCamp)
//creating reviews
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReviews))

//deleting reviews
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReviews))

module.exports= router