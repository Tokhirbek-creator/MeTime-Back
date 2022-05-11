const { Op } = require("sequelize");
const { Tweet, Bookmark, User, sequelize } = require("../sequelize");
const { bookmarkValidation } = require("../utils/validation");


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
  getBookmarks: async (req, res) => {
    const tweetIds = `SELECT tweetId from Bookmarks where userId='${req.query.userId}'`;
    const tweets = await User.findAll({
      attributes: ["firstname", "lastname", "username", "avatar"],
      include: {
        model: Tweet,
        required: true,
        attributes: module.exports.tweetAttributes,
        where: {
          id: {
            [Op.in]: sequelize.literal(`(${tweetIds})`),
          },
        },
      },
      order: [[Tweet, "createdAt", "DESC"]],
      raw: true,
    });
    return res.status(200).json({ tweets });
  },
  addBookmark: async (req, res) => {
    const validation = bookmarkValidation(req.body);
    if (validation.error)
      return res.status(400).json({ errors: validation.error.details });

    const [bookmark, created] = await Bookmark.findOrCreate({
      where: req.body,
      defaults: req.body,
    });
    if (!created)
      return res
        .status(403)
        .json({ errors: "Пост уже в закладках" });

    return res.status(200).json({ bookmark });
  },
};
