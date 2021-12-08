const { getExtension } = require('../helpers/helpers');

const allowedTypes = ['avi', 'mp4', 'mov'];

const checkExtension = async (ctx, next) => {
  if (!allowedTypes.includes(getExtension(ctx.headers['content-type']))) {
    ctx.throw(415, 'Unsupported Media Type');
  } else {
    await next();
  }
};

module.exports = checkExtension;
