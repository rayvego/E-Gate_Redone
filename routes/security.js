const express = require("express")
const router = express.Router({mergeParams: true})
const {security_logged_in} = require("../utils/security")
const security_routes = require("../controllers/security")
const {set_interval, clear_interval} = require("../controllers/security")

router.use(set_interval);

router.get("/login", security_routes.renderLoginForm)

router.post("/login", security_routes.login)

router.get("/scanner", security_logged_in, security_routes.showScanner)

router.get("/", security_logged_in, security_routes.showHomePage)

router.get("/logout", security_logged_in, security_routes.logout)

router.get("/verify/:id", security_logged_in, security_routes.showUserVerificationPage)

router.post("/verify/visitor", security_logged_in, security_routes.verifyVisitor)

router.post("/verify/resident", security_logged_in, security_routes.verifyResident)

router.get("/database", security_logged_in, security_routes.showDatabaseHomePage)

router.get("/database/resident", security_logged_in, security_routes.showResidentDatabase)

router.get("/database/visitor", security_logged_in, clear_interval, security_routes.showVisitorDatabase)

module.exports = router