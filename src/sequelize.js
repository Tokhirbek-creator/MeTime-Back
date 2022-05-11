const { Sequelize } = require("sequelize");
const UserModel = require("./models/User");
const FollowerModel = require("./models/Follower");
const TweetModel = require("./models/Tweet");
const RetweetModel = require("./models/Retweet");
const LikeModel = require("./models/Like");
const CommentModel = require("./models/Comment");
const BookmarkModel = require("./models/Bookmark");

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
});
(async () => {
  try {
    const res = await sequelize.sync();
  } catch (err) {
    console.log(err);
  }
})();

const User = UserModel(sequelize);
const Follower = FollowerModel(sequelize);
const Tweet = TweetModel(sequelize);
const Retweet = RetweetModel(sequelize);
const Like = LikeModel(sequelize);
const Comment = CommentModel(sequelize);
const Bookmark = BookmarkModel(sequelize);

User.hasMany(Follower, { as: "Followers", foreignKey: "follower" });
User.hasMany(Follower, { as: "Following", foreignKey: "followed" });

User.hasMany(Tweet, { foreignKey: "userId" });
User.hasMany(Like, { foreignKey: "userId" });
User.hasMany(Retweet, { foreignKey: "userId" });
Tweet.hasMany(Like, { foreignKey: "tweetId" });
Tweet.hasMany(Retweet, { foreignKey: "tweetId" });
User.hasMany(Comment, { foreignKey: "userId" });
Tweet.hasMany(Bookmark, { foreignKey: "tweetId" });
User.hasMany(Bookmark, { foreignKey: "userId" });

module.exports = {
  User,
  Follower,
  Tweet,
  Retweet,
  Like,
  Comment,
  Bookmark,
  sequelize,
};
