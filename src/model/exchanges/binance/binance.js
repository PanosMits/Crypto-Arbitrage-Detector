const ccxt = require('ccxt');
const Exchange = require('../exchange');

/**
 * A class that provides the client for interacting with the Binance exchange
 * It also provides function for getting the
 * @class Binance
 * @extends {Exchange}
 */
class Binance extends Exchange {
    constructor(client) {
        super(client);
    }

    // For Binance, fees can be reduced if holding BNB coins in the portfolio
    getTakerFees() {
        return this.client.fees.trading.taker * 100; // According to the ccxt docs: 0.0015 = 0.15%.
    }

    // TODO
    // getWithdrawalFees() {
    //     For each withdrawal, a flat fee is paid by users to cover the transaction costs of moving the cryptocurrency out of their Binance account.
    //     Withdrawals rates are determined by the blockchain network and can fluctuate without notice due to factors such as network congestion.
    //     Please check the most recent data listed on each withdrawal page.
    //     NOTE: There is a different fee for each coin withdrawal
    //     More details: https://www.binance.com/en/fee/cryptoFee
    //     TODO: Contact them to ask if there is an endpoint in their API for getting these fees s
    // }

    // TODO
    // getDepositFees() {
    //  // Binance does not charge deposit fees.
    // }

    getDollarEquivalentQuoteCurrency() {
        return 'USDT';
    }
}

module.exports = new Binance(new ccxt.binance({
    // 'apiKey': process.env.BINANCE_API_KEY,
    // 'secret': process.env.BINANCE_SECRET_KEY,
    'timeout': 30000,
    'enableRateLimit': true,
}));
