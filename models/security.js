const mongoose = require("mongoose")

const securitySchema = new mongoose.Schema({
    sic: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone_number: {
        type: Number,
        required: true,
        length: 10,
    },
    photo: {
        type: String, // store the url of the image uploaded on cloud idk
    },
})

Security = mongoose.model("Security", securitySchema)

module.exports = Security