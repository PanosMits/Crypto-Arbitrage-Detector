const exchanges = require('../exchanges');

/**
 * A class for getting market related information
 */
class MarketService {
    /**
     *  @param {array}
     */
    exchangesList;

    /**
     * @param {array} exchangesList A list containing all the exchange we want the markets for
     */
    constructor(exchangesList) {
        this.exchangesList = exchangesList;
    }

    // TODO: async getMarketSymbolsByExchange(exchange) {}

    /**
     * A function for getting the dollar markets from the exchange provided
     * @param {Exchange} exchange The exchange to get the dollar markets for
     * @returns {Promise<{exchange: Exchange, symbols: []}>} A promise containing an array of markets in the format
     *  of ['BTC/USD', 'ETH/USD', ...] along with the exchange those markets are available on
     */
    async getDollarMarketSymbolsByExchange(exchange) {
        const markets = await exchange.client.fetchMarkets();
        const filteredMarkets = markets.filter((market) => market.symbol.endsWith('USDT'));
        const symbols = filteredMarkets.map((market) => market.symbol);
        return { exchange, symbols };

        // TODO: For more precision -> After integrating Coinbase which has only crypto/fiat pairs
        // return markets.filter((market) =>  {
        //     return market.symbol === endsWith('USDT') ||
        //         market.symbol === endsWith('USDC') ||
        //         market.symbol === endsWith('USD';)
        // });
    }

    // TODO
    // async getMarketsAvailableInEveryExchange() {
    //
    //     const [
    //         binanceMarkets,
    //         coinbaseMarkets,
    //         ftxMarkets,
    //         gateioMarkets,
    //         kucoinMarkets,
    //     ] = await Promise.all([
    //         this.binance.client.fetchMarkets(),
    //         this.coinbase.client.fetchMarkets(),
    //         this.ftx.client.fetchMarkets(),
    //         this.gateio.client.fetchMarkets(),
    //         this.kucoin.client.fetchMarkets(),
    //     ]);
    //     const binanceMarketsSymbols = binanceMarkets.map((market) => market.symbol);
    //     const coinbaseMarketsSymbols = coinbaseMarkets.map((market) => market.symbol);
    //     const ftxMarketsSymbols = ftxMarkets.map((market) => market.symbol);
    //     const gateioMarketsSymbols = gateioMarkets.map((market) => market.symbol);
    //     const kucoinMarketsSymbols = kucoinMarkets.map((market) => market.symbol);
    //
    //     // Get the exchange with the most markets and compare each market in it against the other exchanges
    //     // if a market is available in all of the exchanges then return it.
    //     const mostMarketsExchangeSortedDesc = [
    //         binanceMarketsSymbols,
    //         coinbaseMarketsSymbols,
    //         // ftxMarketsSymbols,
    //         gateioMarketsSymbols,
    //         kucoinMarketsSymbols
    //     ].sort((a, b) => b.length - a.length);
    //     const symbolsListFromExchangeWithMostMarkets = mostMarketsExchangeSortedDesc[0];
    //
    //     return symbolsListFromExchangeWithMostMarkets.filter((market) => {
    //         // To simplify things, I assume USD and USDT are the same - see NOTE
    //         if(market.endsWith('/USD') || market.endsWith('/USDT')) {
    //             const baseCurrency = market.substr(0, market.indexOf('/'));
    //             const alternativeQuoteCurrency = 'USDT';
    //             const alternativeMarket = baseCurrency + '/' + alternativeQuoteCurrency;
    //
    //             const binanceHasMarket = (binanceMarketsSymbols.filter((marketForSearch) => marketForSearch === market || marketForSearch === alternativeMarket)).length > 0;
    //             const coinbaseHasMarket = (coinbaseMarketsSymbols.filter((marketForSearch) => marketForSearch === market || marketForSearch === alternativeMarket)).length > 0;
    //             // const ftxHasMarket = (ftxMarketsSymbols.filter((marketForSearch) => marketForSearch === market || marketForSearch === alternativeMarket)).length > 0;
    //             const gateioHasMarket = (gateioMarketsSymbols.filter((marketForSearch) => marketForSearch === market || marketForSearch === alternativeMarket)).length > 0;
    //             const kucoinHasMarket = (kucoinMarketsSymbols.filter((marketForSearch) => marketForSearch === market || marketForSearch === alternativeMarket)).length > 0;
    //
    //             return binanceHasMarket &&
    //                 coinbaseHasMarket &&
    //                 // ftxHasMarket &&
    //                 gateioHasMarket &&
    //                 kucoinHasMarket;
    //         }
    //
    //         return binanceMarketsSymbols.includes(market) &&
    //             coinbaseMarketsSymbols.includes(market)&&
    //             // ftxMarketsSymbols.includes(market) &&
    //             gateioMarketsSymbols.includes(market) &&
    //             kucoinMarketsSymbols.includes(market);
    //     });
    // }

    /**
     * Returns only the pairs that are available in all of the provided exchanges
     * NOTE: In some exchanges we can perform only crypto/crypto trades. This means that a
     *  pair for example BTC/USD that is available in an exchange, in a different exchange might
     *  be available as BTC/USDT.
     */
    async getDollarMarketsAvailableInEveryExchange() {
        const dollarMarketSymbolsByExchange = await Promise.all(this.exchangesList.map((exchange) => this.getDollarMarketSymbolsByExchange(exchange)));
        const symbols = dollarMarketSymbolsByExchange.map((symbolsByExchange) => symbolsByExchange.symbols);
        const symbolsFlatted = symbols.flat();
        const symbolsFlattedDistinct = Array.from(new Set(symbolsFlatted));
        return symbolsFlattedDistinct.filter((symbolA) => {
            const symbolOccurrences = symbolsFlatted.filter((symbolB) => symbolA === symbolB);
            // If a symbol occurs as many times as the provided exchanges in the list, it means that it is available in all of the provided exchanges
            return symbolOccurrences.length === this.exchangesList.length;
        });
    }

    // TODO: A more advanced version of getMarketsPresentInEveryExchange()
    //  It's obvious that a market might be available in only 2 or 3 or 4 exchanges and not all of them.
    //  getMarketsPresentInEveryExchange() returns only the markets available in every exchange meaning that
    //  if a market is available in Binance and Kucoin but not in Coinbase it won't be in the results.
    //  getMarketsPresentInAtLeastTwoExchanges() Should return each market along with the exchanges it is available on.
    // async getMarketsPresentInAtLeastTwoExchanges() {}
}

module.exports = new MarketService(exchanges);
