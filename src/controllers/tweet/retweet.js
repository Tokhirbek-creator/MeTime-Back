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
}
