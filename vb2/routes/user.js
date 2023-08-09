const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const securityController = require("../controllers/securityController");
const {authenticate, authorize} = require("../middleware/authentication");

router.post("/login", securityController.login);

router.post("/logout", securityController.logout);

router.post("/login/check",
    authenticate,
    authorize({role: "admin"}, {role: "user"}),
    securityController.checkLogin);

router.get("/:id/task",
    authenticate,
    authorize({role: "admin"}, {role: "user", owner: true}),
    userController.getTasksOfUser);
router.patch("/:id/task/:taskId",
    authenticate,
    authorize({role: "admin"}, {role: "user", owner: true}),
    userController.updateTaskOfUser);
// lijst van users 
router.get("/users", 
    authenticate,
    authorize({role: "admin"}),
    userController.getAllUsers);
router.get("/tasks",
    authenticate,
    authorize({role: "admin"}),
    userController.getAllTasksWithOutUser);
router.post("/allow",
    authenticate,
    authorize({role: "admin"}),
    userController.postAllowATaskToAnUser); 
    
module.exports = router;


