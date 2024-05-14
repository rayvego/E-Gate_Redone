const express = require("express")
const router = express.Router({mergeParams: true})
const mongoose = require("mongoose")
const Security = require("../models/security")
const bcrypt = require("bcrypt")

const security_logged_in = (req, res, next) => {
    if(!req.session.security_user_id) {
        return res.redirect("/login")
    }
    next()
}


router.get("/login", (req, res) => {
    res.render("security/login")
})

router.post("/login", async (req, res) => {
    const {security} = req.body
    const {sic, password, gate_number} = security
    const security_user = await Security.findOne({sic})
    const validPassword = await bcrypt.compare(password, security_user.password)
    if (validPassword) {
        req.session.security_user_sic = security_user.sic
        req.session.gate_number = gate_number
        res.redirect("/security/secret")
    } else {
        res.redirect("/login")
    }
})

router.get("/secret", (req, res) => {
    console.log(req.session.gate_number, req.session.security_user_sic)
    res.send("ok")
})


module.exports = router