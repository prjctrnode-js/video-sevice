const Joi = require('joi');
const logger = require('../helpers/logger');

const schema = Joi.object({
  id: Joi.number().integer().required(),
  userId: Joi.number().integer().required()
});

const validatorMiddleware = async (ctx, next) => {
  try {
    await schema.validateAsync({
      id: ctx.request.body.id,
      userId: ctx.request.query.userId
    });
    await next();
  } catch (err) {
    logger.log({
      message: err,
      level: 'info'
    });
    ctx.throw(400, { error: err });
  }
};

module.exports = validatorMiddleware;
