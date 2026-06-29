const followModel = require("../models/follow.model");

async function followUserController(req, res) {
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;
  if (followeeUsername === followerUsername) {
    return res.status(400).json({
      message: "You can not follow yourself",
    });
  }
  const isAlreadyFollowing = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });
  const isFolloweeExists = await followModel.findOne({
    username: followeeUsername,
  });
  if (!isFolloweeExists) {
    return res.status(404).json({
      message: "The followee does not exits",
    });
  }
  if (isAlreadyFollowing) {
    return res.status(200).json({
      message: `You are already following the ${followeeUsername}`,
    });
  }
  const followRecord = await followModel.create({
    follower: followerUsername,
    followee: followeeUsername,
  });
  res.status(201).json({
    message: `You are now following ${followeeUsername}`,
    follow: followRecord,
  });
}

async function unfollowUserController(req, res) {
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  const isUserFollowing = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });
  if (!isUserFollowing) {
    return res.status(400).json({
      message: `You are not following the ${followeeUsername}`,
    });
  }
  await followModel.findByIdAndDelete(isUserFollowing._id);
  res.status(200).json({
    message: `You have unfollowed ${followeeUsername}`,
  });
}
module.exports = {
  followUserController,
  unfollowUserController,
};
