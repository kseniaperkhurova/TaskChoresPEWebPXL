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
            "given an empty array of users it should throw a NotFoundError",
            async ()=>{
                expect(async ()=>{
                    mockingoose(User).toReturn(null, "find");
                    await userService.getAllUsers();
                }).rejects.toThrow(NotFoundError);
            });   
        });
    describe("getAllUsers", ()=> {
        test(
            "given array of users ",
            async ()=>{
            expect(async ()=>{
                mockingoose(User).toReturn(users, "find");
                jest.spyOn(userService, "getAllUsers")                        
                    .mockImplementation(() => Promise.resolve(users));
                    let result = await userService.getAllUsers();
                    expect(users).toEqual(result);
                    expect(userService.getAllUsers()).toHaveBeenCalledWith();
                    });
                });   
            });
   
    describe("findTasksOfUser", () => {
        test.each(validUnusedIds)(
            "given a valid id not associated with a user it should throw a NotFoundError",
            async (id) => {
                expect( async () => {
                    mockingoose(User).toReturn( null, "findOne");
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
                    mockingoose(User).toReturn( user, "findOne");
                    let tasksOfUser = [];
                    for(let i = 0; i < user.taskIds.length; i++){
                        let taskId = user.taskIds[i].toString();
                        for(let j = 0; j < tasks.length; j++){
                            if(tasks[j]._id.toString() == taskId){
                                tasksOfUser.push(tasks[j]);
                            }
                        }
                    }
                    mockingoose(Task).toReturn(tasksOfUser , "find");
                    let returnedTasks = await userService.findTasksOfUser(id);
                    expect(Array.isArray(returnedTasks)).toEqual(true);
                    expect(returnedTasks.length).toEqual(tasksOfUser.length);
                    let taskIds = returnedTasks.map((task)=>task._id.toString()).sort();
                    let expectedTaskIds = user.taskIds.map((id)=>id.toString()).sort();
                    for(let i = 0; i < taskIds.length; i++){
                        expect(taskIds[i]).toEqual(expectedTaskIds[i]);
                    }
            });
    });

    describe("updateTaskOfUser", () => {
        test.each(validUnusedIds)(
            "given a valid id not associated with a user it should throw a NotFoundError",
            async (id) => {
                expect( async () => {
                    mockingoose(User).toReturn( null, "findOne");
                    await userService.findTasksOfUser(id);
            }).rejects.toThrow(NotFoundError);
        });

        test.each(invalidIds)(
            "given a invalid id it should throw a ValidationError",
            async (id) => {
                expect( async () => {      
                    const spy = jest.fn();
                    jest.spyOn(userService, "findById")
                        .mockImplementation(() => Promise.reject(ValidationError));
                    await userService.updateTaskOfUser(id, tasks[0]._id.toString(), {completed:true});
            }).rejects.toThrow(ValidationError);
        });

        test.each(invalidIds)(
            "given an valid id of an existing user and an invalid taskId it should throw a ValidationError",
            async (taskId) => {    
                expect( async () => {      
                    let id = users[0]._id.toString();
                    mockingoose(User).toReturn( users[0], "findOne");
                    await userService.updateTaskOfUser(id, taskId, {completed:true});
            }).rejects.toThrow(Error);
        });

        test.each(usersWithoutTasks)(
            "given an valid id of an existing user and an valid taskId of a task not belonging to the user it should throw an AuthorisationError",
            async (user) => {    
                expect( async () => {      
                    let id = user._id.toString();
                    mockingoose(User).toReturn( user, "findOne");
                    let taskId = tasks[0]._id.toString();
                    await userService.updateTaskOfUser(id, taskId, {completed:true});
            }).rejects.toThrow(AutherisationError);
        });

        test.each(usersWithTasks)(
            "given an existing user and an existing taks it should update",
            async (user) => {    
                let id = user._id.toString();
                mockingoose(User).toReturn( user, "findOne");
                let taskId = user.taskIds[0].toString();
                jest.spyOn(taskService, "update")                        
                    .mockImplementation(() => Promise.resolve(true));
                await userService.updateTaskOfUser(id, taskId, {completed:true});
                expect(taskService.update).toHaveBeenCalledWith(taskId, {completed:true});
            });
    });
});


