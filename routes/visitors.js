const express = require("express")
const {visitorDetailsSchema, visitorSchema} = require("../joi_verification");
const Visitor = require("../models/visitor")
const Visitor_Detail = require("../models/visitor_details")
const ExpressError = require("../utils/express_error")
const router = express.Router({mergeParams: true})
const bcrypt = require("bcrypt")
const catchAsync = require("../utils/catchAsync")
const qr = require("qrcode")

const validateVisitorDetails = (req, res, next) => {
    const {error} = visitorDetailsSchema.validate(req.body)
    if (error) {
        // console.log("Server-side Joi Verification Error:", error)
        const msg = error.details.map((el) => el.message).join(", ")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const validateVisitor = (req, res, next) => {
    const {error} = visitorSchema.validate(req.body)
    if (error) {
        // console.log("Server-side Joi Verification Error:", error)
        const msg = error.details.map((el) => el.message).join(", ")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.get("/signup", (req, res) => {
    res.render("visitors/signup")
})

router.post("/signup", validateVisitorDetails, async (req, res) => {
    const {visitor} = req.body
    const {name, password, phone_number} = visitor
    console.log(visitor)
    const hashed_password = await bcrypt.hash(password, 12)
    const visitor_user = new Visitor_Detail({name, password: hashed_password, phone_number})
    // console.log(visitor_user)
    await visitor_user.save()
    res.redirect(`/visitor/${visitor_user._id}/profile`)
})

router.get("/login", (req, res) => {
    res.render("visitors/login")
})

router.post("/login", async (req, res) => {
    const {visitor} = req.body
    const {phone_number, password} = visitor
    const visitor_user = await Visitor_Detail.findOne({phone_number})

    if (visitor_user) {
        // console.log(visitor_user);
        const validVisitor = await bcrypt.compare(password, visitor_user.password)
        if (validVisitor) {
            res.redirect(`/visitor/${visitor_user._id}/profile`)
        } else {
            res.redirect("/visitor/login")
        }
    } else {
        console.log('User not found')
        res.redirect("/visitor/login")
    }
})

router.get("/:id/profile", async (req, res) => {
    const {id} = req.params
    const visitor = await Visitor_Detail.findOne({_id: id})
    // console.log(visitor)
    res.render("visitors/profile", {visitor})
})

router.post("/:id/profile", validateVisitor, async (req, res) => {
    const {id} = req.params
    const qrcode = await qr.toDataURL(id)
    const visitor = await Visitor_Detail.findOneAndUpdate({_id: id}, {qr_code: qrcode})
    console.log(visitor.qr_code)
    await visitor.save()
    res.redirect(`/visitor/${visitor._id}/profile`)
})

module.exports = router