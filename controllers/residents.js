const catchAsync = require("../utils/catchAsync");
const Resident_Details = require("../models/resident_details");
const bcrypt = require("bcrypt");
const qr = require("qrcode");

module.exports.renderLoginForm = (req, res) => {
    res.render("residents/login")
}

module.exports.login = catchAsync (async (req, res) => {
    const {ic, password} = req.body.resident
    const resident = await Resident_Details.findOne({ic})

    if (resident) {
        const validResident = await bcrypt.compare(password, resident.password)
        if (validResident) {
            req.flash("success", "Welcome to E-Gate!")
            req.session.resident_ic = resident.ic
            res.redirect(`/resident/${resident._id}/profile`)
        } else {
            req.flash("error", "Invalid Identification Code or Password!")
            res.redirect("/resident/login")
        }
    } else {
        // console.log("User not found")
        req.flash("error", "Invalid Identification Code or Password!")
        res.redirect("/resident/login")
    }
})

module.exports.showProfile = catchAsync (async (req, res) => {
    const {id} = req.params
    const resident = await Resident_Details.findById(id)
    console.log(resident)
    res.render("residents/profile", {resident})
})

module.exports.generateQR = catchAsync (async (req, res) => {
    const {id} = req.params
    const qrcode = await qr.toDataURL(id)
    const resident = await Resident_Details.findById(id)
    resident.qrcode = qrcode
    await resident.save()
    req.flash("success", "QR Code Generated Successfully!")
    res.redirect(`/resident/${resident._id}/profile`)
})

module.exports.logout = (req, res) => {
    req.session.resident_ic = null
    req.flash("success", "Logged out successfully!")
    res.redirect("/resident/login")
}