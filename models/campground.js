const mongoose = require('mongoose');
const Review = require('./reviews');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
        required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    image: [
        {
            url: String,
            filename: String
        }
    ],
    description: String,
    location: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    review: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campground/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});

campgroundSchema.post('findOneAndDelete', async function(camp){
    if(camp.review.length){
        const res = await Review.deleteMany({_id:{$in: camp.review}})
        console.log(res);
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);