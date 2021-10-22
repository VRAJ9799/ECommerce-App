const authController = require("../Controllers/AuthController");
const AuthRouter = require("express").Router();

AuthRouter.post("/register", authController.registerUser);
AuthRouter.post("/login", authController.loginUser);

module.exports = AuthRouter;
