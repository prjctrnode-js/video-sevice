const Router = require('@koa/router');
const pJson = require('../../../package.json');

const healthRoute = new Router();
healthRoute.get('/videos/health', async (ctx) => {
  ctx.set({ 'Content-Type': 'application/json' });
  ctx.body = JSON.stringify({
    success: true,
    message: `Name ${pJson.name}, version ${pJson.version}`
  });
});
module.exports = healthRoute;
