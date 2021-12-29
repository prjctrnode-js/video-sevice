const logger = require('../helpers/logger');

const loggerMiddleware = async (ctx, next) => {
  logger.log({
    message: `-->${ctx.request.method} ${ctx.request.url}`,
    level: 'info'
  });
  await next();
  logger.log({
    message: `<--${ctx.request.method} ${ctx.request.url} ${ctx.response.status}`,
    level: 'info'
  });
};

module.exports = loggerMiddleware;
