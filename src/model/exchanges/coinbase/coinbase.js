const ccxt = require('ccxt');
const Exchange = require('../exchange');

/**
 * A class that provides the client for interacting with the Binance exchange
 * It also provides function for getting the
 * @class Coinbase
 * @extends {Exchange}
 */
class Coinbase extends Exchange {
    constructor(client) {
        super(client);
    }

    getTakerFees() {
        return 0.5;
    }

    // TODO
    // getWithdrawalFees() {
    //
    // }

    // TODO
    // getDepositFees() {
    //
    // }

    getDollarEquivalentQuoteCurrency() {
        return 'USD';
    }
}

module.exports = new Coinbase(new ccxt.coinbase({
    // 'apiKey': process.env.COINBASE_API_KEY,
    // 'secret': process.env.COINBASE_SECRET_KEY,
    'timeout': 30000,
    'enableRateLimit': true,
}));
