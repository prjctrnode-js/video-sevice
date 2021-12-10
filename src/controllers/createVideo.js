const db = require('../db/models');
const uploadVideo = require('./uploadVideo');

const createVideo = async (ctx) => {
  const { status, message, fileName } = await uploadVideo(ctx);
  const { userId } = ctx.request.query;
  const data = await db.Videos.create({
    fileName,
    userId
  });
  ctx.set({ 'Content-Type': 'application/json' });
  ctx.status = status;
  ctx.body = JSON.stringify({ success: true, message, data });
};

module.exports = createVideo;
