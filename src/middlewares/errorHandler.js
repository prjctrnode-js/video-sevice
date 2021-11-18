module.exports = () => async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.status = error.statusCode || 500;
    ctx.body = {
      error: error.message,
    };
  }
};
