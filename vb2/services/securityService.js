const {
    AuthenticationError,
} = require("./ServiceError");
const User = require("../models/userModel.js");


async function findUserByCredentials(username, password) {
    const userExists = await User.countDocuments({username}) != 0;
    if (!userExists) {
        throw new AuthenticationError(`${username} not found`);
    }
    const user = await User.findOneByCredentials(username, password);
    if (user == null) {
        throw new AuthenticationError(`${password} incorrect`);
    }
    return user;
}

module.exports = {findUserByCredentials};


