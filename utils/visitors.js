const {visitorDetailsSchema, visitorSchema} = require("../joi_verification");
const ExpressError = require("./express_error");


module.exports.validateVisitorDetails = (req, res, next) => {
    const {error} = visitorDetailsSchema.validate(req.body)
    if (error) {
        // console.log("Server-side Joi Verification Error:", error)
        const msg = error.details.map((el) => el.message).join(", ")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.validateVisitor = (req, res, next) => {
    const {error} = visitorSchema.validate(req.body)
    if (error) {
        // console.log("Server-side Joi Verification Error:", error)
        const msg = error.details.map((el) => el.message).join(", ")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.visitor_logged_in = (req, res, next) => {
    if (!req.session.visitor_id) {
        req.flash("error", "Please login first!");
        return res.redirect("/visitor/login");
    }
    next();
};