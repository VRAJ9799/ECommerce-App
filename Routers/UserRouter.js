const userController = require("../Controllers/UserController");
const { LoggedIn, Admin } = require("../Middleware/Auth");
const UserRouter = require("express").Router();

UserRouter.get("/", userController.getAllUsers);
UserRouter.get("/:id", LoggedIn, userController.getUser);
UserRouter.put("/update-profile", LoggedIn, userController.updateProfile);
UserRouter.put("/forgot-password", userController.forgotPassword);
UserRouter.put("/reset-password", userController.resetPassword);
UserRouter.delete("/:id", LoggedIn, Admin, userController.deleteUser);

module.exports = UserRouter;
