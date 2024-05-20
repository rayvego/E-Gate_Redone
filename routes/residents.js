const express = require("express")
const {residentDetailsSchema} = require("../joi_verification");
const ExpressError = require("../utils/express_error");
const router = express.Router({mergeParams: true})
const catchAsync = require("../utils/catchAsync")
const Resident_Details = require("../models/resident_details");
const bcrypt = require("bcrypt")
const qr = require("qrcode");

const validateResident = (req, res, next) => {
    const {error} = residentDetailsSchema.validate(req.body)
    if (error) {
        console.log("Server-side Joi Verification Error:", error)
        const msg = error.details.map((el) => el.message).join(", ")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const resident_logged_in = (req, res, next) => {
    if(!req.session.resident_ic) {
        req.flash("error", "Please login first!")
        return res.redirect("/resident/login")
    }
    next()
}

router.get("/login", (req, res) => {
    res.render("residents/login")
})

router.post("/login", validateResident, catchAsync (async (req, res) => {
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
}))

router.get("/:id/profile", resident_logged_in, catchAsync (async (req, res) => {
    const {id} = req.params
    const resident = await Resident_Details.findById(id)
    console.log(resident)
    res.render("residents/profile", {resident})
}))

router.post("/:id/profile", resident_logged_in, catchAsync (async (req, res) => {
    const {id} = req.params
    const qrcode = await qr.toDataURL(id)
    const resident = await Resident_Details.findById(id)
    resident.qrcode = qrcode
    await resident.save()
    req.flash("success", "QR Code Generated Successfully!")
    res.redirect(`/resident/${resident._id}/profile`)
}))

router.get("/logout", (req, res) => {
    req.session.resident_ic = null
    req.flash("success", "Logged out successfully!")
    res.redirect("/resident/login")
})

module.exports = router