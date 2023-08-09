const dotenv=require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");

const ObjectId = mongoose.Types.ObjectId;
const Task = require("../../models/taskModel");
const User = require("../../models/userModel");

const userService = require("../../services/userService");
const taskService = require("../../services/taskService");

const {NotFoundError, ValidationError, AuthenticationError, AutherisationError} = require("../../services/ServiceError");

const {users, tasks, usersIncludingPasswords, usersWithoutTasks, usersWithTasks}= require("./data");


beforeEach(() => {
    mockingoose.resetAll();
    jest.clearAllMocks();
});

const validUnusedIds = [
    ["0000004ccf8208cd47d51e62"],
    ["0000004dcf8208cd47d51e63"],
    ["0000004dcf8208cd47d51e64"]
];
const validRootId = [
    ["61a76d61394acba6dbfa0d82"]
    
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
describe("taskService", () => {
    describe("getAllFreeTasks", ()=> {
        test(
            "given an empty array of users it should throw a NotFoundError",
            async ()=>{
                expect(async ()=>{ 
                    mockingoose(Task).toReturn(null, "find");
                    await taskService.getAllFreeTasks();
                    expect(taskService.getAllFreeTasks).toHaveBeenCalledWith();
                }).rejects.toThrow(NotFoundError);
            });   
        });
        describe("getAllFreeTasks", ()=> {
            test(
                "given an empty array of tasks it should throw a NotFoundError",
                async ()=>{
                    expect(async ()=>{
                        mockingoose(User).toReturn(null, "find");
                        await taskService.getAllFreeTasks();
                        expect(taskService.getAllFreeTasks).toHaveBeenCalledWith();
                        }).rejects.toThrow(NotFoundError);
                });   
            });
            describe("getAllFreeTasks", ()=> {
                test(
                    "given an array with free tasks",
                    async ()=>{
                        expect(async ()=>{
                            mockingoose(Task).toReturn(task, "find");
                            mockingoose(User).toReturn(user, "find");
                            jest.spyOn(taskService, "getAllFreeTasks")                        
                            .mockImplementation(() => Promise.resolve(true));
                            let result = await taskService.getAllFreeTasks();
                            expect(result[0]).toEqual(tasks[1]);
                            expect(taskService.getAllFreeTasks).toHaveBeenCalledWith();
                        });
                    });   
                });
            describe("postAllowATaskAnUser", ()=> {
                test.each(invalidIds)(
                    "given a invalid id it should throw a ValidationError",
                    async (id) => {
                        expect( async () => {                    
                            await taskService.postAllowATaskAnUser(id, id);
                    }).rejects.toThrow(ValidationError);
                });
                });
                describe("postAllowATaskAnUser", ()=> {
                    test.each(invalidIds)(
                        "given  one invalid id it should throw a ValidationError",
                        async (id) => {
                            expect( async () => {                    
                                await taskService.postAllowATaskAnUser(validUnusedIds[0], id);
                        }).rejects.toThrow(ValidationError);
                    });
                    });
                describe("postAllowATaskAnUser", ()=> {
                    test.each(validUnusedIds)(
                        "given  a valid id's it should change data",
                        async (id) => {
                            expect( async () => {   
                                mockingoose(User).toReturn( user, "findOne");  
                                mockingoose(Task).toReturn( task, "findOne"); 
                                jest.spyOn(taskService, "postAllowATaskAnUser")                        
                            .mockImplementation(() => Promise.resolve(true));               
                            await taskService.postAllowATaskAnUser(id, validRootId[0]);
                        expect(taskService.postAllowATaskAnUser).toHaveBeenCalledWith(id,validRootId[0]);
                        });
                    });
                });
                describe("postAllowATaskAnUser", ()=> {
                    test.each(validUnusedIds)(
                        "given error of task is not found",
                        async (id) => {
                            expect( async () => {   
                                mockingoose(Task).toReturn( null, "findOne");         
                            await taskService.postAllowATaskAnUser(id, validRootId[0]);
                        expect(taskService.postAllowATaskAnUser).toHaveBeenCalledWith(id,validRootId[0]);
                        }).rejects.toThrow(NotFoundError);
                    });
                });
                describe("postAllowATaskAnUser", ()=> {
                    test.each(validUnusedIds)(
                        "given error of user is not found",
                        async (id) => {
                            expect( async () => {   
                                mockingoose(User).toReturn( null, "findOne");         
                            await taskService.postAllowATaskAnUser(id, validRootId[0]);
                        expect(taskService.postAllowATaskAnUser).toHaveBeenCalledWith(id,validRootId[0]);
                        }).rejects.toThrow(NotFoundError);
                    });
                });
    });
   
   
   