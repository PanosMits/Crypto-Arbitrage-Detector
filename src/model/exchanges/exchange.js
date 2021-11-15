/**
 * Abstract Class Exchange.
 * Every model class that represents an exchange should extend this class.
 * The reason this class exists is for enforcing the exchange classes that extend it to implement
 *  the following functions: getTakerFees, getTransferFees, getWithdrawalFees, getDepositFees.
 *  These functions need to be implemented by me since ccxt clients do not provide the relevant information
 *  at the time of writing.
 * @class Exchange
 * @abstract
 */
class Exchange {
    /**
     * This field holds the exchange client and is a field that needs to be overridden by the sub-classes
     */
    client;

    constructor(client = undefined) {
        if (new.target === Exchange) throw new TypeError('Abstract Exchange class can not be instantiated.');
        this.client = client;
    }

    /**
     * A function that returns the taker fees for the exchangeClient
     */
    getTakerFees() {
        throw new Error('Method getTakerFees must be implemented.');
    }

    /**
     * A function that returns the withdrawal fees for the exchangeClient
     */
    getWithdrawalFees() {
        throw new Error('Method getWithdrawalFees must be implemented.');
    }

    /**
     * A function that returns the deposit fees for the exchangeClient
     */
    getDepositFees() {
        throw new Error('Method getDepositFees must be implemented.');
    }

    /**
     * A function that returns the dollar equivalent for trading
     * Some exchanges allow to trade only crypto against crypto, meaning we cannot trade crypto
     *  against fiat currency. Need a way to know what is the equivalent to dollar, quote currency
     *  that each exchange allows us to trade.
     */
    getDollarEquivalentQuoteCurrency() {
        throw new Error('Method getDollarEquivalentQuoteCurrency must be implemented.');
    }
}

module.exports = Exchange;
