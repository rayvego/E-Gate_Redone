const mongoose = require("mongoose")
const moment = require("moment")
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
        default: Date.now() + (5.5 * 60 * 60 * 1000)
    },
    exit_time: { // system generated, tenure = entry_time + tenure
        type: Date,
    },
    tenure: { // * filled on form
        type: Number,
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

visitorSchema.methods.save_exit_time = async function () {
    this.exit_time = new Date(this.entry_time.getTime() + this.tenure * 60 * 1000 * 60);
    await this.save();
}

Visitor = mongoose.model("Visitor", visitorSchema)

module.exports = Visitor