/* eslint-disable no-async-promise-executor */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const db = require('../db/models');

const getVideo = async (ctx) =>
  new Promise(async (resolve) => {
    const { range } = ctx.headers;
    const { id } = ctx.params;
    const { fileName } = await db.Videos.findOne({
      where: {
        id
      }
    });
    const videoPath = path.join(__dirname, `../../output/${fileName}`);
    const videoSize = fs.statSync(videoPath).size;
    if (range) {
      await axios({
        method: 'post',
        url: process.env.HISTORY_POST,
        data: {
          userId: 3,
          videoId: ctx.params.id
        }
      });
      const CHUNK_SIZE = 10 ** 5; // 1MB
      const start = Number(range.replace(/\D/g, ''));
      const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
      const contentLength = end - start + 1;
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4'
      };
      fs.createReadStream(videoPath, { start, end }).pipe(ctx.res);
      ctx.status = 206;
      ctx.response.set(headers);
      ctx.res.on('finish', resolve);
    } else {
      const headers = {
        'Content-Length': videoSize,
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes'
      };
      ctx.response.set(headers);
      ctx.status = 200;
      fs.createReadStream(videoPath).pipe(ctx.res);
    }
  });

module.exports = getVideo;
