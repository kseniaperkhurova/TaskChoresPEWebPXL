const dotenv=require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;
const Task = require("../../models/taskModel");
const User = require("../../models/userModel");

const securityService = require("../../services/securityService");
const {NotFoundError, ValidationError, AuthenticationError} = require("../../services/ServiceError");

const {usersIncludingPasswords}= require("./data");

beforeEach(() => {
    jest.clearAllMocks();
});

describe("taskService", () => {
    describe("findUserByCredentials", () => {
        test.each(usersIncludingPasswords)(
            "given the credentials of an existing user it should return the User",
            async (user) => {
                const spy = jest.fn();
                jest.spyOn(User, "findOneByCredentials")
                    .mockImplementation(() => Promise.resolve(user));
                jest.spyOn(User, "countDocuments")
                    .mockImplementation(() => Promise.resolve(1));
                const result = await securityService.findUserByCredentials(user.username, user.password);
                expect(User.findOneByCredentials).toHaveBeenCalledWith(user.username, user.password);
                expect(User.countDocuments).toHaveBeenCalledWith({username:user.username});
            });
    });
});


