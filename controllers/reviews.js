const Campground = require('../models/campground');
const Review = require('../models/reviews');

module.exports.returnToCamp = (req,res)=>{
    res.redirect(`/campground/${req.params.id}`);
}

module.exports.createReviews = async (req,res)=>{
    const camp = await Campground.findById(req.params.id);
    const rev = new Review({
        comment: req.body.review,
        rating: req.body.rating
    })
    rev.author = req.user._id;
    camp.review.push(rev);
    await rev.save();
    await camp.save();
    req.flash('success', 'Review Created Successfully')
    res.redirect(`/campground/${camp._id}`);
}

module.exports.deleteReviews = async(req,res)=>{
    const camp = await Campground.findById(req.params.id);
    //camp.review = camp.review.filter(id => id.toString() !== req.params.reviewId);
    camp.review.pull(req.params.reviewId);
    await Review.findByIdAndDelete(req.params.reviewId);
    await camp.save();
    req.flash('success', 'Review Deleted Successfully')
    res.redirect(`/campground/${camp._id}`);
    
}