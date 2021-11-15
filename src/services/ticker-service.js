const Binance = require('../model/exchanges/binance/binance');
const Coinbase = require('../model/exchanges/coinbase/coinbase');
const Ftx = require('../model/exchanges/ftx/ftx');
const Gateio = require('../model/exchanges/gateio/gateio');
const Kucoin = require('../model/exchanges/kucoin/kucoin');

/**
 * A class for getting ticker related information
 */
class TickerService {
    /**
     *  @param {Binance}
     */
    binance;

    /**
     *  @param {Coinbase}
     */
    coinbase;

    /**
     *  @param {Ftx}
     */
    ftx;

    /**
     *  @param {Gateio}
     */
    gateio;

    /**
     *  @param {Kucoin}
     */
    kucoin;

    /**
     * @param {Binance} binance The Binance client
     * @param {Coinbase} coinbase The Coinbase client
     * @param {Ftx} ftx The Ftx client
     * @param {Gateio} gateio The Gateio client
     * @param {Kucoin} kucoin The Kucoin client
     */
    constructor(binance, coinbase, ftx, gateio, kucoin) {
        this.binance = binance;
        this.coinbase = coinbase;
        this.ftx = ftx;
        this.gateio = gateio;
        this.kucoin = kucoin;
    }

    async getTickersForMarketByExchange(market) {
        if (market.endsWith('/USD') || market.endsWith('/USDT')) {
            const baseCurrency = market.substr(0, market.indexOf('/'));

            const [
                binanceTicker,
                coinbaseTicker,
                // ftxTicker, // See NOTE in bot.js
                gateioTicker,
                kucoinTicker
            ] = await Promise.all([
                this.binance.client.fetchTicker(baseCurrency + '/' + this.binance.getDollarEquivalentQuoteCurrency()),
                this.coinbase.client.fetchTicker(baseCurrency + '/' + this.coinbase.getDollarEquivalentQuoteCurrency()),
                // this.ftx.client.fetchTicker(baseCurrency + '/' + this.ftx.getDollarEquivalentQuoteCurrency()),
                this.gateio.client.fetchTicker(baseCurrency + '/' + this.gateio.getDollarEquivalentQuoteCurrency()),
                this.kucoin.client.fetchTicker(baseCurrency + '/' + this.kucoin.getDollarEquivalentQuoteCurrency()),
            ]);

            return {
                market,
                [this.binance.client.name]: binanceTicker.ask,
                [this.coinbase.client.name]: coinbaseTicker.ask,
                // [this.ftx.client.name]: ftxTicker.ask,
                [this.gateio.client.name]: gateioTicker.ask,
                [this.kucoin.client.name]: kucoinTicker.ask,
            }
        } else {
            const [
                binanceTicker,
                coinbaseTicker,
                // ftxTicker,
                gateioTicker,
                kucoinTicker
            ] = await Promise.all([
                this.binance.client.fetchTicker(market),
                this.coinbase.client.fetchTicker(market),
                // this.ftx.client.fetchTicker(market),
                this.gateio.client.fetchTicker(market),
                this.kucoin.client.fetchTicker(market),
            ]);

            return {
                market,
                [this.binance.client.name]: binanceTicker.ask,
                [this.coinbase.client.name]: coinbaseTicker.ask,
                // [this.ftx.client.name]: ftxTicker.ask,
                [this.gateio.client.name]: gateioTicker.ask,
                [this.kucoin.client.name]: kucoinTicker.ask,
            }
        }
    }
}

module.exports = new TickerService(Binance, Coinbase, Ftx, Gateio, Kucoin);
