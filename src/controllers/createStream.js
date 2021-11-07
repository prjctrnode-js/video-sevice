const fs = require('fs');
const { getExt } = require('./utils');

const createStream = async (ctx) =>
  new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(
      `temp/temp.${getExt(ctx.headers['content-type'])}`
    );
    ctx.req.pipe(writeStream);
    ctx.req.on('end', async () => {
      resolve();
    });
    writeStream.on('error', (err) => {
      ctx.set({ 'Content-Type': 'application/json' });
      ctx.status = 422;
      ctx.body = JSON.stringify({ error: `An error occurred: ${err}` });
      reject();
    });
  });

module.exports = createStream;
