const mongoose = require("mongoose");

async function connectMongoose(DATABASE_CONNECTION, DB_CONNECTION_OPTIONS) {
    return await mongoose.connect(DATABASE_CONNECTION, DB_CONNECTION_OPTIONS);
}
module.exports = connectMongoose;


