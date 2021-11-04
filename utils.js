const getExt = (fileType) => {
  const ext = {
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi'
  };
  return ext[fileType];
};

module.exports = getExt;
