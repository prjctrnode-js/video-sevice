const { v4: uuidv4 } = require('uuid');
const constants = require('./constants');

const getExt = (fileType) => {
  const ext = {
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi'
  };
  return ext[fileType];
};

const getFileName = () => {
  const fileName = `${Date.now()}${uuidv4()}.mp4`;
  return fileName;
};

const generateRes = (res, typRes, err) => {
  switch (typRes) {
    case constants.RESPONSE_OK:
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ succes: 'file save' }));
      break;
    case constants.METHOD_NOT_ALLOWED:
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      break;
    case constants.ERROR:
      res.writeHead(422, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `An error occurred: ${err}` }));
      break;
    case constants.UNSUPPORTED_MEDIA_TYPE:
      res.writeHead(415, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unsupported Media Type' }));
      break;
    case constants.NOT_FOUND:
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'the requested address was not found' }));
      break;
    default:
      console.log('failed to define method');
  }
};

module.exports = { getExt, getFileName, generateRes };
