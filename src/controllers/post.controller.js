// Require the Post mongoose model to perform CRUD operations on the posts collection
const postModel = require("../models/post.model");
const likeModel = require('../models/like.model')
// Require ImageKit SDK and the helper 'toFile' to convert buffers into File-like objects
const { ImageKit, toFile } = require("@imagekit/nodejs");
// Require jsonwebtoken library to verify and decode JWT tokens sent by clients
const jwt = require("jsonwebtoken");
// Instantiate ImageKit with the private key from environment variables so uploads are authenticated
const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

// Controller: createPostController
// - Purpose: handle incoming POST requests to create a new post with an image upload.
// - Assumptions: the request contains a multipart/form-data file under req.file,
//   authentication token in req.cookies.token, and a caption in <req className="body caption"></req>
async function createPostController(req, res) {
  // Convert the uploaded file buffer into a File-like object and upload to ImageKit
  // - toFile converts a Buffer to an object accepted by ImageKit SDK
  // - folder organizes uploads under a dedicated folder for this project
  const file = await imagekit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"), // convert buffer to File-like
    fileName: "Test", // filename used in ImageKit; can be replaced with a meaningful name
    folder: "Cohort-2-Insta-Clone-Posts",
  });

  // Create a post document in MongoDB with caption, uploaded image URL and user id from token
  const post = await postModel.create({
    caption: req.body.caption, // text caption provided by client
    imgUrl: file.url, // URL returned by ImageKit after successful upload
    user: req.user.id, // user id extracted from decoded JWT payload
  });

  // Respond with 201 Created and include the newly created post object
  res.status(201).json({
    message: "Post created successfully",
    post,
  });

  // Note: the following res.send(file) is unreachable because a response has already been sent.
  // If the intention is to send the raw ImageKit response instead of the created post,
  // remove the previous res.status(201).json call. Keeping this here to preserve original
  // behavior but it will not execute.
  res.send(file);
}

// Controller: getPostController
// - Purpose: return all posts created by the authenticated user.
// - Flow: verify JWT, query posts collection for documents matching user id, return results.
async function getPostController(req, res) {
  // Extract user id from decoded token and query posts for this user
  const userId = req.user.id;
  const posts = await postModel.find({
    user: userId,
  });

  // Return the found posts with a 200 OK status
  res.status(200).json({
    message: "Post fetched successfully",
    posts,
  });
}

// Controller: getPostDetails
// - Purpose: return a single post by id only if the requesting user is the owner.
// - Security: enforces authentication and authorization checks before exposing post data.
async function getPostDetails(req, res) {
  // Get user id from token and post id from route parameters
  const userId = req.user.id;
  const postId = req.params.postId;

  // Fetch the post document by id from the database
  const post = await postModel.findById(postId);
  if (!post) {
    // If no document exists for the given id, return 404 Not Found
    return res.status(404).json({
      message: "Post not found with the id",
    });
  }

  // Authorization: ensure the requesting user owns the post
  if (post.user.toString() != userId.toString()) {
    return res.status(403).json({
      message: "Forbidden content",
    });
  }

  // On success, return the post data with 200 OK
  return res.status(200).json({
    message: "Post fetched successfully",
    post,
  });
}
async function likePostController(req, res) {
  const username = req.user.username;
  const postId = req.params.postId;
  const post = await postModel.findById(postId);
  if (!post) {
    return res.status(404).json({
      message: "The post you are looking for does not exists",
    });
  }
  const like = await likeModel.create({
    post:postId,
    user:username
  })
  return res.status(200).json({
    message:"Post liked successfully",
    like
  })
}
// Export the controller function for use in routes
module.exports = { createPostController, getPostController, getPostDetails  , likePostController};
