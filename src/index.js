const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
require('dotenv-defaults').config();
const errorHandler = require('./middlewares/errorHandler');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const logger = require('./helpers/logger');
const validatorMiddleware = require('./middlewares/validatorMiddleware');
const routes = require('./middlewares/routes/routes');

const app = new Koa();
app.use(loggerMiddleware);
app.use(bodyparser());
app.use(errorHandler());
app.use(validatorMiddleware);
app.use(routes());

app.listen(process.env.PORT, () => {
  logger.log({
    message: `Server running at port ${process.env.PORT}`,
    level: 'info'
  });
});
