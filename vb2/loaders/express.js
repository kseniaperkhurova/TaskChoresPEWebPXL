const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("../routes/user");
const {errorHandler, routeNotFound}  = require("../middleware/error");

function loadExpress(CORS_OPTIONS) {
    const app = express();
    app.use("*", cors(CORS_OPTIONS));
    app.use(cookieParser());
    app.use(express.json());
    app.use("/user", userRouter);
    app.use(routeNotFound);
    app.use(errorHandler);
    return app;
}
module.exports = loadExpress;


