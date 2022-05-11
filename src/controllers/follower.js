const { User, Follower } = require("../sequelize");

module.exports = {
  followUser: async (req, res) => {
    const body = {
      followed: req.body.followedId,
      follower: req.body.followerId,
    };
    const alreadyFollowing = await Follower.findOne({
      where: body,
    });

    return alreadyFollowing
      ? res.status(200).json(await Follower.destroy({ where: body }))
      : res.status(200).json(await Follower.create(body));
  },
};
