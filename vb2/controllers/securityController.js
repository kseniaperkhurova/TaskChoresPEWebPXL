const userService = require("../services/userService");
const securityService = require("../services/securityService");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

module.exports.login = async function(req, res, next) {
    try{
        const status = 200;
        const username = req.body.username;
        const password = req.body.password;
        let user = await securityService.findUserByCredentials(username, password);
        const token = jwt.sign(
            { _id : user._id, roles: user.roles }
            , JWT_SECRET
            , {expiresIn: JWT_EXPIRATION, algorithm: "HS256" }
        );
        user = {
            _id: user._id,
            username: user.username,
            roles: user.roles
        };
        res.cookie("token", token,
            {   httpOnly: true,
                sameSite : "strict",
                expires: new Date(Date.now() +parseInt(JWT_EXPIRATION))
            }
        );
        res.status(status).json({user});
    }
    catch(err){
        next(err);
    }
};

module.exports.logout = async function(req, res, next) {
    try{
        const status = 200;
        res.clearCookie("token");
        res.status(status).json({});
    }
    catch(err){
        next(err);
    }
};

module.exports.checkLogin = async function(req, res, next) {
    try{
        const status = 200;
        const id = req.decodedPayload._id;
        const user = await userService.findById(id);
        res.status(status).json({user});
    }
    catch(err){
        next(err);
    }
};


