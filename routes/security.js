const express = require("express")
const router = express.Router({mergeParams: true})

router.get("/login", (req, res) => {
    res.render("security/login")
})

router.get("/home", (req,res) => {
    res.render("security/home")
})

router.get("/scanner", (req,res) => {
    res.render("security/scanner")
})
router.post("/login", (req, res) => {
    res.send("HI")
})


module.exports = router