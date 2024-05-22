const express = require("express")
const router = express.Router({mergeParams: true})
const visitor_routes = require("../controllers/visitors")
const {validateVisitorDetails, validateVisitor, visitor_logged_in} = require("../utils/visitors")


router.get("/signup", visitor_routes.renderSignUpForm)

router.post("/signup", validateVisitorDetails, visitor_routes.signUp)

router.get("/login", visitor_routes.renderLoginForm)

router.post("/login", visitor_routes.login)

router.get("/:id/profile", visitor_logged_in, visitor_routes.showProfile)

router.post("/:id/profile", visitor_logged_in, validateVisitor, visitor_routes.generateQR)

router.get("/logout", visitor_logged_in, visitor_routes.logout);

module.exports = router