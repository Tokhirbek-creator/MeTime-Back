const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { User } = require("../../sequelize");
const { addUserValidation } = require("../../utils/validation");
const {
  getMyRetweets,
  getMyLikes,
  getLikedTweets,
  getUserTweets,
  getUserRetweets,
} = require("./globals");
const { signJwt } = require("../../authorization");
const upload = require("../upload");

module.exports = {
  tweetAttributes: [
    "id",
    "text",
    "media",
    "commentsCount",
    "retweetsCount",
    "likesCount",
    "createdAt",
  ],
  addUser: async (req, res) => {
    // Joi validation checks
    const validation = addUserValidation(req.body);
    if (validation.error)
      return res.status(400).json({ errors: validation.error.details });

    try {
      // Create password hash
      let saltRounds = 10;
      const hash = await bcrypt.hash(req.body.password, saltRounds);
      req.body.password = hash;

      // Add user to User model
      const user = await User.create(req.body);

      const token = signJwt({
        user: {
          id: user.id,
        },
      });
      return res.status(200).json({
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          avatar: user.avatar,
          cover: user.cover,
          dob: user.dob,
          location: user.location,
          bio: user.bio,
          token,
        },
      });
    } catch (err) {
      let errors = {};
      console.log(err.errors);
      err.errors.map((e) => {
        if (e.path === "users.username" && e.validatorKey === "not_unique")
          errors.username = "Никнейм уже занят";
        if (e.path === "users.email" && e.validatorKey === "not_unique")
          errors.email = "Такой email уже зарегистрирован";
      });
      return res.status(400).json({ errors });
    }
  },
};
