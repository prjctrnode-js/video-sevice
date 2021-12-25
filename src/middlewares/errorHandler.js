module.exports = () => async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.status = error.statusCode || 500;
    ctx.body = {
      success: false,
      error: error.message
    };
  }
};
