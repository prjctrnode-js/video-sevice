const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);

const converter = (res, fileType) => {
  ffmpeg(`temp/temp.${fileType}`)
    .videoCodec('libx264')
    .audioCodec('libmp3lame')
    .size('320x240')
    .on('error', (err) => {
      res.writeHead(422, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `An error occurred: ${err.message}` }));
      console.log(`An error occurred: ${err.message}`);
    })
    .on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ succes: 'file save' }));
      fs.unlinkSync(`temp/temp.${fileType}`, (err) => {
        if (err) return console.log(err);
        console.log('file deleted successfully');
        return false;
      });
      console.log('Processing finished !');
    })
    .save(`output/${Date.now()}${uuidv4()}.mp4`);
};

module.exports = converter;
