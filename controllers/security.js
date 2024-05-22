const catchAsync = require("../utils/catchAsync");
const Security = require("../models/security");
const bcrypt = require("bcrypt");
const Resident_Detail = require("../models/resident_details");
const Visitor_Detail = require("../models/visitor_details");
const Visitor = require("../models/visitor");
const Resident = require("../models/resident");
const fetch_data = require("../expired_visitor");

module.exports.renderLoginForm = (req, res) => {
    res.render("security/login")
}

module.exports.login = catchAsync(async (req, res) => {
    const {security} = req.body
    const {sic, password, gate_number} = security
    const security_user = await Security.findOne({sic})
    const validPassword = await bcrypt.compare(password, security_user.password)
    if (validPassword) {
        console.log(security_user)
        req.session.security_user_sic = security_user.sic
        req.session.gate_number = gate_number
        req.flash("success", "Welcome to E-Gate!")
        res.redirect("/security/")
    } else {
        res.redirect("/security/login")
    }
})

module.exports.showScanner = (req, res) => {
    res.render("security/scanner")
}

module.exports.showHomePage = (req, res) => {
    res.render("security/home")
}

module.exports.logout = (req, res) => {
    req.session.security_user_sic = null
    req.flash("success", "Logged out successfully!")
    res.redirect("/security/login")
}

module.exports.showUserVerificationPage = catchAsync(async (req, res) => {
    const {id} = req.params
    let notFound = true
    try {
        const user = await Resident_Detail.findById(id) || await Visitor_Detail.findById(id)
        notFound = false
        let isResident = true
        if (user.email) {
            console.log("RESIDENT!!!")
            console.log(user)
            res.render("security/verify", {notFound, isResident, user})
        } else {
            isResident = false
            console.log("VISITOR!!!")
            console.log(user)
            let expired = false
            if (user.isExpired) {
                expired = true
                res.render("security/verify", {notFound, isResident, user, expired})
            } else { // qr not expired, check if the visitor is entering or exiting
                if (user.scan_count % 2 !== 0) { // matlab odd hai so the visitor is now exiting the campus so expire the qr code
                    user.qrcode = null
                    user.isExpired = true
                    user.scan_count += 1
                    await user.save()
                    req.flash("success", "Visitor Exited Successfully!")
                    res.redirect("/security/scanner")
                } else { // if qr is not expired, and it is even then the visitor is entering the campus
                    res.render("security/verify", {notFound, isResident, user, expired})
                }
            }
        }
    } catch (e) {
        notFound = true
        console.log(e)
        console.log("NOT FOUND!!!")
        res.render("security/verify", {notFound})
    }
})

module.exports.verifyVisitor = catchAsync (async (req, res) => {
    const {name, username, phone_number, sic, gate_number, vehicle_number, concerned_with, reason, tenure, isApproved} = req.body
    const visitor = new Visitor({name, username, phone_number, sic, gate_number, vehicle_number, concerned_with, reason, tenure, isApproved})
    await visitor.save()
    await visitor.save_exit_time()
    const visitor_details = await Visitor_Detail.findOne({username})
    if (isApproved == "false") { // not allowed to enter so expire the qr code and don't increase scan count
        visitor_details.qrcode = null
        visitor_details.isExpired = true
    } else {
        visitor_details.scan_count += 1
    }
    await visitor_details.save()
    console.log("New Visitor Saved!!")
    console.log("scan count: ", visitor_details.scan_count)
    req.flash("success", "Visitor Verified Successfully!")
    res.redirect("/security/scanner")
})

module.exports.verifyResident = catchAsync (async (req, res) => {
    const {name, ic, email, phone_number, address, sic, gate_number, isApproved, isEntry} = req.body
    let {vehicle_number} = req.body
    if (vehicle_number === "") vehicle_number = null
    const resident = new Resident({name, ic, email, phone_number, address, sic, gate_number, vehicle_number, isApproved, isEntry})
    await resident.save()
    const resident_details = await Resident_Detail.findOne({ic})
    if (isApproved == "true") {
        if (isEntry == "true") {
            resident_details.inCampus = true
        } else {
            resident_details.inCampus = false
        }
    }
    await resident_details.save()
    console.log("New Resident Saved!!")
    req.flash("success", "Resident Verified Successfully!")
    res.redirect("/security/scanner")
})

module.exports.showDatabaseHomePage = (req,res) => {
    res.render("security/databaseHome")
}

module.exports.showResidentDatabase = catchAsync(async (req,res) =>{
    const residentData = await Resident_Detail.find({})
    res.render("security/residentLog", {residentData})
})

let intervalId = 1;
module.exports.clear_interval = (req, res, next) => {
    clearInterval(intervalId);
    intervalId = null;
    next();
};

module.exports.set_interval = (req, res, next) => {
    clearInterval(intervalId);
    intervalId = 1;
    next();
};

module.exports.showVisitorDatabase = catchAsync(async (req,res) => {
    try {
        // Fetch campus data updated immediately
        let campusData = await fetch_data();

        // Set up interval to fetch data every 5 seconds
        if(!intervalId) {
            intervalId = setInterval(async () => {
                try {
                    campusData = await fetch_data();
                } catch (error) {
                    console.error("Error fetching campus data:", error);
                }
            }, 5 * 1000); // 5 seconds in milliseconds
        }
        res.render('security/visitorLog', { campusData });

    } catch (error) {
        console.error("Error fetching initial campus data:", error);
        res.status(500).send("Internal Server Error");
    }
})