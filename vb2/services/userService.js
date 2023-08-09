const {
    NotFoundError,
    ValidationError,
    AuthorisationError
} = require("./ServiceError");
const mongoose = require("mongoose");
const User = require("../models/userModel.js");
const Task = require("../models/taskModel.js");
const ObjectId = mongoose.Types.ObjectId;
const taskService = require("./taskService");

async function getAllUsers(){
    const users = await User.find({});
    
    if(users == null){
        throw new NotFoundError(`users are not found`);
    }
    return users;
}
async function findById (id) {
    if (typeof id !== "string" || !ObjectId.isValid(id)) {
        throw new ValidationError(`id ${id} is invalid`);
    }
    const user = await User.findById(id);
    if (user == null) {
        throw new NotFoundError(`id ${id} not found`);
    }
    return user;
}

async function findTasksOfUser (id) {
    const user = await findById(id);
    console.log("dat is de rol van userv" + user.roles);
    const taskIds = user.taskIds;
    return Task.find()
        .where("_id").in(taskIds)
        .exec();
}

async function updateTaskOfUser (id, taskId, {completed, todo}) {
    const user = await findById(id);
    if (typeof taskId !== "string" || !ObjectId.isValid(taskId)) {
        throw new ValidationError(`taskId ${taskId} is invalid`);
    }
    const taskIds = user.taskIds.map(taskId => String(taskId));
    if (!taskIds.includes(taskId)) {
        throw new AuthorisationError(`id ${id} is not the owner of taskId ${taskId}`);
    }
    return taskService.update(taskId, {completed, todo});
}

module.exports = { findTasksOfUser, updateTaskOfUser, findById, getAllUsers};
