const mongoose = require("mongoose");
const {
    NotFoundError,
    ValidationError,
} = require("./ServiceError");
const Task = require("../models/taskModel.js");
const User = require("../models/userModel.js");
const ObjectId = mongoose.Types.ObjectId;


async function update(id, {completed, todo}) {
    if (typeof id !== "string" || !ObjectId.isValid(id)) {
        throw new ValidationError(`id ${id} is invalid`);
    }
    let task = await Task.findById(id);
    if (task == null) {
        throw new ValidationError(`Task with id ${id} not found`);
    }
    if (typeof completed !== "undefined") {
        task.completed = completed;
    }
    if (typeof todo !== "undefined") {
        task.todo = todo;
    }
    try {
        return await task.save();
    } catch (err) {
        throw new ValidationError(`Validation failed: ${err.message}`);
    }
}
async function getAllFreeTasks(){
    
    const users = await User.find({});
    if(users == null){
        throw new NotFoundError(`users are not found`);
    }
    
    const tasks = await Task.find({});
    if(tasks == null){
        throw new NotFoundError(`tasks are not found`);
    }
    
    const tasksAwarded = [];
    for(let i = 0; i< users.length; i++){
        if(users[i].taskIds.length > 0){
           
            for(let j=0; j< users[i].taskIds.length; j++){
                tasksAwarded.push(users[i].taskIds[j]);
            }
        }
    }
   
    for(let i = 0; i< tasksAwarded.length; i++){
        
        tasks.forEach(t=> console.log(t.id));
        const possible = tasks.find(t=> t.id == tasksAwarded[i]);
        const index = tasks.indexOf(possible);
        
        if (index > -1) { 
          tasks.splice(index, 1); 
        }
    }
   
    return tasks;   

}
async function postAllowATaskAnUser(taskId, userId){
    if (typeof taskId !== "string" || !ObjectId.isValid(taskId)) {
        throw new ValidationError(` of task ${taskId} is invalid`);
    }
    let task = await Task.findById(taskId);
    if (task == null) {
        throw new NotFoundError(`Task with id ${taskId} not found`);
    }
    if (typeof userId !== "string" || !ObjectId.isValid(userId)) {
        throw new ValidationError(`id of user ${userId} is invalid`);
    }
    let user = await User.findById(userId);
    if (user == null) {
        throw new NotFoundError(`User with id ${userId} not found`);
    }
    user.taskIds.push(task._id);
    try {
        return await user.save();
    } catch (err) {
        throw new ValidationError(`Validation failed: ${err.message}`);
    }
}

module.exports = {update, getAllFreeTasks, postAllowATaskAnUser};
