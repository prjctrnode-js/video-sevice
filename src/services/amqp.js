const amqp = require('amqplib');
const logger = require('../helpers/logger');

const EXCHANGE_NAME = 'history';
const CONNECTION_URL = 'amqp://localhost';
let ch = null;

const connect = async () => {
  try {
    const connection = await amqp.connect(CONNECTION_URL);
    logger.log({
      message: 'rabbitmq connected',
      level: 'info'
    });
    const channel = await connection.createChannel();
    logger.log({
      message: 'rabbitmq channel opened',
      level: 'info'
    });
    await channel.assertExchange(EXCHANGE_NAME, 'direct');
    logger.log({
      message: 'rabbitmq exchange asserted',
      level: 'info'
    });
    ch = channel;
  } catch (error) {
    logger.log({
      message: error.message,
      level: 'info'
    });
  }
};

const publishToQueue = async (data, event) => {
  await ch.publish(EXCHANGE_NAME, event, Buffer.from(JSON.stringify(data)));
};
process.on('exit', () => {
  ch.close();
  logger.log({
    message: 'Closing rabbitmq channel',
    level: 'info'
  });
});

(async () => {
  await connect();
})();

module.exports = publishToQueue;
