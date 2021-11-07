const Koa = require('koa');
const Router = require('@koa/router');
const bodyparser = require('koa-bodyparser');
const converter = require('./converter');
const createStream = require('./createStream');
const checkExt = require('./midlewares/checkExt');

const port = 3000;
const app = new Koa();
const router = new Router();

app.use(bodyparser());
app.use(checkExt);

router.post('/upload', async (ctx) => {
  await createStream(ctx);
  await converter(ctx);
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
