const fs = require('fs');

const getVideo = (ctx) =>
  new Promise((resolve, reject) => {
    const range = ctx.headers.range;
    if (range) {
      const videoPath =
        '/Users/andrejnemodruk/Documents/nodejs/video-service/output/vid.mp4';
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
      const videoStream = fs
        .createReadStream(videoPath, { start, end })
        .pipe(ctx.res);
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
