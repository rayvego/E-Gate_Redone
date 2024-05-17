const mongoose = require("mongoose")

const visitorDetailsSchema = new mongoose.Schema({
    name: { // * filled on form
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone_number: { // * filled on form
        type: Number,
        required: true,
        length: 10
    },
    temp_data: {
        vehicle_number: String,
        reason: String,
        concerned_with: String,
        tenure: Number,
    },
    qrcode: String
})

Visitor_Detail = mongoose.model("Visitor_Detail", visitorDetailsSchema)

module.exports = Visitor_Detail