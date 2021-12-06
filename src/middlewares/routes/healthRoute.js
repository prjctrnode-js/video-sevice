const Router = require('@koa/router');
const pJson = require('../../../package.json');
const router = new Router();

router.get('/videos/health', async (ctx) => {
  ctx.set({ 'Content-Type': 'application/json' });
  ctx.status = 200;
  ctx.body = JSON.stringify({
    succes: `Name ${pJson.name}, version ${pJson.version}`,
  });
});

module.exports = router;
