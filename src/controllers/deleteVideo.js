const fs = require('fs');
const logger = require('../helpers/logger');
const db = require('../db/models');

const deleteVideo = async (id) => {
  const { fileName } = await db.Videos.findOne({
    where: {
      id
    }
  });
  fs.unlinkSync(`output/${fileName}`, (error) => {
    if (error)
      logger.log({
        message: `file deleted successfully`,
        level: 'info'
      });
  });
  await db.Videos.destroy({
    where: {
      id
    }
  });
  return {
    status: 200,
    body: {
      success: true,
      message: 'file deleted successfully'
    }
  };
};

module.exports = deleteVideo;