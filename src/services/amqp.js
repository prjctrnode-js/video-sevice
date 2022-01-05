const amqp = require('amqplib');

const EXCHANGE_NAME = 'history';
class AMQP {
  async connect() {
    const connection = await amqp.connect('amqp://localhost');
    console.log('rabbit connected');

    const channel = await connection.createChannel();
    console.log('channel opened');

    await channel.assertExchange((EXCHANGE_NAME, 'direct'));

    await channel.assertQueue('hist', {
      durable: false
    });

    this.channel = channel;
  }

  async publish(data, event) {
    const isOk = await this.channel.publish(
      EXCHANGE_NAME,
      event,
      Buffer.from(JSON.stringify(data))
    );
  }
}

let amqpInstance;

(async () => {
  amqpInstance = new AMQP();
  await amqpInstance.connect();
})();

module.exports = amqpInstance;
