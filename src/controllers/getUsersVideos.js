const db = require('../db/models');

const getUsersVideos = async (userId, limit) => {
  const user = await db.Videos.findOne({
    where: {
      id: userId
    }
  });
  if (!user) {
    const error = { statusCode: 404, message: 'video is not found' };
    throw error;
  }
  const data = await db.Videos.findAll({
    where: {
      id: userId
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
