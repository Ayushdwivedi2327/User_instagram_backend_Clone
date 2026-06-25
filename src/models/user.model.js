const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "Username already exists"],
    required: [true, "username is required"],
  },
  email: {
    type: String,
    unique: [true, "Email already exists"],
    required: [true, "Email is required"],
  },
  password:{
    type:String,
    required:[true,'password is required']
  },
  bio:String,
  profileimg:{
    type:String,
    default:"https://ik.imagekit.io/ayushDwivedi/insta/posts/TEST_OSU7INBPf?updatedAt=1775049558921"
  }
});
const userModel = mongoose.model('users' , userSchema)
module.exports = userModel