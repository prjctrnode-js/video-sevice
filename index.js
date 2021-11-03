const http = require('http');
const url = require('url');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

const port = 3000;
const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
const ext = {
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'video/x-msvideo': 'avi',
};

ffmpeg.setFfmpegPath(ffmpegPath);

const server = http.createServer(async (req, res) => {
  const urlPath = url.parse(req.url, true).pathname;
  if (req.method !== 'POST') {
    res.statusCode = 404;
    res.end('Неверный метод запроса');
    return;
  }
  switch (urlPath) {
    case '/upload':
      if (!allowedTypes.includes(req.headers['content-type'])) {
        res.writeHead(422, { 'Content-Type': 'text/plain' });
        res.end(`status code=${res.statusCode}`);
        return;
      }
      if (req.headers['content-type'] === 'video/mp4') {
        const writeStream = fs.createWriteStream(
          `output/${Date.now()}${uuidv4()}.mp4`,
        );
        req.pipe(writeStream);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`status code=${res.statusCode}`);
        writeStream.on('error', (err) => {
          console.log(err);
        });
      } else {
        const writeStream = fs.createWriteStream(
          `temp/temp.${ext[req.headers['content-type']]}`,
        );
        req.pipe(writeStream);
        ffmpeg(`temp/temp.${ext[req.headers['content-type']]}`)
          .videoCodec('libx264')
          .audioCodec('libmp3lame')
          .size('320x240')
          .on('error', (err) => {
            console.log(`An error occurred: ${err.message}`);
          })
          .on('end', () => {
            fs.unlinkSync(
              `temp/temp.${ext[req.headers['content-type']]}`,
              (err) => {
                if (err) return console.log(err);
                console.log('file deleted successfully');
                return false;
              },
            );
            console.log('Processing finished !');
          })
          .save(`output/${Date.now()}${uuidv4()}.mp4`);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`status code=${res.statusCode}`);
        writeStream.on('error', (err) => {
          console.log(err);
        });
      }
      break;
    default:
      res.statusCode = 404;
      res.end('Проверьте адрес');
  }
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
