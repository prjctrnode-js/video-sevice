const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const { getFileName, generateRes } = require('./utils');
const constants = require('./constants');

ffmpeg.setFfmpegPath(ffmpegPath);

const converter = (res, fileType) => {
  ffmpeg(`temp/temp.${fileType}`)
    .videoCodec('libx264')
    .audioCodec('libmp3lame')
    .size('320x240')
    .on('error', (err) => {
      generateRes(res, constants.ERROR, err);
    })
    .on('end', () => {
      generateRes(res, constants.RESPONSE_OK);
      fs.unlinkSync(`temp/temp.${fileType}`, (err) => {
        if (err) return console.log(err);
        console.log('file deleted successfully');
        return false;
      });
      console.log('Processing finished !');
    })
    .save(`output/${getFileName()}`);
};

module.exports = converter;
