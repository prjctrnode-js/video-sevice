const Router = require('@koa/router');
const checkExtension = require('../checkExtension');
const uploadVideo = require('../../controllers/uploadVideo');
const getVideo = require('../../controllers/getVideo');
const getUsersVideos = require('../../controllers/getUsersVideos');
const deleteVideo = require('../../controllers/deleteVideo');
const validatorMiddleware = require('../validatorMiddleware');
const db = require('../../db/models');
const isAuth = require('../isAuth');

const videosRoute = new Router();
videosRoute.post(
  '/videos',
  isAuth,
  checkExtension,
  validatorMiddleware('videoUserId', (ctx) => ({
    userId: ctx.user.id
  })),
  async (ctx) => {
    const { status, message, fileName } = await uploadVideo(ctx);
    const userId = ctx.user.id;
    const data = await db.Videos.create({
      fileName,
      userId
    });
    ctx.set({ 'Content-Type': 'application/json' });
    ctx.status = status;
    ctx.body = JSON.stringify({ success: true, message, data });
  }
);
videosRoute.get('/videos/:id', getVideo);
videosRoute.get(
  '/videos',
  isAuth,
  validatorMiddleware('videoUserId', (ctx) => ({
    userId: ctx.request.query.userId
  })),
  async (ctx) => {
    const { userId } = ctx.request.query;
    const { limit } = ctx.request.query;
    const { status, body } = await getUsersVideos(userId, limit);
    ctx.status = status;
    ctx.body = body;
  }
);
videosRoute.delete(
  '/videos/:id',
  isAuth,
  validatorMiddleware('videoId', (ctx) => ({
    id: ctx.params.id
  })),
  async (ctx) => {
    const { id } = ctx.params;
    const { status, body } = await deleteVideo(id);
    ctx.status = status;
    ctx.body = body;
  }
);
module.exports = videosRoute;
