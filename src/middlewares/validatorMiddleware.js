const logger = require('../helpers/logger');
const shemas = require('../helpers/validationsShemas');

const validatorMiddleware = (validator, data) => async (ctx, next) => {
  try {
    if (!Object.prototype.hasOwnProperty.call(shemas, validator)) {
      throw new Error(`'${validator}' validator is not exist`);
    }
    await shemas[validator].validateAsync(data(ctx));
    await next();
  } catch (err) {
    logger.log({
      message: err,
      level: 'info'
    });
    ctx.status = 400;
    ctx.body = { success: false, error: err.message };
  }
};

module.exports = validatorMiddleware;
