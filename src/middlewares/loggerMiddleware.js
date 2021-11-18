const logger = require('../helpers/Logger');

const loggerMiddleware = async (ctx, next) => {
  logger.log({
    message: `-->${ctx.request.method} ${ctx.request.url}`,
    level: process.env.NODE_ENV === 'dev' ? 'debug' : 'info',
  });
  await next();
  logger.log({
    message: `<--${ctx.request.method} ${ctx.request.url} ${ctx.response.status}`,
    level: process.env.NODE_ENV === 'dev' ? 'debug' : 'info',
  });
};

module.exports = loggerMiddleware;
