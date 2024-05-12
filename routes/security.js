const express = require("express")
const router = express.Router({mergeParams: true})

router.get("/login", (req, res) => {
    res.render("security/login")
})

router.post("/login", (req, res) => {
    res.send("HI")
})


module.exports = router