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

router.get("/login", (req, res) => {
    res.render("residents/login")
})

router.post("/login", validateResident, catchAsync (async (req, res) => {
    const {ic, password} = req.body.resident
    const resident = await Resident_Details.findOne({ic})

    if (resident) {
        const validResident = await bcrypt.compare(password, resident.password)
        if (validResident) {
            res.redirect(`/resident/${resident._id}/profile`)
        } else {
            res.redirect("/resident/login")
        }
    } else {
        console.log("User not found")
        res.redirect("/resident/login")
    }
}))

router.get("/:id/profile", catchAsync (async (req, res) => {
    const {id} = req.params
    const resident = await Resident_Details.findById(id)
    console.log(resident)
    res.render("residents/profile", {resident})
}))

router.post("/:id/profile", catchAsync (async (req, res) => {
    const {id} = req.params
    const qrcode = await qr.toDataURL(id)
    const resident = await Resident_Details.findById(id)
    resident.qrcode = qrcode
    await resident.save()
    res.redirect(`/resident/${resident._id}/profile`)
}))

module.exports = router