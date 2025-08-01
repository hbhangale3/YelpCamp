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

campgroundSchema.post('findOneAndDelete', async function(camp){
    if(camp.review.length){
        const res = await Review.deleteMany({_id:{$in: camp.review}})
        console.log(res);
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);