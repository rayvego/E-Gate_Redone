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
let intervalId =1;
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
        res.redirect("/security/home")
    } else {
        res.redirect("/security/login")
    }
})

router.get("/scanner", (req, res) => {
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
            console.log("VISITOR!!!")
            console.log(user)
            // const {vehicle_number, reason, concerned_with, tenure} = user.temp_data
            // console.log(vehicle_number, reason, concerned_with, tenure)
            isResident = false
            res.render("security/verify", {notFound, isResident, user})
        }
    } catch (e) {
        console.log(e)
        console.log("NOT FOUND!!!")
        res.render("security/verify", {notFound})
    }
}))

router.post("/verify/visitor", security_logged_in, async (req, res) => {
    const {name, isApproved, phone_number, sic, gate_number, vehicle_number, concerned_with, reason, tenure} = req.body
    const visitor = new Visitor({name, phone_number, sic, gate_number, vehicle_number, concerned_with, reason, tenure, isApproved})
    await visitor.save()
    console.log("New Visitor Saved!!")
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

router.get("/database/resident", async (req,res) =>{
    const residentData = await Resident_Detail.find({})
    res.render("security/residentLog", {residentData})
})

router.get("/database/visitor", clear_interval, async (req,res) => {
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