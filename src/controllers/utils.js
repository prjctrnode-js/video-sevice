const { v4: uuidv4 } = require('uuid');

const getExt = (fileType) => {
  const ext = {
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi',
  };
  return ext[fileType];
};

const getFileName = () => {
  const fileName = `${Date.now()}${uuidv4()}.mp4`;
  return fileName;
};

module.exports = { getExt, getFileName };
