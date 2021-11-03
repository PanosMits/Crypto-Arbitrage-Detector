require('dotenv').config();
const cron = require('node-cron');
const Bot = require('./bot/bot');

cron.schedule('*/10 * * * * *', async () => {
    await Bot.run();
});
