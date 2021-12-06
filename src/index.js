const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
require('dotenv-defaults').config();
const errorHandler = require('./middlewares/errorHandler');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const logger = require('./helpers/logger');
const addRoutes = require('./middlewares/routes');

const app = new Koa();
app.use(loggerMiddleware);
app.use(bodyparser());
app.use(errorHandler());
app.use(addRoutes());

app.listen(process.env.PORT, () => {
  logger.log({
    message: `Server running at port ${process.env.PORT}`,
    level: 'info',
  });
});
