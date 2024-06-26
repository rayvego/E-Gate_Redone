if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// * Importing and setting up dependencies
const express = require("express")
const app = express()

const url = process.env.DB_URL

const MongoStore = require("connect-mongo")
const store = MongoStore.create({
    mongoUrl: url,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SESSION_SECRET
    }
});
store.on("error", function(e) {
    console.log("Session Store Error", e)
})


// * Setting up mongoose connection
const mongoose = require('mongoose')
mongoose.connect(url) // Connecting to the mentioned db.
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("MAIN: Mongo connection successful ✅")
})

// Applications for handling sessions and cookies.
const session = require("express-session")
sessionConfig = {
    store,
    name: "session",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // week
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: true // for https enable when deploying
    }
}

app.use(session(sessionConfig))

const cookie_parser = require("cookie-parser")

// Utilities for handling errors (async included)
const ExpressError = require("./utils/express_error")
const catchAsync = require("./utils/catchAsync")

// connect-flash is used to store temporary messages that are cleared after being displayed to the user. These messages are often used to display notifications to the user, such as success messages after form submissions, error messages, or informational messages. The messages are stored in the session, so they are only available for the duration of the session.
const flash = require('connect-flash')
app.use(flash())

const bcrypt = require("bcrypt")

// Joi is a library that is used for server-side form verification, schema description and data validation. It allows you to create blueprints or schemas for JavaScript objects to ensure validation of key information.
const Joi = require("joi")
// TODO: const {..., ...} = require("./joi_verification")

// The following allows the app to be run from any directory on the terminal, not necessarily from the application's root folder.
const path = require("path")
// This tells Express to look for view templates in the "views" directory in the application's root directory.
app.set("views", path.join(__dirname, "views"))


const helmet = require('helmet');
app.use(helmet());

const scriptSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.4/html5-qrcode.min.js",
    "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
];
const connectSrcUrls = [

];
const fontSrcUrls = [

];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// Setting up method-override to access request methods other than "GET" and "POST"
const methodOverride = require("method-override")
// The following line sets the way to access the method--in the URL, add "?_method="<method_name>" and set method="POST"
app.use(methodOverride("_method"))

// Setting up EJS which helps in creating dynamic HTML pages and EJS-mate which is a layour, partial and block template engine for EJS.
app.set("view engine", "ejs")
const ejsMate = require("ejs-mate")
app.engine("ejs", ejsMate)

// Importing routes
const visitorRoutes = require("./routes/visitors")
const residentRoutes = require("./routes/residents")
const securityRoutes = require("./routes/security")



const {Security} = require("./models/security")

const mongoSanitize = require("express-mongo-sanitize")
app.use(mongoSanitize())

// * Defining middleware functions
// These are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle.

// For accessing data sent from forms.
// This function parses incoming request bodies in a middleware before your handlers, available under the req.body property. It specifically parses incoming requests with URL-encoded payloads, which is the way browsers tend to send form data from regular forms set with the application/x-www-form-urlencoded enctype.
// The extended: true option allows for the parsing of complex objects and arrays.
// In simpler words--allows Express application to read and access form data sent from the client side in a way that's easy to work with in your JavaScript code.
app.use(express.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, "public")))

app.use((req, res, next) => {
    res.locals.security_user_sic = req.session.security_user_sic
    res.locals.gate_number = req.session.gate_number
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currentResident = req.session.resident_ic
    res.locals.currentVisitor = req.session.visitor_id
    next()
})

// * Routes
app.use("/visitor", visitorRoutes)
app.use("/resident", residentRoutes)
app.use("/security", securityRoutes)

app.get("/", (req, res) => {
    res.render("home")
})

// * Error Handlers

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err
    if (!err.message) err.message = "Something Went Wrong!"
    res.status(statusCode).send(`Handled Error: ${err.message}  (Status Code: ${statusCode})`)
})

port = 3000
app.listen(port, () => {
    console.log(`Application running on port ${port} ✅`)
})