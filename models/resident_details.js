const mongoose = require("mongoose")
// Don't need to connect to the database as we are going to require this

// when a resident signs up, all the following information gets filled up
const residentDetailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    ic: { // ic = identification code
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9._%+-]+@iitgn\.ac\.in$/ // matches the pattern of IITGN email
    },
    phone_number: {
        type: Number,
        required: true,
        length: 10
    },
    address: {
        type: String,
        required: true,
    },
    qr_code: {
        type: String,
        required: true,
    },
})

Resident_Detail = mongoose.model("Resident_Detail", residentDetailSchema)

module.exports = Resident_Detail