const db = require('../db/models');

const getUsersVideos = async (ctx) => {
  const { userId } = ctx.request.query;
  const { limit } = ctx.request.query;
  const user = await db.Users.findOne({
    where: {
      id: userId
    }
  });
  if (!user) {
    ctx.status = 404;
    ctx.body = { success: false, message: 'video is not found' };
    return;
  }
  const res = {
    success: true,
    message: 'Success',
    data: await db.Videos.findAll({
      where: {
        userId
      },
      limit
    })
  };
  ctx.body = res;
};

module.exports = getUsersVideos;
