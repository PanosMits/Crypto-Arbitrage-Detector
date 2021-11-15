/**
 * NOTE: Kraken queries seem to be very slow. For example, kraken.fetchTicker() takes about 6sec to return a result.
 * NOTE: FTX uses both USD and USDT pairs. A crypto can be available for trading both against USD and USDT but some pairs
 *  are only available in one of the two. This might cause issues so we just ignore ftx for now although the exchange
 *  has been integrated, we just commend out the bits that call that exchange
 * NOTE: bid price is the price I can buy a crypto at.
 * NOTE: ask price is the price I sell buy a crypto at.
 * NOTE: the fees paid depend on whether you are a maker or a taker. Usually a maker pays lower fees than a taker.
 *  A maker adds liquidity to an exchange. A taker takes liquidity away from an exchange.
 *  A taker's order gets executed immediately, that means that all market orders get charged the taker fee.
 *  On the other hand, any orders in the limit or stop-limit markets get charged the maker fee since they provide liquidity to the order book.
 *  This bot's orders are going to be always charged the taker fees since we want to buy, transfer and sell immediately.
 * CONSIDERATION 1: at the moment when running the script the coinbase exchange always has the lowest bid and higher ask price.
 *  That means that buying and instantly selling back in Coinbase will generate profit(assume that there are no fees).
 *  That doesn't really make sense. A way to avoid showing arbitrage option within the same exchange would be removing the exchange
 *  from the object of exchanges after getting the lowest bid price.
 */

const MarketService = require('../services/market-service');
const TickerService = require('../services/ticker-service');

class Bot {
    /**
     *  @param {MarketService}
     */
    marketService;

    /**
     *  @param {TickerService}
     */
    tickerService;

    /**
     * @param {MarketService} marketService The MarketService
     * @param {TickerService} tickerService The TickerService
     */
    constructor(marketService, tickerService) {
        this.marketService = marketService;
        this.tickerService = tickerService;
    }

    async run() {
        console.time('Get Available Pairs Time');
        // const marketsAvailableInEveryExchange = await this.marketService.getMarketsAvailableInEveryExchange(); // TODO: Add back after testing
        const marketsAvailableInEveryExchange = ['BTC/USD', 'ETH/USD']; // TODO: Remove after testing
        console.log(marketsAvailableInEveryExchange);
        console.timeEnd('Get Available Pairs Time');

        console.time('Get Tickers Time');
        const tickerResults = await Promise.allSettled(marketsAvailableInEveryExchange.map((market) => {
            return this.tickerService.getTickersForMarketByExchange(market);
        }));
        console.log(tickerResults);
        console.timeEnd('Get Tickers Time');
    }

    // async run() {
    //     const coins = ['BTC', 'ETH', 'ADA'];
    //
    //     return Promise.all(coins.map(async (coin) => {
    //         let exchanges = [];
    //
    //         const [binanceResult, coinbaseResult, huobiResult, kucoinResult] = await Promise.all([
    //             this.binance.fetchTicker(`${coin}/USDT`),
    //             this.coinbase.fetchTicker(`${coin}/USD`),
    //             huobi.fetchTicker(`${coin}/USDT`),
    //             kucoin.fetchTicker(`${coin}/USDT`),
    //         ]);
    //
    //         exchanges = [...exchanges,
    //             { exchange: this.binance, bid: binanceResult.bid, ask: binanceResult.ask },
    //             { exchange: this.coinbase, bid: coinbaseResult.bid, ask: coinbaseResult.ask },
    //             { exchange: huobi, bid: huobiResult.bid, ask: huobiResult.ask },
    //             { exchange: kucoin, bid: kucoinResult.bid, ask: kucoinResult.ask },
    //         ];
    //
    //         const bidPrices = exchanges.map((pair) => pair.bid);
    //         const lowestBidPrice = Math.min(...bidPrices);
    //         const lowestBidPriceExchange = exchanges.filter((exchange) => exchange.bid === lowestBidPrice)[0];
    //
    //         const filteredExchanges = exchanges.filter((exchange) => exchange.exchange !== lowestBidPriceExchange.exchange); // see CONSIDERATIONS 1
    //
    //         const askPrices = filteredExchanges.map((pair) => pair.ask);
    //         const highestAskPrice = Math.max(...askPrices);
    //         const highestBidPriceExchange = filteredExchanges.filter((exchange) => exchange.ask === highestAskPrice)[0];
    //
    //         const percentageDifferenceBetweenHighestAndLowest = ((1 - (lowestBidPrice / highestAskPrice)) * 100).toFixed(2);
    //
    //         console.log('Coin: ', coin);
    //         console.log(`Buy ${coin} from ${lowestBidPriceExchange.exchange.name} for: `, lowestBidPrice);
    //         console.log(`Sell ${coin} at ${highestBidPriceExchange.exchange.name} for: `, highestAskPrice);
    //         console.log('Percentage difference:', percentageDifferenceBetweenHighestAndLowest, '%');
    //         console.log('========================================================================');
    //
    //         return '';
    //     }));
    // }
}

module.exports = new Bot(MarketService, TickerService);
