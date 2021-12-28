const axios = require('axios');
const logger = require('./logger');

const request = async (url, method, headers, params = {}, body = {}) => {
  try {
    const response = await axios({
      url,
      method,
      data: body,
      params,
      headers
    });
    return response;
  } catch (error) {
    logger.log({
      message: error.message,
      level: 'info'
    });
    return error.response;
  }
};

module.exports = request;
