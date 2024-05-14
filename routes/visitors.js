const express = require("express")
const {visitorDetailsSchema, visitorSchema} = require("../joi_verification");
const Visitor = require("../models/visitor")
const Visitor_Detail = require("../models/visitor_details")
const ExpressError = require("../utils/express_error")
const router = express.Router({mergeParams: true})
const bcrypt = require("bcrypt")

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
    console.log(visitor_user)
    await visitor_user.save()
    res.redirect(`/visitor/${visitor_user._id}/profile`)
})

router.post("/login", (req, res) => {
    res.send("HI")
})

router.get("/:id/profile", async (req, res) => {
    const {id} = req.body
    const visitor_user = await Visitor_Detail.findOne({id})
    // console.log(visitor_user)
    res.render("visitors/profile", {visitor_user})
})

router.post("/:id/profile", validateVisitor, async (req, res) => {
    res.send("HI")
})

module.exports = router