const dotenv=require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {MongoClient} = require("mongodb");
const Task = require("../../models/taskModel");
const User = require("../../models/userModel");

const {users, tasks, usersIncludingPasswords}= require("./data");

let client = null;

beforeAll(async () => {
    const DATABASE_CONNECTION = process.env.DATABASE_CONNECTION_TEST;
    const DB_CONNECTION_OPTIONS = process.env.DB_CONNECTION_OPTIONS;
    await mongoose.connect(DATABASE_CONNECTION, DB_CONNECTION_OPTIONS);
    client = new MongoClient(DATABASE_CONNECTION);
    await client.connect();
});

afterAll(async () => {
    await mongoose.connection.close();
    await client.close();
});


beforeEach(async () => {
    const database = client.db();
    await database.collection("users").deleteMany();
    await database.collection("tasks").deleteMany();
    await database.collection("users").insertMany(users);
    await database.collection("tasks").insertMany(tasks);
});



const validCredentialsNewUser = [
            {username:"Unuseduser1", password:"Unusedpassword1"}, 
            {username:"Un2", password:"aaAA__"},
            {username:"Unuseduser2", password:"Unusedpassword1", roles:["admin"]}, 
            {username:"Un2", password:"aaAA__", roles:["admin","user"]} 
    ];

const invalidCredentialsUser = [
            {username:"wronguser1"},
            {password:"Wrongpassword1"}, 
            {username:"a", password:"Wrongpassword2"}, 
            {username:"Wronguser1", password:"."},
            {username:"Wronguser1", password:"Wrongpassword1", roles:["wrong"]}, 
            {username:"Wronguser1", password:"Wrongpassword1", roles:["admin", "wrong"]} 
    ];


describe("userModel", () => {

    describe("save", () => {
        test.each(validCredentialsNewUser)(
            "given valid credentials it should create a new user",
            async (credential) => {
                let user = new User(credential);
                await user.save();
                expect(user.username).toEqual(credential.username);
                expect(user._id).toBeInstanceOf(ObjectId);
        });

        test.each(invalidCredentialsUser)(
            "given invalid credentials it should throw a ValidationError",
            async (credential) => {
                expect( async () => {
                    let user = new User({credential});
                    await user.save();
            }).rejects.toThrow(mongoose.Error.ValidationError);
        });
    })

    describe("findOneByCredentials", () => {
        test.each(invalidCredentialsUser)(
            "given invalid credentials it should return null",
            async (credential) => {
                let username = credential.username;
                let password = credential.password;
                let result = await User.findOneByCredentials(username, password);
                expect(result).toEqual(null);
        });

        test.each(validCredentialsNewUser)(
            "given valid credentials of an unused user it should return null",
            async (credential) => {
                let result = await User.findOneByCredentials(credential.username, credential.password);
                expect(result).toEqual(null);
        });

        test.each(usersIncludingPasswords)(
            "given username of an existing user and wrong password it should return null",
            async (credential) => {
                let result = await User.findOneByCredentials(credential.username, "wrongPassword");
                expect(result).toEqual(null);
        });

        test.each(usersIncludingPasswords)(
            "given valid credentials of an existing user it should return the user",
            async (credential) => {
                let result = await User.findOneByCredentials(credential.username, credential.password);
                expect(result._id).toEqual(credential._id);
        });
        test.each(usersIncludingPasswords)(
            "given valid credentials of an existing user it should return the user en his role",
            async (credential) => {
                let result = await User.findOneByCredentials(credential.username, credential.password);
                expect(result.roles[0]).toEqual(credential.roles[0]);
        });
    })
})

