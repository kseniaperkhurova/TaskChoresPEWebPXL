const dotenv=require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {MongoClient} = require("mongodb");
const Task = require("../../models/taskModel");
const User = require("../../models/userModel");

const securityService = require("../../services/securityService");
const {NotFoundError, ValidationError, AuthenticationError} = require("../../services/ServiceError");

const {users, tasks, usersIncludingPasswords}= require("./data");

let client = null;

beforeAll(async () => {
    const DATABASE_CONNECTION = process.env.DATABASE_CONNECTION_TEST;
    const DB_CONNECTION_OPTIONS = process.env.DB_CONNECTION_OPTIONS;
    await mongoose.connect(DATABASE_CONNECTION, DB_CONNECTION_OPTIONS);
    client = new MongoClient(DATABASE_CONNECTION);
    await client.connect();
    await Task.init();
    await User.init();
});

afterAll(async () => {
    await mongoose.connection.close();
    await client.close();
});


beforeEach(async () => {
    const database = client.db();
    await database.collection("users").drop();
    await database.collection("tasks").drop();
    await database.collection("users").insertMany(users);
    await database.collection("tasks").insertMany(tasks);
});



const validUnusedIds = [
    ["0000004ccf8208cd47d51e62"],
    ["0000004dcf8208cd47d51e63"],
    ["0000004dcf8208cd47d51e64"]
];

const invalidIds = [[""], ["12"], 
    ["61a9079ed842a2429ae53d8"], 
    ["429ae53d844"] 
];

const validUnusedUserCredentials = [
    {username:"user3", password:"password3" },
    {username:"user4", password:"password4" }
]

const invalidCredentials = [{username:"aaa", password:"."}, {username:"user1", password:"."}];

describe("securityService", () => {
    describe("findUserByCredentials", () => {
        test.each(validUnusedUserCredentials)(
            "given valid credentials not associated with a user it should throw a NotFoundError",
            async (credential) => {
                expect( async () => {                    
                    await securityService.findUserByCredentials(credential.username, credential.password);
            }).rejects.toThrow(AuthenticationError);
        });

        test.each(invalidCredentials)(
            "given invalid credentials it should throw a ValidationError",
            async (credential) => {
                expect( async () => {                    
                    await securityService.findUserByCredentials(credential.username, credential.password);
            }).rejects.toThrow(AuthenticationError);
        });

        test.each(usersIncludingPasswords)(
            "given the credentials of an existing user it should return the User",
            async (user) => {
                    let username = user.username;
                    let password = user.password;
                    let result = await securityService.findUserByCredentials(username, password);
                    expect(result._id.toString()).toEqual(user._id.toString());
                    expect(result).toBeInstanceOf(User);
        });
    });
});

