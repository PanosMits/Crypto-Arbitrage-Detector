const ccxt = require('ccxt');
const Exchange = require('../exchange');

/**
 * A class that provides the client for interacting with the FTX exchange
 * It also provides function for getting the
 * @class Ftx
 * @extends {Exchange}
 */
class Ftx extends Exchange {
    constructor(client) {
        super(client);
    }

    // TODO: Get from ccxt if present
    // For FTX, fees can be reduced if holding FTX tokens in the portfolio
    getTakerFees() {
        return 0.07;
    }

    // TODO
    // getWithdrawalFees() {
    //
    // }

    // TODO
    // getDepositFees() {
    //  // Binance does not charge deposit fees.
    // }

    // FTX actually has both USD and USDT trading available for each crypto
    getDollarEquivalentQuoteCurrency() {
        return 'USDT';
    }
}

module.exports = new Ftx(new ccxt.ftx({
    // 'apiKey': process.env.FTX_API_KEY,
    // 'secret': process.env.FTX_SECRET_KEY,
    'timeout': 30000,
    'enableRateLimit': true,
}));
