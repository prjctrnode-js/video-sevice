const Joi = require('joi');

const videoUserId = Joi.object({
  userId: Joi.number().integer().required()
});
const videoId = Joi.object({
  id: Joi.number().integer().required()
});

module.exports = {
  videoUserId,
  videoId
};
