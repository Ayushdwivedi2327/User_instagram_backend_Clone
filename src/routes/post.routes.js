const express = require("express"); // import Express framework to define route handling and middleware chaining
const postRouter = express.Router(); // create a dedicated router for all post-related endpoints; keeps route definitions modular and easy to mount in the main app
const createPostController = require("../controllers/post.controller"); // import controller methods for post operations; controller handles business logic outside of routing layer
const multer = require("multer"); // import Multer to parse multipart/form-data requests and handle file uploads
const upload = multer({ storage: multer.memoryStorage() }); // configure Multer to use in-memory storage for uploaded files
// NOTE: memoryStorage is convenient for short-lived uploads or processing files immediately, but can consume significant server RAM for large files or high concurrency. In production, consider diskStorage or streaming uploads to external storage with size limits.
const identifyUser = require("../middlewares/auth.middleware");
postRouter.post(
  "/",
  upload.single("image"), // middleware that accepts a single file under the "image" field and attaches it to req.file
  identifyUser,
  createPostController.createPostController, // delegate request processing to controller; keeps routing layer thin and testable
);

postRouter.get("/", identifyUser, createPostController.getPostController); // GET endpoint for listing posts; controller should handle pagination, filtering, and any security checks
postRouter.get(
  "/details/:postId",
  identifyUser,
  createPostController.getPostDetails,
); // GET endpoint for fetching details of a specific post identified by postId path parameter
postRouter.post('/like/:postId',identifyUser,createPostController.likePostController)
module.exports = postRouter; // export configured router so it can be mounted in the application's main router stack
