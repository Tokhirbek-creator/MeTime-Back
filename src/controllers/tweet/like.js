const { Like, Tweet, User } = require("../../sequelize");

module.exports = {
  likeTweet: async (req, res) => {
    const [like, created] = await Like.findOrCreate({
      where: req.body,
      defaults: req.body,
    });
    // If user tries to like tweet more than once via POST request
    if (!created) {
      return res.status(403).json({ errors: "Tweet is already liked by user" });
    }

    await Tweet.increment("likesCount", {
      by: 1,
      where: { id: req.body.tweetId },
    });
    return res.status(200).json({ like });
  },
}
