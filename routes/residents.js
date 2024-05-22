const express = require("express")
const router = express.Router({mergeParams: true})
const resident_routes = require("../controllers/residents")
const {validateResident, resident_logged_in} = require("../utils/residents")


router.get("/login", resident_routes.renderLoginForm)

router.post("/login", validateResident, resident_routes.login)

router.get("/:id/profile", resident_logged_in, resident_routes.showProfile)

router.post("/:id/profile", resident_logged_in, resident_routes.generateQR)

router.get("/logout", resident_logged_in, resident_routes.logout)

module.exports = router