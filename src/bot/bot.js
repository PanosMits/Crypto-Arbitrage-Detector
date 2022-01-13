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

const chalk = require('chalk');

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
        const marketsAvailableInEveryExchange = await this.marketService.getDollarMarketsAvailableInEveryExchange();
        const tickerResults = await Promise.all(marketsAvailableInEveryExchange.map((market) => {
            return this.tickerService.getTickersForMarketByExchange(market);
        }));

        const arbitrageResults = tickerResults.map(ticker => {
            const lowestBidPrice = Math.min(...ticker.map((pair) => pair.bid));
            const lowestBidPriceExchange = ticker.filter((tickerData) => tickerData.bid === lowestBidPrice)[0];

            // see CONSIDERATIONS 1 on why filtering out the exchange with the lowest bid price just before searching for the exchange with the highest ask price
            const filteredTicker = ticker.filter((tickerData) => tickerData.exchange !== lowestBidPriceExchange.exchange);
            const highestAskPrice = Math.max(...filteredTicker.map((ticker) => ticker.ask));
            const highestBidPriceExchange = filteredTicker.filter((ticker) => ticker.ask === highestAskPrice)[0];

            const percentageDifferenceBetweenHighestAndLowest = ((1 - (lowestBidPrice / highestAskPrice)) * 100).toFixed(2);

            // console.log(`${chalk.green(ticker[0].market)}`);
            // console.log(`Buy from ${ lowestBidPriceExchange.exchange.client.name } for: ${ chalk.yellow(lowestBidPrice) }`);
            // console.log(`Sell at ${ highestBidPriceExchange.exchange.client.name } for: ${ chalk.yellow(highestAskPrice) }`);
            // console.log(`Percentage Difference: ${chalk.yellow(percentageDifferenceBetweenHighestAndLowest + '%')}`);
            // console.log('');
            // console.log('=============================================');
            // console.log('');

            return {
                market: ticker[0].market,
                buyFrom: lowestBidPriceExchange.exchange,
                sellTo: highestBidPriceExchange.exchange,
                percentageDifference: percentageDifferenceBetweenHighestAndLowest,
            }
        });

        console.log(arbitrageResults);
    }
}

module.exports = new Bot(MarketService, TickerService);
