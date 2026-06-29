const userModel = require("../models/user.model"); // import user model for database access
// const crypto = require("crypto"); // import crypto module for password hashing
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // import jsonwebtoken for JWT creation

async function registerController(req, res) {
  // handle POST /register requests
  const { email, username, password, bio, profileimg } = req.body; // extract registration fields from request body
  const isUserExist = await userModel.findOne({ $or: [{ username, email }] }); // check if username or email already exists
  if (isUserExist) {
    // if a user already exists
    return res.status(409).json({
      // send conflict response
      message: "User already exists", // return duplicate user message
    });
  }
  const hash = await bcrypt.hash(password, 10); // hash the password
  const user = await userModel.create({
    // create a new user document
    username, // store username
    profileimg, // store profile image value
    password: hash, // store hashed password
    bio, // store bio text
    email, // store email address
  });

  const token = jwt.sign(
    // create JWT token for session
    {
      id: user._id, // include user ID in token payload
      username: user.username,
    },
    process.env.JWT_SECRET, // sign token with secret from environment variables
    {
      expiresIn: "1d", // set token expiration to one day
    },
  );
  res.cookie("token", token); // set authentication token cookie

  res.status(201).json({
    // send created response with user data
    message: "user registerd successfully", // confirm registration success
    user: {
      email: user.email, // include user email in response
      username: user.username, // include username in response
      bio: user.bio, // include user bio in response
      profileimg: user.profileimg, // include profile image in response
    },
  });
}

async function loginController(req, res) {
  // handle POST /login requests
  const { username, email, password } = req.body; // extract login credentials from request body
  const user = await userModel.findOne({
    // find user by username or email
    $or: [{ username: username }, { email: email }],
  });
  if (!user) {
    // if no matching user is found
    return res.status(404).json({
      // send not found status
      message: "User  not exists", // return user not found message
    });
    await bcrypt.hash(password, 10); // hash the password

    const isPasswordValid = await bcrypt.compare(password, user.password); // hash the password
    // compare hashed password with stored hash
    if (!isPasswordValid) {
      // if password is incorrect
      return res.status(401).json({
        // send unauthorized status
        message: "Password wrong", // return wrong password message
      });
    }
  }
  const token = jwt.sign(
    // create JWT token for authenticated user
    {
      id: user._id, // include user ID in token payload
      username: user.username,
    },
    process.env.JWT_SECRET, // use secret key from environment variables
    { expiresIn: "1d" }, // token expires in one day
  );
  res.cookie("token", token); // set token cookie in response
  res.status(200).json({
    // send successful login response
    message: "User logged in success", // login success message
    user: {
      username: user.username, // include username in response
      email: user.email, // include email in response
      bio: user.bio, // include bio in response
      profileimg: user.profileimg, // include profile image in response
    },
  });
}

module.exports = {
  registerController,
  loginController,
};
