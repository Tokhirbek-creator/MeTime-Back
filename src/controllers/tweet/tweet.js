const { Tweet, User, Like, Comment, Retweet } = require("../../sequelize");
const { addTweetValidation } = require("../../utils/validation");
const upload = require("../upload");

module.exports = {
  addTweet: async (req, res) => {
    // Joi validation checks
    const validation = addTweetValidation(req.body);
    if (validation.error)
      return res.status(400).json({ errors: validation.error.details });

    upload(req.file, req.body.resource_type).then(async (media) => {
      console.log(media)
      try {
        const tweet = await Tweet.create({
          userId: req.body.userId,
          text: req.body.text,
          media: media.secure_url,
        });
        return res.status(200).json({ tweet });
      } catch (err) {
        return res.status(400).json({ errors: err });
      }
    });
  },
}
