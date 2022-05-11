const { Op } = require("sequelize");
const { Retweet, Like, User, Tweet, sequelize } = require("../../sequelize");

module.exports = {
  getMyRetweets: async (id) => {
    const retweets = await Retweet.findAll({
      attributes: ["tweetId"],
      where: {
        userId: id,
      },
      raw: true,
    });
    return retweets;
  }
};
