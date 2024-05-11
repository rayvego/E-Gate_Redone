// Description: This file contains the catchAsync function which is used to catch errors in async functions.
// Expects an async function as an argument and returns a function that can be used as middleware.
const catchAsync = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch((e) => next(e))
    }
}

module.exports = catchAsync