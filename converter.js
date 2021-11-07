const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const { getFileName, getExt } = require('./utils');

ffmpeg.setFfmpegPath(ffmpegPath);

const converter = (ctx) =>
  new Promise((resolve, reject) => {
    const fileExt = getExt(ctx.headers['content-type']);
    ffmpeg(`temp/temp.${fileExt}`)
      .videoCodec('libx264')
      .audioCodec('libmp3lame')
      .on('error', (err) => {
        ctx.set({ 'Content-Type': 'application/json' });
        ctx.status = 422;
        ctx.body = JSON.stringify({ error: `An error occurred: ${err}` });
        reject();
        fs.unlinkSync(`temp/temp.${fileExt}`, (error) => {
          if (error) return console.log(error);
          console.log('file deleted successfully');
          return false;
        });
      })
      .on('end', () => {
        fs.unlinkSync(`temp/temp.${fileExt}`, (err) => {
          if (err) return console.log(err);
          console.log('file deleted successfully');
          return false;
        });
        console.log('Processing finished !');
        ctx.set({ 'Content-Type': 'application/json' });
        ctx.status = 200;
        ctx.body = JSON.stringify({ succes: 'file save' });
        resolve();
      })
      .save(`output/${getFileName()}`);
  });

module.exports = converter;
