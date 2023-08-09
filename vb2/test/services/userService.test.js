const dotenv=require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {MongoClient} = require("mongodb");
const Task = require("../../models/taskModel");
const User = require("../../models/userModel");

const userService = require("../../services/userService");
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

describe("userService", () => {
    describe("getAllUsers", ()=> {
        test(
            "given an  array of users",
            async ()=>{
                expect(async ()=>{
                let result =  await userService.getAllUsers();
                expect(result).toBeInstanceOf(users);
                });
            });   
        });
    describe("findById", () => {
        test.each(validUnusedIds)(
            "given a valid id not associated with a user it should throw a NotFoundError",
            async (id) => {
                expect( async () => {                    
                    await userService.findById(id);
            }).rejects.toThrow(NotFoundError);
        });

        test.each(invalidIds)(
            "given a invalid id it should throw a ValidationError",
            async (id) => {
                expect( async () => {                    
                    await userService.findById(id);
            }).rejects.toThrow(ValidationError);
        });

        test.each(users)(
            "given an existing id it should return the User",
            async (user) => {
                    let id = user._id.toString();                 
                    let result = await userService.findById(id);
                    expect(result._id.toString()).toEqual(id);
                    expect(result).toBeInstanceOf(User);
        });
    });


    describe("findTasksOfUser", () => {
        test.each(validUnusedIds)(
            "given a valid id not associated with a user it should throw a NotFoundError",
            async (id) => {
                expect( async () => {                    
                    await userService.findTasksOfUser(id);
            }).rejects.toThrow(NotFoundError);
        });

        test.each(invalidIds)(
            "given a invalid id it should throw a ValidationError",
            async (id) => {
                expect( async () => {                    
                    await userService.findTasksOfUser(id);
            }).rejects.toThrow(ValidationError);
        });

        test.each(users)(
            "given an existing id it should return the tasks of the user",
            async (user) => {
                    let id = user._id.toString();                 
                    let tasks = await userService.findTasksOfUser(id);
                    expect(Array.isArray(tasks)).toEqual(true);
                    expect(tasks.length).toEqual(user.taskIds.length);
                    let taskIds = tasks.map((task)=>task._id.toString()).sort();
                    let expectedTaskIds = user.taskIds.map((id)=>id.toString()).sort();
                    for(let i = 0; i < taskIds.length; i++){
                        expect(taskIds[i]).toEqual(expectedTaskIds[i]);
                    }
            });

        });
})


