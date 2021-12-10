const combineRouters = require('koa-combine-routers');
const Router = require('@koa/router');
const videosHealth = require('../../controllers/videosHealth');
const checkExtension = require('../checkExtension');
const createVideo = require('../../controllers/createVideo');
const getVideo = require('../../controllers/getVideo');
const getUsersVideos = require('../../controllers/getUsersVideos');
const deleteVideo = require('../../controllers/deleteVideo');

const healthRoute = new Router();
const videosRoute = new Router();

healthRoute.get('/videos/health', videosHealth);
videosRoute.post('/videos', checkExtension, createVideo);
videosRoute.get('/videos/video', getVideo);
videosRoute.get('/videos', getUsersVideos);
videosRoute.delete('/videos', deleteVideo);

const router = combineRouters(healthRoute, videosRoute);

module.exports = router;
