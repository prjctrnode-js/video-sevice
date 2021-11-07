const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const router = require('./middlewares/routes/router');

const port = 3000;
const app = new Koa();

app.use(bodyparser());

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
