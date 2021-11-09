const Router = require('@koa/router');
const router = new Router();
const uploadVideo = require('../../controllers/uploadVideo');
const getVideo = require('../../controllers/getVideo');
const checkExtension = require('../checkExtension');
const fs = require('fs');

router.post('/upload', checkExtension, async (ctx) => {
  try {
    const { status, message } = await uploadVideo(ctx);
    ctx.set({ 'Content-Type': 'application/json' });
    ctx.status = status;
    ctx.body = JSON.stringify(message);
  } catch (error) {
    const { status, message } = error;
    ctx.throw(status, JSON.stringify(message));
  }
});

router.get('/video', async (ctx) => {
  await getVideo(ctx);
});

module.exports = router;
