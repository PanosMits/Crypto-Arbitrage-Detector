const ccxt = require('ccxt');
const Exchange = require('../exchange');

/**
 * A class that provides the client for interacting with the Kucoin exchange
 * It also provides function for getting the
 * @class Kucoin
 * @extends {Exchange}
 */
class Kucoin extends Exchange {
    constructor(client) {
        super(client);
    }

    // TODO: Get from ccxt if present
    // For Kucoin, fees can be reduced if holding Kucoin tokens in the portfolio
    getTakerFees() {
        return 0.1;
    }

    // // TODO
    // getWithdrawalFees() {
    //
    // }

    // TODO
    // getDepositFees() {
    //
    // }

    getDollarEquivalentQuoteCurrency() {
        return 'USDT';
    }
}

module.exports = new Kucoin(new ccxt.kucoin({
    // 'apiKey': process.env.KUCOIN_API_KEY,
    // 'secret': process.env.KUCOIN_SECRET_KEY,
    'timeout': 30000,
    'enableRateLimit': true,
}));
