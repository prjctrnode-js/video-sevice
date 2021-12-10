const db = require('../db/models');

const getUsersVideos = async (ctx) => {
  const userId = ctx.request.query.id;
  const { limit } = ctx.request.query;
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
