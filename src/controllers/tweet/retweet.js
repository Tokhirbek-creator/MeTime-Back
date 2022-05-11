const { Retweet, Tweet, User } = require("../../sequelize");
const {
  addRetweetValidation,
} = require("../../utils/validation");

module.exports = {
  addRetweet: async (req, res) => {
    const validation = addRetweetValidation(req.body);
    if (validation.error)
      return res.status(400).json({ errors: validation.error.details });

    const [retweet, created] = await Retweet.findOrCreate({
      where: req.body,
      defaults: req.body,
    });
    if (!created) {
      return res
        .status(403)
        .json({ errors: "Пользователь уже поделился постом" });
    }

    await Tweet.increment("retweetsCount", {
      by: 1,
      where: { id: req.body.tweetId },
    });
    return res.status(200).json(retweet);
  },
  removeRetweet: async (req, res) => {
    const validation = addRetweetValidation(req.body);
    if (validation.error)
      return res.status(400).json({ errors: validation.error.details });

    const unRetweet = await Retweet.destroy({
      where: req.body,
    });
    if (unRetweet == 0)
      return res
        .status(403)
        .json({ errors: "Пользователь ещё не поделился постом" });

    await Tweet.decrement("retweetsCount", {
      by: 1,
      where: { id: req.body.tweetId },
    });
    return res.status(200).json({ unRetweet });
  },
  getTweetRetweets: async (req, res) => {
    const retweets = await User.findAll({
      attributes: ["firstname", "lastname", "username", "avatar", "bio"],
      include: {
        model: Retweet,
        required: true,
        attributes: ["id"],
        where: {
          tweetId: req.query.tweetId,
        },
      },
      raw: true,
    });
    return res.status(200).json({ retweets });
  },
};

