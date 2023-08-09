const dotenv = require("dotenv");
const mongoose = require("mongoose");
const $console = require("Console");
dotenv.config();

const PORT = process.env.PORT;
const DATABASE_CONNECTION = process.env.DATABASE_CONNECTION;
const DB_CONNECTION_OPTIONS = JSON.parse(process.env.DATABASE_CONNECTION_OPTIONS);
const CORS_OPTIONS = JSON.parse(process.env.CORS_OPTIONS);

const loadExpress = require("./loaders/express");
const connectMongoose = require("./loaders/database");

const app = loadExpress(CORS_OPTIONS);
let server = null;
connectMongoose(DATABASE_CONNECTION, DB_CONNECTION_OPTIONS)
    .then(() => {
        server = app.listen(PORT, () => {
            $console.log((new Date()).toUTCString(), `\tApp listening at port ${PORT}.`);
        }).on("error", cleanup);
    })
    .catch((error) => {
        $console.error(error.message);
    });

mongoose.connection.on("disconnected", function () {
    $console.error((new Date()).toUTCString(), "\tDisconnected from database.");
});
mongoose.connection.on("connected", function () {
    $console.log((new Date()).toUTCString(), "\tConnected to database.");
});

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

function cleanup(event) {
    if(event.message){
        $console.log(event.message);
    }
    $console.log((new Date()).toUTCString(), "\nBye!");
    if(server!=null){
        server.close();
    }
    mongoose.connection.close();
    process.exit();
}
