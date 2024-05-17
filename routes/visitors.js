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
    const visitor = await Visitor_Detail.findById(id)
    // console.log(visitor)
    res.render("visitors/profile", {visitor})
})

router.post("/:id/profile", async (req, res) => { // Temporarily remove validateVisitor
    const { id } = req.params
    const { visitor: visitor_ } = req.body // ! OMFGGGG ALWAYS CHECK HOW HAVE U PASSED THE INFO FROM THE FORM!!!!!
    const { vehicle_number, reason, concerned_with, tenure } = visitor_
    // console.log(vehicle_number, reason, concerned_with, tenure)
    const visitor = await Visitor_Detail.findById(id)
    visitor.temp_data = {vehicle_number, reason, concerned_with, tenure}
    const qrcode = await qr.toDataURL(id)
    visitor.qrcode = qrcode
    await visitor.save()
    res.redirect(`/visitor/${visitor._id}/profile`)
})

// router.post("/:id/profile", validateVisitor, async (req, res) => {
//     const {id} = req.params
//     let {visitor: visitor_user} = req.body
//     const info = {id,
//         phone_number: visitor_user.phone_number,
//         reason: visitor_user.reason,
//         concerned_with: visitor_user.concerned_with,
//         tenure: visitor_user.tenure
//     }
//     const jsonString = JSON.stringify(info)
//     let real_qrcode = await new Promise((resolve, reject) => {
//         qr.toDataURL(jsonString, function (err, url) {
//             if (err) reject(err);
//             else resolve(url);
//         });
//     });
//     // console.log(real_qrcode, "real_qrcode here!!")
//     const visitor = await Visitor_Detail.findByIdAndUpdate(id, {qr_code: real_qrcode})
//     await visitor.save()
//     res.redirect(`/visitor/${visitor._id}/profile`)
// })

module.exports = router