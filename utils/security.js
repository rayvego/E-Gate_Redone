

module.exports.security_logged_in = (req, res, next) => {
    if(!req.session.security_user_sic) {
        req.flash("error", "Please login first!")
        return res.redirect("/security/login")
    }
    next()
}



module.exports.logRouteAccess = (req, res, next) => {
    console.log(`Route accessed: ${req.method} ${req.originalUrl}`);
    next(); // Call the next middleware or route handler
};