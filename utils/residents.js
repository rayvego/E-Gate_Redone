const {residentDetailsSchema} = require("./joi_verification");
const ExpressError = require("./express_error");

module.exports.validateResident = (req, res, next) => {
    const {error} = residentDetailsSchema.validate(req.body)
    if (error) {
        console.log("Server-side Joi Verification Error:", error)
        const msg = error.details.map((el) => el.message).join(", ")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.resident_logged_in = (req, res, next) => {
    if(!req.session.resident_ic) {
        req.flash("error", "Please login first!")
        return res.redirect("/resident/login")
    }
    next()
}