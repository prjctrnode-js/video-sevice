const http = require('http');
const url = require('url');
const fs = require('fs');
const converter = require('./converter');
const { getExt, getFileName, generateRes } = require('./utils');
const constants = require('./constants');

const port = 3000;
const allowedTypes = ['avi', 'mp4', 'mov'];

const server = http.createServer((req, res) => {
  const urlPath = url.parse(req.url, true).pathname;
  const fileType = getExt(req.headers['content-type']);
  if (req.method !== 'POST') {
    generateRes(res, constants.METHOD_NOT_ALLOWED);
    return;
  }
  switch (urlPath) {
    case '/upload':
      if (!allowedTypes.includes(fileType)) {
        generateRes(res, constants.UNSUPPORTED_MEDIA_TYPE);
        return;
      }
      if (fileType === 'mp4') {
        const writeStream = fs.createWriteStream(`output/${getFileName()}`);
        req.pipe(writeStream);
        req.on('end', () => {
          console.log(constants.RESPONSE_OK);
          generateRes(res, constants.RESPONSE_OK);
        });
        writeStream.on('error', (err) => {
          generateRes(res, null, err);
        });
      } else {
        const writeStream = fs.createWriteStream(`temp/temp.${fileType}`);
        req.pipe(writeStream);
        req.on('end', () => {
          converter(res, fileType);
        });
        writeStream.on('error', (err) => {
          generateRes(res, constants.ERROR, err);
        });
      }
      break;
    default:
      generateRes(res, constants.NOT_FOUND);
  }
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
