/*
 * Authentication Routes
 * Handles all authentication-related endpoints (login, signup, logout, etc.)
 */

const express = require("express"); // import Express framework
const authRouter = express.Router(); // create router instance for auth routes
const authController = require("../controllers/auth.controller");
authRouter.post("/register", authController.registerController);

authRouter.post("/login", authController.loginController);

module.exports = authRouter; // export auth router for use in app