const request = require('../helpers/request');

const isAuth = async (ctx, next) => {
  const userToken = ctx.headers['x-token'];
  const gatewayToken = ctx.header['g-token'];
  if (userToken) {
    const response = await request(
      `http://${process.env.GATEWAY_HOST}:${process.env.GATEWAY_PORT}/${process.env.GATEWAY_USERS_PATH}`,
      'GET',
      { 'x-token': userToken }
    );
    if (response.data.success) {
      ctx.user = response.data.data;
      return next();
    }
    ctx.status = response.status;
    ctx.body = response.data;
    return false;
  }
  if (gatewayToken && gatewayToken === process.env.GATEWAY_TOKEN) {
    return next();
  }
  const error = { statusCode: 401, message: 'missing token' };
  throw error;
};

module.exports = isAuth;
