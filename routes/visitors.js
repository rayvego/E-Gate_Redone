const express = require("express")
const router = express.Router({mergeParams: true})

router.get("/signup", (req, res) => {
    res.render("visitors/signup")
})

router.post("/signup", (req, res) => {
    res.send("HI")
})

router.post("/login", (req, res) => {
    res.send("HI")
})

module.exports = router