const Router = require('@koa/router');
const fs = require('fs');
const router = new Router();
const uploadVideo = require('../../controllers/uploadVideo');
const getVideo = require('../../controllers/getVideo');
const checkExtension = require('../checkExtension');
const pJson = require('../../../package.json');
const db = require('../../db/models');

router.post('/videos', checkExtension, async (ctx) => {
  const { status, message, fileName } = await uploadVideo(ctx);
  const userId = ctx.request.query.userId;
  const data = await db.Videos.create({
    fileName: fileName,
    userId: userId,
  });
  ctx.set({ 'Content-Type': 'application/json' });
  ctx.status = status;
  ctx.body = JSON.stringify({ success: true, message: message, data: data });
});

router.delete('/videos', async (ctx) => {
  const { fileName } = await db.Videos.findOne({
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
  await db.Videos.destroy({
    where: {
      id: ctx.request.query.id,
    },
  }),
    (ctx.body = {
      success: true,
      message: 'file deleted successfully',
    });
});

router.get('/videos', async (ctx) => {
  const userId = ctx.request.query.id;
  const limit = ctx.request.query.limit;
  const res = {
    success: true,
    message: 'Success',
    data: await db.Videos.findAll({
      where: {
        userId,
      },
      limit,
    }),
  };
  ctx.body = res;
});

router.get('/videos/video', async (ctx) => {
  await getVideo(ctx);
});

module.exports = router;
