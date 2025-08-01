const mongoose = require('mongoose');
const Review = require('./reviews');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    review: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

module.exports = mongoose.model('Campground', campgroundSchema);