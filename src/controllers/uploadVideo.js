const fs = require('fs');
const { getExtension, getFileName } = require('../helpers/helpers');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);

const uploadVideo = async (ctx) =>
  new Promise((resolve, reject) => {
    const fileExt = getExtension(ctx.headers['content-type']);
    const writeStream = fs.createWriteStream(`temp/temp.${fileExt}`);
    ctx.req.pipe(writeStream);
    ctx.req.on('end', async () => {
      ffmpeg(`temp/temp.${fileExt}`)
        .videoCodec('libx264')
        .audioCodec('libmp3lame')
        .on('error', (err) => {
          fs.unlinkSync(`temp/temp.${fileExt}`, (error) => {
            if (error) return console.log(error);
            console.log('file deleted successfully');
            return false;
          });
          reject({ status: 422, message: `An error occurred: ${err}` });
        })
        .on('end', () => {
          fs.unlinkSync(`temp/temp.${fileExt}`, (err) => {
            if (err) return console.log(err);
            console.log('file deleted successfully');
            return false;
          });
          console.log('Processing finished !');
          resolve({ status: 200, message: { succes: 'file save' } });
        })
        .save(`output/${getFileName()}`);
    });
    writeStream.on('error', (err) => {
      reject({ status: 422, message: `An error occurred: ${err}` });
    });
  });

module.exports = uploadVideo;
