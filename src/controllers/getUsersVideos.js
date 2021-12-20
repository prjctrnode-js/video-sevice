const db = require('../db/models');

const getUsersVideos = async (userId, limit) => {
  const user = await db.Videos.findOne({
    where: {
      id: userId
    }
  });
  if (!user) {
    return {
      status: 404,
      body: { success: false, message: 'video is not found' }
    };
  }
  const data = await db.Videos.findAll({
    where: {
      userId
    },
    limit
  });
  return {
    status: 200,
    body: {
      success: true,
      message: 'Success',
      data
    }
  };
};

module.exports = getUsersVideos;
