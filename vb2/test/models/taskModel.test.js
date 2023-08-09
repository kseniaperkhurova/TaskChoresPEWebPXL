const dotenv=require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {MongoClient} = require("mongodb");
const Task = require("../../models/taskModel");
const User = require("../../models/userModel");

const {users, tasks} = require("./data");
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
    await database.collection("users").deleteMany();
    await database.collection("tasks").deleteMany();
    await database.collection("users").insertMany(users);
    await database.collection("tasks").insertMany(tasks);
});

const invalidNewTasks=[{todo:""}, {todo:"."}, {todo:"a.b"}, {todo:"a.b"},
    {todo:"", completed:true}, {todo:".",completed:true}, 
    {todo:"a.b",completed:true}, {todo:"a.b",completed:true},
    {todo:"new todo", completed:"ok"}, {todo:"new todo", completed:1}
]
const validNewTasks = [ {todo:"Unusedtodo1", completed:true}, {todo:"Unusedtodo2", completed:false}  ];

describe("taskModel", () => {
    describe("save", () => {
        test.each(invalidNewTasks)(
            "given invalid task it should throw a ValidationError",
            (newTask) => {
                expect( async () => {
                    let task = new Task({newTask});
                    await task.save();
            }).rejects.toThrow(mongoose.Error.ValidationError);
        });

        test.each(validNewTasks)(
            "given a new Task it should save this task",
            async (newTask) => {
                   let task = new Task(newTask);
                   await task.save();
                   expect(task._id).toBeInstanceOf(ObjectId);
                   expect(task.todo).toBe(newTask.todo.trim());
                   expect(task.completed).toBe(newTask.completed);
            });
    })
});

