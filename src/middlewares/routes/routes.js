const combineRouters = require('koa-combine-routers');
const healthRoute = require('./healthRoute');
const videosRoute = require('./videosRoute');

const router = combineRouters(healthRoute, videosRoute);

module.exports = router;
