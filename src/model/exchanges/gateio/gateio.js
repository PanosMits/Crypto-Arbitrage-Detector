const ccxt = require('ccxt');
const Exchange = require('../exchange');

/**
 * A class that provides the client for interacting with the Gateio exchange
 * It also provides function for getting the
 * @class Gateio
 * @extends {Exchange}
 */
class Gateio extends Exchange {
    constructor(client) {
        super(client);
    }

    // TODO: Get from ccxt if present
    getTakerFees() {
        return 0.1;
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
        return 'USDT';
    }
}

module.exports = new Gateio(new ccxt.gateio({
    // 'apiKey': process.env.GATEIO_API_KEY,
    // 'secret': process.env.GATEIO_SECRET_KEY,
    'timeout': 30000,
    'enableRateLimit': true,
}));
