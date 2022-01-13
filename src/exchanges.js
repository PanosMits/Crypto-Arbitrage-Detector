const Binance = require('./model/exchanges/binance/binance');
const Coinbase = require('./model/exchanges/coinbase/coinbase');
const Ftx = require('./model/exchanges/ftx/ftx');
const Gateio = require('./model/exchanges/gateio/gateio');
const Kucoin = require('./model/exchanges/kucoin/kucoin');

module.exports = [
    Binance,
    // Coinbase, // TODO: Add back after testing. Ignoring it for now cause it has only USD pairs, not USDT available
    Ftx, // See NOTE in bot.js
    Gateio,
    Kucoin,
];
