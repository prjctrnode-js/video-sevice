const { getExt } = require('../controllers/utils');
const allowedTypes = ['avi', 'mp4', 'mov'];

const checkExt = async (ctx, next) => {
  if (!allowedTypes.includes(getExt(ctx.headers['content-type']))) {
    ctx.set({ 'Content-Type': 'application/json' });
    ctx.status = 415;
    ctx.body = JSON.stringify({ error: 'Unsupported Media Type' });
    return;
  } else {
    await next();
  }
};

module.exports = checkExt;
