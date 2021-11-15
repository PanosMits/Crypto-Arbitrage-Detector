require('dotenv').config();
const cron = require('node-cron');
const Bot = require('./bot/bot');

// cron.schedule('*/5 * * * * *', async () => {
//     await Bot.run();
//     console.log('****************************************************************************************************');
// });

// TEST ONLY
Bot.run();
