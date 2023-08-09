const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const JWT_SECRET = process.env.JWT_SECRET;

module.exports.authenticate = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        if ( !token ) {
            return next(createError(403, "A token is required for authentication."));
        }
        req.decodedPayload = await jwt.verify(token, JWT_SECRET, {algorithm: "HS256" }
        );
    } catch (err) {
        return next(createError(401, "Invalid authentication token."));
    }
    next();
};

module.exports.authorize = function(...permissions){
    const authorize = async (req, res, next) => {
        try {
            const decodedPayload = req.decodedPayload;
            let authorized = false;
            for (let permission of permissions){
                if( !decodedPayload.roles.includes(permission.role) ){
                    continue;
                }
                if( permission.owner && req.params.id !== decodedPayload._id ){
                    continue;
                }
                authorized = true;
                break;
            }
            if ( !authorized ){
                return next( createError( 401, "Unauthorized." ) );
            }
        } catch (err) {
            return next(createError(401, "Invalid authentication token."));
        }
        next();
    };
    return authorize;
};

