const BaseJoi = require("joi")
const {number} = require("joi")

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
                if (clean !== value) {
                    return helpers.error('string.escapeHTML', { value });
                }
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.visitorDetailsSchema = Joi.object({
    visitor: Joi.object({
        username: Joi.string().required(),
        name: Joi.string().required(),
        password: Joi.string().required(),
        phone_number: Joi.string().regex(/^[0-9]{10}$/).required(),
    }).required()
})

module.exports.visitorSchema = Joi.object({
    visitor: Joi.object({
        vehicle_number: Joi.string().required().regex(/^[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{4}$/),
        tenure: Joi.number().min(1).required(),
        concerned_with: Joi.string().required(),
        reason: Joi.string().required(),
    }).required()
})

module.exports.residentDetailsSchema = Joi.object({
    resident: Joi.object({
        ic: Joi.number().required(),
        password: Joi.string().required(),
    }).required()
})