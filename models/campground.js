const mongoose = require('mongoose');
const Review = require('./reviews');
const Schema = mongoose.Schema;

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
});

campgroundSchema.post('findOneAndDelete', async function(camp){
    if(camp.review.length){
        const res = await Review.deleteMany({_id:{$in: camp.review}})
        console.log(res);
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);