const dotenv=require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {MongoClient} = require("mongodb");
const Task = require("../../models/taskModel");
const User = require("../../models/userModel");
const taskService = require("../../services/taskService");
const {NotFoundError, ValidationError} = require("../../services/ServiceError");

const {users, tasks, usersIncludingPasswords}= require("./data");
const invalidIds = [[""], ["12"], 
    ["61a9079ed842a2429ae53d8"], 
    ["429ae53d844"] 
];
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


const invalidUpdatedTasks = [ {todo:""}, {todo:"."}, {todo:"a.b"}, {todo:"a.b"},
    {todo:"", completed:true}, {todo:".",completed:true}, 
    {completed:"ok"}, {completed:1},
    {todo:"newtodo", completed:"ok"}, {todo:"newtodo",completed:1}, 
];
const validUpdatedTasks = [ {todo:"Unusedtodo1", completed:true}, 
        {todo:"Unusedtodo2", completed:false},
        {todo:"Unusedtodo2"},
        {completed:true}
];




describe("taskService", () => {
   
    describe("getAllFreeTasks", ()=>{
        test(
            "given an  array of tasks",
            async ()=>{
                expect(async ()=>{
                let result =  await taskService.getAllFreeTasks();
                expect(result).toBeInstanceOf(tasks);
                });
            }); 
    });
    describe("getAllFreeTasks", ()=>{
        test(
            "given an  array of free tasks",
            async ()=>{
                expect(async ()=>{
                let result =  await taskService.getAllFreeTasks();
                expect(result[0]).toEqual(tasks[1]);
                });
            }); 
    });
    describe("postAllowATaskAnUser", ()=>{
        test(
            "given an  array of tasks",
            async ()=>{
                expect(async ()=>{
                let result =  await taskService.postAllowATaskAnUser(tasks[1]._id, users[0]._id);
                expect(users[0].taskIds[0]).toBeInstanceOf(tasks[1]._id);
                });
            }); 
    });
    describe("postAllowATaskAnUser", ()=>{
        test(
            "given an  invalid id of task",
            async ()=>{
                expect(async ()=>{
                let result =  await taskService.postAllowATaskAnUser(null, users[0]._id);
                }).rejects.toThrow(ValidationError);
            }); 
    });
    describe("postAllowATaskAnUser", ()=>{
        test(
            "given an  invalid id of task",
            async ()=>{
                expect(async ()=>{
                let result =  await taskService.postAllowATaskAnUser(1.2, users[0]._id);
                }).rejects.toThrow(ValidationError);
            }); 
    });
    describe("postAllowATaskAnUser", ()=>{
        test(
            "given an  invalid id of task",
            async ()=>{
                expect(async ()=>{
                let result =  await taskService.postAllowATaskAnUser(tasks[1]._id, 1.5);
                }).rejects.toThrow(ValidationError);
            }); 
    });
    describe("postAllowATaskAnUser", () => {
        test.each(invalidIds)(
            "given a invalid id it should throw a ValidationError",
            async (id) => {
                expect( async () => {                    
                    let result =  await taskService.postAllowATaskAnUser(tasks[1]._id, id);
            }).rejects.toThrow(ValidationError);
        });

      

        });
        describe("postAllowATaskAnUser", () => {
            test.each(invalidIds)(
                "given a invalid id it should throw a ValidationError",
                async (id) => {
                    expect( async () => {                    
                        let result =  await taskService.postAllowATaskAnUser(id, id);
                }).rejects.toThrow(ValidationError);
            });
    
          
    
            });
    
    describe("update", () => {
        test.each(invalidUpdatedTasks)(
            "given invalid task it should throw a ValidationError",
            async (updatedTask) => {
                expect( async () => {
                    for(let i = 0; i < tasks.length; i++){
                        let id = tasks[i]._id.toString();
                        await taskService.update(id, updatedTask);
                    }
            }).rejects.toThrow(ValidationError);
        });

        test.each(validUpdatedTasks)(
            "given a valid task it should update",
             async (updatedTask) => {
                for(let i = 0; i < tasks.length; i++){
                    let id = tasks[i]._id.toString();
                    let result=await taskService.update(id ,updatedTask);
                    if(updatedTask.completed){
                        expect(result.completed).toEqual(updatedTask.completed);
                    }
                    if(updatedTask.todo){
                        expect(result.todo).toEqual(updatedTask.todo);
                    }
                }
        });
    })
});
