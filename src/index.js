const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const router = require('./middlewares/routes/router');
require('dotenv-defaults').config();
const errorHandler = require('./middlewares/errorHandler');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const logger = require('./helpers/Logger');

const app = new Koa();
app.use(loggerMiddleware);
app.use(bodyparser());
app.use(errorHandler());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(process.env.PORT, () => {
  logger.log({
    message: `Server running at port ${process.env.PORT}`,
    level: process.env.NODE_ENV === 'dev' ? 'debug' : 'info',
  });
});
