const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)


module.exports.campgroundSchema = Joi.object({
        title: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    price: Joi.number().min(0).required(),
    // image: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
    description: Joi.string().required().escapeHTML(),
    deleteImages: Joi.array()
    
});

module.exports.reviewSchema = Joi.object({
        rating: Joi.number().min(0).max(5),
    review: Joi.string().required().escapeHTML()
})
