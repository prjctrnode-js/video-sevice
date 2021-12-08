const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);
const allRoutes = {};
const compose = (middleware) => {
  if (!Array.isArray(middleware))
    throw new TypeError('Middleware stack must be an array!');
  for (const fn of middleware) {
    if (typeof fn !== 'function')
      throw new TypeError('Middleware must be composed of functions!');
  }

  return function (context, next) {
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index)
        return Promise.reject(new Error('next() called multiple times'));
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
};

const addRoutes = () => {
  fs.readdirSync(__dirname)
    .filter(
      (file) =>
        file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
    .forEach((file) => {
      const route = require(path.join(__dirname, file));
      allRoutes[file] = route;
    });
  const middleware = [];
  Object.keys(allRoutes).forEach((route) => {
    middleware.push(allRoutes[route].routes());
    middleware.push(allRoutes[route].allowedMethods());
  });
  return compose(middleware);
};

module.exports = addRoutes;
