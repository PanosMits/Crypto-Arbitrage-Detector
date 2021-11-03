const ccxt = require('ccxt');

/**
 * A singleton class for a Binance Client
 */
class BinanceClient {
    constructor() {
        if (!BinanceClient.instance) {
            BinanceClient.instance = new ccxt.binance({
                'apiKey': process.env.BINANCE_API_KEY,
                'secret': process.env.BINANCE_SECRET_KEY,
                'timeout': 30000,
                'enableRateLimit': true,
            });
        }
    }

    getInstance() {
        return BinanceClient.instance;
    }
}

module.exports = new BinanceClient;
