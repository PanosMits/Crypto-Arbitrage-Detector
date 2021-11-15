const Binance = require('../model/exchanges/binance/binance');
const Coinbase = require('../model/exchanges/coinbase/coinbase');
const Ftx = require('../model/exchanges/ftx/ftx');
const Gateio = require('../model/exchanges/gateio/gateio');
const Kucoin = require('../model/exchanges/kucoin/kucoin');

/**
 * A class for getting market related information
 */
class MarketService {
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

    /**
     * Returns only the pairs that are available in all of the provided exchanges
     * NOTE: In some exchanges we can perform only crypto/crypto trades. This means that a
     *  pair for example BTC/USD that is available in an exchange, in a different exchange might
     *  be available as BTC/USDT.
     */
    async getMarketsAvailableInEveryExchange() {
        const [
            binanceMarkets,
            coinbaseMarkets,
            // ftxMarkets,
            gateioMarkets,
            kucoinMarkets,
        ] = await Promise.all([
            this.binance.client.fetchMarkets(),
            this.coinbase.client.fetchMarkets(),
            // this.ftx.client.fetchMarkets(),
            this.gateio.client.fetchMarkets(),
            this.kucoin.client.fetchMarkets(),
        ]);
        const binanceMarketsSymbols = binanceMarkets.map((market) => market.symbol);
        const coinbaseMarketsSymbols = coinbaseMarkets.map((market) => market.symbol);
        // const ftxMarketsSymbols = ftxMarkets.map((market) => market.symbol);
        const gateioMarketsSymbols = gateioMarkets.map((market) => market.symbol);
        const kucoinMarketsSymbols = kucoinMarkets.map((market) => market.symbol);

        // Get the exchange with the most markets and compare each market in it against the other exchanges
        // if a market is available in all of the exchanges then return it.
        const mostMarketsExchangeSortedDesc = [
            binanceMarketsSymbols,
            coinbaseMarketsSymbols,
            // ftxMarketsSymbols,
            gateioMarketsSymbols,
            kucoinMarketsSymbols
        ].sort((a, b) => b.length - a.length);
        const symbolsListFromExchangeWithMostMarkets = mostMarketsExchangeSortedDesc[0];

        return symbolsListFromExchangeWithMostMarkets.filter((market) => {
            // To simplify things, I assume USD and USDT are the same - see NOTE
            if(market.endsWith('/USD') || market.endsWith('/USDT')) {
                const baseCurrency = market.substr(0, market.indexOf('/'));
                const alternativeQuoteCurrency = 'USDT';
                const alternativeMarket = baseCurrency + '/' + alternativeQuoteCurrency;

                const binanceHasMarket = (binanceMarketsSymbols.filter((marketForSearch) => marketForSearch === market || marketForSearch === alternativeMarket)).length > 0;
                const coinbaseHasMarket = (coinbaseMarketsSymbols.filter((marketForSearch) => marketForSearch === market || marketForSearch === alternativeMarket)).length > 0;
                // const ftxHasMarket = (ftxMarketsSymbols.filter((marketForSearch) => marketForSearch === market || marketForSearch === alternativeMarket)).length > 0;
                const gateioHasMarket = (gateioMarketsSymbols.filter((marketForSearch) => marketForSearch === market || marketForSearch === alternativeMarket)).length > 0;
                const kucoinHasMarket = (kucoinMarketsSymbols.filter((marketForSearch) => marketForSearch === market || marketForSearch === alternativeMarket)).length > 0;

                return binanceHasMarket &&
                    coinbaseHasMarket &&
                    // ftxHasMarket &&
                    gateioHasMarket &&
                    kucoinHasMarket;
            }

            return binanceMarketsSymbols.includes(market) &&
                coinbaseMarketsSymbols.includes(market)&&
                // ftxMarketsSymbols.includes(market) &&
                gateioMarketsSymbols.includes(market) &&
                kucoinMarketsSymbols.includes(market);
        });
    }

    // TODO: A more advanced version of getMarketsPresentInEveryExchange()
    //  It's obvious that a market might be available in only 2 or 3 or 4 exchanges and not all of them.
    //  getMarketsPresentInEveryExchange() returns only the markets available in every exchange meaning that
    //  if a market is available in Binance and Kucoin but not in Coinbase it won't be in the results.
    //  getMarketsPresentInAtLeastTwoExchanges() Should return each market along with the exchanges it is available on.
    // async getMarketsPresentInAtLeastTwoExchanges() {
    //
    // }
}

module.exports = new MarketService(Binance, Coinbase, Ftx, Gateio, Kucoin);
