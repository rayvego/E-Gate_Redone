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
    qr_code: {
        type: String,
    }
})

Visitor_Detail = mongoose.model("Visitor_Detail", visitorDetailsSchema)

module.exports = Visitor_Detail