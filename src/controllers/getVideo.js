const fs = require('fs');

const getVideo = (ctx) =>
  new Promise((resolve, reject) => {
    const range = ctx.req.headers.range;
    if (!range) {
      reject({ status: 400, message: `Requires Range header` });
    }
    const videoPath =
      '/Users/andrejnemodruk/Documents/nodejs/video-service/output/video.mp4';
    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
    };
    const videoStream = fs.createReadStream(videoPath, { start, end });
    ctx.res.writeHead(206, headers);
    ctx.res.on('finish', resolve);
    videoStream.pipe(ctx.res);
  });

module.exports = getVideo;
