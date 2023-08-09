const createError = require("http-errors");
const {NotFoundError, ValidationError, AuthorisationError, AuthenticationError} = require("../services/ServiceError");

function errorHandler(err, req, res, next) {
    let status = err.status || 500;
    let message = err.message || "Something went wrong";
    if (err instanceof NotFoundError) {
        status = 404;
    } else if (err instanceof ValidationError) {
        status = 400;
    } else if (err instanceof AuthenticationError) {
        status = 401;
    } else if (err instanceof AuthorisationError) {
        status = 403;
    }
    res.status(status).json({"error": message});
}

function routeNotFound(req, res, next) {
    if(!req.route){
        return next(createError(501, "Route not found"));
    }
    next();
}

module.exports = { errorHandler, routeNotFound };

