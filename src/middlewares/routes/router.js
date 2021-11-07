const Router = require('@koa/router');
const router = new Router();
const converter = require('../../controllers/converter');
const createStream = require('../../controllers/createStream');
const checkExt = require('../../middlewares/checkExt');

router.post('/upload', checkExt, async (ctx) => {
  await createStream(ctx);
  await converter(ctx);
});

module.exports = router;
