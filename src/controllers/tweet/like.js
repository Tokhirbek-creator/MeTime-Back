const { Like, Tweet, User } = require("../../sequelize");

module.exports = {
  likeTweet: async (req, res) => {
    const [like, created] = await Like.findOrCreate({
      where: req.body,
      defaults: req.body,
    });
    if (!created) {
      return res.status(403).json({ errors: "Tweet is already liked by user" });
    }

    await Tweet.increment("likesCount", {
      by: 1,
      where: { id: req.body.tweetId },
    });
    return res.status(200).json({ like });
  },
  unlikeTweet: async (req, res) => {
    const unlike = await Like.destroy({
      where: req.body,
    });
    if (unlike == 0)
      return res
        .status(403)
        .json({ errors: "Пост уже не нравится пользователю" });

    await Tweet.decrement("likesCount", {
      by: 1,
      where: { id: req.body.tweetId },
    });
    return res.status(200).json({ unlike });
  },
  getTweetLikes: async (req, res) => {
    const likes = await User.findAll({
      attributes: ["firstname", "lastname", "username", "avatar", "bio"],
      include: {
        model: Like,
        required: true,
        attributes: ["id"],
        where: {
          tweetId: req.query.tweetId,
        },
      },
      raw: true,
    });
    return res.status(200).json({ likes });
  },
};

