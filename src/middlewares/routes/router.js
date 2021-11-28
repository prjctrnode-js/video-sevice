const Router = require('@koa/router');
const fs = require('fs');
const router = new Router();
const uploadVideo = require('../../controllers/uploadVideo');
const checkExtension = require('../checkExtension');
const pJson = require('../../../package.json');
const db = require('../../db/models');

router.post('/video', checkExtension, async (ctx) => {
  const { status, message, fileName } = await uploadVideo(ctx);
  const userId = ctx.request.query.userId;
  const data = await db.videos.create({
    fileName: fileName,
    userId: userId,
  });
  ctx.set({ 'Content-Type': 'application/json' });
  ctx.status = status;
  ctx.body = JSON.stringify({ success: true, message: message, data: data });
});

router.delete('/video', async (ctx) => {
  const { fileName } = await db.videos.findOne({
    where: {
      id: ctx.request.query.id,
    },
  });
  fs.unlinkSync(`output/${fileName}`, (error) => {
    if (error) return console.log(error);
    logger.log({
      message: `file deleted successfully`,
      level: 'info',
    });
    return false;
  });
  await db.videos.destroy({
    where: {
      id: ctx.request.query.id,
    },
  }),
    (ctx.body = {
      success: true,
      message: 'file deleted successfully',
    });
});

router.get('/video', async (ctx) => {
  ctx.body = {
    success: true,
    message: 'Success',
    data: await db.videos.findAll({
      where: {
        userId: ctx.request.query.userId,
      },
    }),
  };
});

router.get('/video/health', async (ctx) => {
  ctx.set({ 'Content-Type': 'application/json' });
  ctx.status = 200;
  ctx.body = JSON.stringify({
    succes: `Name ${pJson.name}, version ${pJson.version}`,
  });
});

module.exports = router;
