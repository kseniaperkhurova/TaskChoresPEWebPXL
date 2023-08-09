const userService = require("../services/userService");
const taskService = require("../services/taskService");

module.exports.getTasksOfUser = async function(req, res, next) {
    try{
        const status = 200;
        const {id} = req.params;
        const tasks = await userService.findTasksOfUser(id);
       
        res.status(status).json(tasks);
    } catch(err){
        next(err);
    }
};

module.exports.updateTaskOfUser = async function(req, res, next) {
    try{
        const status = 200;
        const {id, taskId} = req.params;
        const {completed} = req.body;
        const task = await userService.updateTaskOfUser(id, taskId, {completed});
        res.status(status).json(task);
    } catch(err){
        next(err);
    }
};
module.exports.getAllUsers = async function(req, res, next){
    try{
        const status = 200;
        const users = await userService.getAllUsers();
        res.status(status).json(users);
    }catch(err){
        next(err);
    }
}
module.exports.getAllTasksWithOutUser = async function(req, res, next){
  
    try{
        const status = 200;
        const tasks = await taskService.getAllFreeTasks();
        res.status(status).json(tasks);
    }catch(err){
        next(err);
    }
       
}
module.exports.postAllowATaskToAnUser = async function(req, res, next){
   
    try{
        const status = 201;
        const {taskId, userId} = req.body;
        const tasks = await taskService.postAllowATaskAnUser(taskId, userId);
        res.status(status).json(tasks);
    }catch(err){
        next(err);
    }
}

