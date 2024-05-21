const express = require("express")
const router = express.Router({mergeParams: true})
const mongoose = require("mongoose")
const Security = require("../models/security")
const Resident = require("../models/resident")
const Visitor = require("../models/visitor")
const Resident_Detail = require("../models/resident_details")
const Visitor_Detail = require("../models/visitor_details")
const bcrypt = require("bcrypt")
const catchAsync = require("../utils/catchAsync")
const visitor_data = require("../models/visitor");
const fetch_data  = require("../expired_visitor")
let intervalId = 1;

const security_logged_in = (req, res, next) => {
    if(!req.session.security_user_sic) {
        req.flash("error", "Please login first!")
        return res.redirect("/security/login")
    }
    next()
}

const clear_interval = (req, res, next) => {
    clearInterval(intervalId);
    intervalId = null;
    next();
};
const set_interval = (req, res, next) => {
    clearInterval(intervalId);
    intervalId = 1;
    next();
};
router.use(set_interval);

const logRouteAccess = (req, res, next) => {
    console.log(`Route accessed: ${req.method} ${req.originalUrl}`);
    next(); // Call the next middleware or route handler
};

router.get("/login", (req, res) => {
    res.render("security/login")
})

router.post("/login", async (req, res) => {
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

router.get("/scanner", security_logged_in, (req, res) => {
    res.render("security/scanner")
})

router.get("/",(req, res) => {
    res.render("security/home")
})

router.get("/logout",  (req, res) => {
    req.session.security_user_sic = null
    req.flash("success", "Logged out successfully!")
    res.redirect("/security/login")
})

router.get("/verify/:id", security_logged_in, catchAsync(async (req, res) => {
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
        console.log(e)
        console.log("NOT FOUND!!!")
        res.render("security/verify", {notFound})
    }
}))

router.post("/verify/visitor", security_logged_in, async (req, res) => {
    const {name, username, phone_number, sic, gate_number, vehicle_number, concerned_with, reason, tenure, isApproved} = req.body
    const visitor_details = await Visitor_Detail.findOne({username})
    const visitor = new Visitor({name, username, phone_number, sic, gate_number, vehicle_number, concerned_with, reason, tenure, isApproved})
    visitor_details.scan_count += 1
    await visitor_details.save()
    await visitor.save()
    await visitor.save_exit_time()
    console.log("New Visitor Saved!!")
    console.log("scan count: ", visitor_details.scan_count)
    req.flash("success", "Visitor Verified Successfully!")
    res.redirect("/security/scanner")
})

router.post("/verify/resident", security_logged_in, async (req, res) => {
    const {name, ic, email, phone_number, address, sic, gate_number, isApproved, isEntry} = req.body
    let {vehicle_number} = req.body
    if (vehicle_number === "") vehicle_number = null
    const resident = new Resident({name, ic, email, phone_number, address, sic, gate_number, vehicle_number, isApproved, isEntry})
    await resident.save()
    console.log("New Resident Saved!!")
    req.flash("success", "Resident Verified Successfully!")
    res.redirect("/security/scanner")
})

router.get("/database", async (req,res) => {
    res.render("security/databaseHome")
})

router.get("/database/resident", security_logged_in, async (req,res) =>{
    const residentData = await Resident_Detail.find({})
    res.render("security/residentLog", {residentData})
})

router.get("/database/visitor", security_logged_in, clear_interval, async (req,res) => {
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


module.exports = router