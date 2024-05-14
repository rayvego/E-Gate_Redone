const Joi = require("joi")
const {number} = require("joi")

module.exports.visitorDetailsSchema = Joi.object({
    visitor: Joi.object({
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