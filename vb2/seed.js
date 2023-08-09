const dotenv=require("dotenv");
dotenv.config();

const DATABASE_CONNECTION = process.env.DATABASE_CONNECTION ;
const DB_CONNECTION_OPTIONS = JSON.parse(process.env.DATABASE_CONNECTION_OPTIONS);

const Task = require("./models/taskModel.js");
const User = require("./models/userModel.js");
const mongoose = require("mongoose");
const $console = require("Console");

mongoose.connect(DATABASE_CONNECTION, DB_CONNECTION_OPTIONS).catch((error)=> {
    $console.error(error.message);
    cleanup(); 
});


async function run() {
    try{
        await Task.init();
        await User.init();
        await Task.deleteMany({});
        await User.deleteMany({});
        let task1 = new Task({todo:"clean your room", });
        await task1.save();
        let task2 = new Task({todo:"homework", });
        await task2.save();
        let task3 = new Task({todo:"wash the car", });
        await task3.save();
        let task4 = new Task({todo:"clean the badroom", });
        await task4.save();
        let task5 = new Task({todo:"cook the meal", });
        await task5.save();
        

        let user1 = new User({username: "root", password:"root123321", roles:["admin"]});
        await user1.save();
        let user2 = new User({username: "tim", password:"tim123321", roles:[ "user"]});

        user2.taskIds.push(task1._id);
        user2.taskIds.push(task2._id);
        await user2.save();

        let user3 = new User({username: "peter", password:"tim123321", roles:[ "user"]});
        await user3.save();
        let users = await User.find({});
        console.log("users");
        console.log(users);
        let tasks = await Task.find({});
        console.log("tasks");
        console.log(tasks);
    } catch(error){
        console.log(error.message);
    } finally {
        await mongoose.connection.close();
    }
}

run().catch((err) => {console.log(err.stack);});    
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

function cleanup () {
    $console.log("\nBye!");
    mongoose.connection.close(); 
    process.exit(); 
}

