// * Importing and setting up dependencies
const express = require("express")
const app = express()

// Applications for handling sessions and cookies.
const session = require("express-session")
sessionConfig = {
    secret: "shouldbeabettersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // week
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}
app.use(session(sessionConfig))

const cookie_parser = require("cookie-parser")

// Utilities for handling errors (async included)
const ExpressError = require("./utils/express_error")
const catchAsync = require("./utils/catchAsync")

// connect-flash is used to store temporary messages that are cleared after being displayed to the user. These messages are often used to display notifications to the user, such as success messages after form submissions, error messages, or informational messages. The messages are stored in the session, so they are only available for the duration of the session.
const flash = require('connect-flash')

// Joi is a library that is used for server-side form verification, schema description and data validation. It allows you to create blueprints or schemas for JavaScript objects to ensure validation of key information.
const Joi = require("joi")
// TODO: const {..., ...} = require("./joi_verification")

// The following allows the app to be run from any directory on the terminal, not necessarily from the application's root folder.
const path = require("path")
// This tells Express to look for view templates in the "views" directory in the application's root directory.
app.set("views", path.join(__dirname, "views"))

// Setting up method-override to access request methods other than "GET" and "POST"
const methodOverride = require("method-override")
// The following line sets the way to access the method--in the URL, add "?_method="<method_name>" and set method="POST"
app.use(methodOverride("_method"))

// Setting up EJS which helps in creating dynamic HTML pages and EJS-mate which is a layour, partial and block template engine for EJS.
app.set("view engine", "ejs")
const ejsMate = require("ejs-mate")
app.engine("ejs", ejsMate)


// * Setting up mongoose connection
const mongoose = require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/e-gate") // Connecting to the mentioned db.
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Mongo connection successful ✅")
})
// TODO: import schema files


// * Defining middleware functions
// These are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle.

// For accessing data sent from forms.
// This function parses incoming request bodies in a middleware before your handlers, available under the req.body property. It specifically parses incoming requests with URL-encoded payloads, which is the way browsers tend to send form data from regular forms set with the application/x-www-form-urlencoded enctype.
// The extended: true option allows for the parsing of complex objects and arrays.
// In simpler words--allows Express application to read and access form data sent from the client side in a way that's easy to work with in your JavaScript code.
app.use(express.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, "public")))


// * Routes

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