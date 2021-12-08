const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const logger = require('../helpers/logger');
const { getExtension, getFileName } = require('../helpers/helpers');

ffmpeg.setFfmpegPath(ffmpegPath);

const uploadVideo = async (ctx) =>
  new Promise((resolve, reject) => {
    const fileExt = getExtension(ctx.headers['content-type']);
    const fileName = getFileName();
    const writeStream = fs.createWriteStream(`temp/temp.${fileExt}`);
    ctx.req.pipe(writeStream);
    ctx.req.on('end', async () => {
      ffmpeg(`temp/temp.${fileExt}`)
        .videoCodec('libx264')
        .audioCodec('libmp3lame')
        .on('error', (err) => {
          fs.unlinkSync(`temp/temp.${fileExt}`, (error) => {
            if (error)
              return logger.log({
                message: `${error}`,
                level: 'info'
              });
            logger.log({
              message: `file deleted successfully`,
              level: 'info'
            });
            return false;
          });
          reject(
            ctx.throw({ status: 422, message: `An error occurred: ${err}` })
          );
        })
        .on('end', () => {
          fs.unlinkSync(`temp/temp.${fileExt}`, (err) => {
            if (err)
              return logger.log({
                message: `${err}`,
                level: 'info'
              });
            logger.log({
              message: `file deleted successfully`,
              level: 'info'
            });
            return false;
          });
          logger.log({
            message: `Processing finished !`,
            level: 'info'
          });
          resolve({
            status: 201,
            message: 'success',
            fileName
          });
        })
        .save(`output/${fileName}`);
    });
    writeStream.on('error', (err) => {
      reject(ctx.throw({ status: 422, message: `An error occurred: ${err}` }));
    });
  });

module.exports = uploadVideo;
