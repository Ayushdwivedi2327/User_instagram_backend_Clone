// Import the post model for database operations
const postModel = require("../models/post.model");
// Import ImageKit and toFile utility for image upload functionality
const { ImageKit, toFile } = require("@imagekit/nodejs");

// Initialize ImageKit instance with private key from environment variables for secure authentication
const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

// Async controller function to handle post creation with image upload
async function createPostController(req, res) {
  // Log request body and uploaded file details for debugging purposes
  console.log(req.body, req.file);
  
  // Upload file to ImageKit: convert buffer to file format and upload with a test filename
  const file = await imagekit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"), // Convert buffer to file object
    fileName: "Test", // Set the filename for the uploaded image
  });
  
  // Send the uploaded file response back to the client
  res.send(file);
}

// Export the controller function for use in routes
module.exports = { createPostController };
