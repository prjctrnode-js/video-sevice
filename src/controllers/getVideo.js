const fs = require('fs');
const path = require('path');
const db = require('../db/models');
const axios = require('axios');

const getVideo = (ctx) =>
  new Promise(async (resolve, reject) => {
    const range = ctx.headers.range;
    if (range) {
      const { fileName } = await db.Videos.findOne({
        where: {
          id: ctx.request.query.id,
        },
      });
      await axios({
        method: 'post',
        url: `http://127.0.0.1:3001/history`,
        data: {
          userId: 3,
          videoId: ctx.request.query.id,
        },
      });
      const videoPath = path.join(__dirname, `../../output/${fileName}`);
      const videoSize = fs.statSync(videoPath).size;
      const CHUNK_SIZE = 10 ** 5; // 1MB
      const start = Number(range.replace(/\D/g, ''));
      const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
      const contentLength = end - start + 1;
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4',
      };
      fs.createReadStream(videoPath, { start, end }).pipe(ctx.res);
      ctx.status = 206;
      ctx.response.set(headers);
      ctx.res.on('finish', resolve);
    } else {
      const headers = {
        'Content-Length': videoSize,
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
      };
      ctx.response.set(headers);
      ctx.status = 200;
      fs.createReadStream(videoPath).pipe(ctx.res);
    }
  });

module.exports = getVideo;
