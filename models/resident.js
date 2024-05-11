const mongoose = require("mongoose")
// Don't need to connect to the database as we are going to require this

// this is the logging database for residents
// ? how to authenticate? do we need to authenticate? Not a problem here, db remains same regardless...
// ? if we need to authenticate then we can keep a password field and then verify that with the one stored in resident_details db
// on the logging page, we'll populate the resident's details from the resident_details db and show there, no need to store twice
// ! WORKING: Resident shows the QR code which holds a UUID, which will fetch resident's details from resident_details db and show on the security's page who will then enter the remaining fields and then that log is stored here.
const residentSchema = new mongoose.Schema({
    resident_details: { // populated from resident_details db which will get ic, name, email, phone_number, address
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resident_Detail"
    },
    vehicle_number: { // * filled by security after the qr code page
        type: String,
        // ! MIGHT CAUSE ERROR
        match: /^[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{4}$/ // matches the pattern of MH12AB1234
    },
    isEntry: { // * filled by security after the qr code page
        type: Boolean,
        default: false
    },
    datetime: { // system generated
        type: Date,
    },
    gate_number: { // taken from security login session
        type: Number,
        required: true,
        enum: [1, 2, 3, 4]
    },
    sic: { // security identification code, taken from security login session
        type: String,
        required: true,
    },
    isApproved: { // filled by security
        type: Boolean,
    }
})

Resident = mongoose.model("Resident", residentSchema)

module.exports = Resident