const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
        title: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().min(0).required(),
    image: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
    description: Joi.string().required()
    
});

module.exports.reviewSchema = Joi.object({
        rating: Joi.number(),
    review: Joi.string().required()
})
