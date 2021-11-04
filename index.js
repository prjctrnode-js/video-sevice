const http = require('http');
const url = require('url');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const converter = require('./converter');
const getExt = require('./utils');

const port = 3000;
const allowedTypes = ['avi', 'mp4', 'mov'];

const server = http.createServer((req, res) => {
  const urlPath = url.parse(req.url, true).pathname;
  const fileType = getExt(req.headers['content-type']);
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }
  switch (urlPath) {
    case '/upload':
      if (!allowedTypes.includes(fileType)) {
        res.writeHead(415, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unsupported Media Type' }));
        return;
      }
      if (fileType === 'mp4') {
        const writeStream = fs.createWriteStream(
          `output/${Date.now()}${uuidv4()}.mp4`
        );
        req.pipe(writeStream);
        req.on('end', () => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ succes: 'file save' }));
        });
        writeStream.on('error', (err) => {
          res.writeHead(422, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({ error: `An error occurred: ${err.message}` })
          );
          console.log(`An error occurred: ${err.message}`);
        });
      } else {
        const writeStream = fs.createWriteStream(`temp/temp.${fileType}`);
        req.pipe(writeStream);
        req.on('end', () => {
          converter(res, fileType);
        });
        writeStream.on('error', (err) => {
          res.writeHead(422, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({ error: `An error occurred: ${err.message}` })
          );
          console.log(`An error occurred: ${err.message}`);
        });
      }
      break;
    default:
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'the requested address was not found' }));
  }
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
