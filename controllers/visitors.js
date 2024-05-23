const bcrypt = require("bcrypt");
const Visitor_Detail = require("../models/visitor_details");
const catchAsync = require("../utils/catchAsync");
const qr = require("qrcode");

module.exports.renderSignUpForm = (req, res) => {
    res.render("visitors/signup")
}

module.exports.signUp = catchAsync (async (req, res) => {
    const {visitor} = req.body
    const {name, password, phone_number, username} = visitor
    console.log(visitor)
    const hashed_password = await bcrypt.hash(password, 12)
    const visitor_user = new Visitor_Detail({name, username, password: hashed_password, phone_number})
    // console.log(visitor_user)
    try {
        await visitor_user.save()
        req.session.visitor_id = visitor_user._id
        req.flash("success", "Welcome to E-Gate!")
        res.redirect(`/visitor/${visitor_user._id}/profile`)
    } catch (err) {
        if (err.code === 11000) {
            console.log('Username already exists')
            req.flash("error", "That username already exists, please enter another one!")
            res.redirect("/visitor/signup")
        } else {
            console.log(err);
        }
    }
})

module.exports.renderLoginForm = (req, res) => {
    res.render("visitors/login")
}

module.exports.login = catchAsync (async (req, res) => {
    const {visitor} = req.body
    const {username, password} = visitor
    const visitor_user = await Visitor_Detail.findOne({username})

    if (visitor_user) {
        console.log(visitor_user);
        const validVisitor = await bcrypt.compare(password, visitor_user.password)
        if (validVisitor) {
            req.session.visitor_id = visitor_user._id
            req.flash("success", "Welcome back!")
            res.redirect(`/visitor/${visitor_user._id}/profile`)
        } else {
            req.flash("error", "Invalid Username or Password!")
            res.redirect("/visitor/login")
        }
    } else {
        console.log('User not found')
        req.flash("error", "Invalid Username or Password!")
        res.redirect("/visitor/login")
    }
})

module.exports.showProfile = catchAsync (async (req, res) => {
    const {id} = req.params
    const visitor = await Visitor_Detail.findById(id)
    // console.log(visitor)
    console.log(visitor._id)
    res.render("visitors/profile", {visitor})
})

module.exports.generateQR = catchAsync (async (req, res) => { // Temporarily remove validateVisitor
    const { id } = req.params
    const { visitor: visitor_ } = req.body // ! OMFGGGG ALWAYS CHECK HOW HAVE U PASSED THE INFO FROM THE FORM!!!!!
    const { vehicle_number, reason, concerned_with, tenure } = visitor_
    // console.log(vehicle_number, reason, concerned_with, tenure)
    const visitor = await Visitor_Detail.findById(id)
    visitor.temp_data = {vehicle_number, reason, concerned_with, tenure}
    const qrcode = await qr.toDataURL(id)
    visitor.qrcode = qrcode
    visitor.isExpired = false
    await visitor.save()
    req.flash("success", "QR Code Generated Successfully!")
    res.redirect(`/visitor/${visitor._id}/profile`)
})

module.exports.deleteAccount = catchAsync (async (req, res) => {
    const id = req.session.visitor_id
    const visitor = await Visitor_Detail.findByIdAndDelete(id)
    req.session.visitor_id = null
    req.flash("success", "Account Deleted Successfully!")
    res.redirect("/visitor/login")
})

module.exports.logout = (req, res) => {
    req.session.visitor_id = null;
    req.flash("success", "Logged out successfully!");
    res.redirect("/visitor/login");
}