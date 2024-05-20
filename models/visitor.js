const mongoose = require("mongoose")
// Don't need to connect to the database as we are going to require this

const visitorSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    name: { // * filled on form
        type: String,
        required: true,
    },
    phone_number: { // * filled on form
        type: Number,
        required: true,
        length: 10
    },
    vehicle_number: { // * filled on form
        type: String,
        required: true,
        match: /^[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{4}$/ // matches the pattern of MH12AB1234
    },
    entry_time: { // system generated
        type: Date,
        default: Date.now()
    },
    exit_time: { // system generated, tenure = entry_time + tenure
        type: Date,
    },
    tenure: { // * filled on form
        type: Date,
    },
    gate_number: { // taken from security login session
        type: Number,
        required: true,
        enum: [1, 2, 3, 4]
    },
    sic: { // security identification code,  taken from security login session
        type: String,
        required: true,
    },
    concerned_with: { // * filled on form
        type: String,
        required: true,
    },
    reason: { // * filled on form
        type: String,
        required: true,
    },
    isApproved: { // filled by security
        type: Boolean,
    }
})

Visitor = mongoose.model("Visitor", visitorSchema)

module.exports = Visitor