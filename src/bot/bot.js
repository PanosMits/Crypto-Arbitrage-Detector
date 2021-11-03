const ccxt = require('ccxt');

/**
 * NOTE: Kraken queries seem to be very slow. For example, kraken.fetchTicker() takes about 6sec to return a result.
 * NOTE: bid price is the price I can buy a crypto at.
 * NOTE: ask price is the price I sell buy a crypto at.
 * CONSIDERATION 1: at the moment when running the script the coinbase exchange always has the lowest bid and higher ask price.
 *  That means that buying and instantly selling back in Coinbase will generate profit(assume that there are no fees).
 *  That doesn't really make sense. A way to avoid showing arbitrage option within the same exchange would be removing the exchange
 *  from the object of exchanges after getting the lowest bid price.
 */

const binance = new ccxt.binance();
const coinbase = new ccxt.coinbase();
const huobi = new ccxt.huobi();
const kucoin = new ccxt.kucoin();

class Bot {
    constructor() {}

    async run() {
        const coins = ['BTC', 'ETH', 'ADA'];

        return Promise.all(coins.map(async (coin) => {
            let exchanges = [];

            const [binanceResult, coinbaseResult, huobiResult, kucoinResult] = await Promise.all([
                binance.fetchTicker(`${coin}/USDT`),
                coinbase.fetchTicker(`${coin}/USD`),
                huobi.fetchTicker(`${coin}/USDT`),
                kucoin.fetchTicker(`${coin}/USDT`),
            ]);

            exchanges = [...exchanges,
                { exchange: binance, bid: binanceResult.bid, ask: binanceResult.ask },
                { exchange: coinbase, bid: coinbaseResult.bid, ask: coinbaseResult.ask },
                { exchange: huobi, bid: huobiResult.bid, ask: huobiResult.ask },
                { exchange: kucoin, bid: kucoinResult.bid, ask: kucoinResult.ask },
            ];

            const bidPrices = exchanges.map((pair) => pair.bid);
            const lowestBidPrice = Math.min(...bidPrices);
            const lowestBidPriceExchange = exchanges.filter((exchange) => exchange.bid === lowestBidPrice)[0];

            const filteredExchanges = exchanges.filter((exchange) => exchange.exchange !== lowestBidPriceExchange.exchange); // see CONSIDERATIONS 1

            const askPrices = filteredExchanges.map((pair) => pair.ask);
            const highestAskPrice = Math.max(...askPrices);
            const highestBidPriceExchange = filteredExchanges.filter((exchange) => exchange.ask === highestAskPrice)[0];

            const percentageDifferenceBetweenHighestAndLowest = ((1 - (lowestBidPrice / highestAskPrice)) * 100).toFixed(2);

            console.log('Coin: ', coin);
            console.log(`Buy ${coin} from ${lowestBidPriceExchange.exchange.name} for: `, lowestBidPrice);
            console.log(`Sell ${coin} at ${highestBidPriceExchange.exchange.name} for: `, highestAskPrice);
            console.log('Percentage difference:', percentageDifferenceBetweenHighestAndLowest, '%');
            console.log('========================================================================');

            return '';
        }));
    }
}

module.exports = new Bot();
