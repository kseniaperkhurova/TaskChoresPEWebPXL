class ServiceError extends Error {
    constructor(message) {
        super(message);
    }
}

class NotFoundError extends ServiceError {
    constructor(message) {
        super(message);
    }
}

class ValidationError extends ServiceError {
    constructor(message) {
        super(message);
    }
}

class AuthorisationError extends ServiceError {
    constructor(message) {
        super(message);
    }
}

class AuthenticationError extends ServiceError {
    constructor(message) {
        super(message);
    }
}


module.exports = {ServiceError, NotFoundError, ValidationError, AuthorisationError, AuthenticationError};
