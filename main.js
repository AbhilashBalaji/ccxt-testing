"use strict";
/*
{
  limits: {
    amount: { min: 0.001, max: 900000 },
    price: { min: 0.001, max: 10000 },
    cost: { min: 10, max: undefined }
  },
  precision: { base: 8, quote: 8, amount: 3, price: 3 },
  tierBased: false,
  percentage: true,
  taker: 0.001,
  maker: 0.001,
  id: 'FTTUSDT',
  symbol: 'FTT/USDT',
  base: 'FTT',
  quote: 'USDT',
  baseId: 'FTT',
  quoteId: 'USDT',
  info: {
    symbol: 'FTTUSDT',
    status: 'TRADING',
    baseAsset: 'FTT',
    baseAssetPrecision: 8,
    quoteAsset: 'USDT',
    quotePrecision: 8,
    baseCommissionPrecision: 8,
    quoteCommissionPrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    ocoAllowed: true,
    quoteOrderQtyMarketAllowed: true,
    isSpotTradingAllowed: true,
    isMarginTradingAllowed: false,
    filters: [ [Object], [Object], [Object], [Object], [Object], [Object] ]
  },
  type: 'spot',
  spot: true,
  future: false,
  active: true
}
*/

const asTable = require('as-table')
    , log = require('ololog').noLocate
    , ansi = require('ansicolor').nice
    , ccxt = require('ccxt')

let printSupportedExchanges = function () {
    log('Supported exchanges:', ccxt.exchanges.join(', ').green)
}

let printUsage = function () {
    log('Usage: node', process.argv[1], 'exchange'.green, 'symbol'.yellow, 'depth'.cyan)
    printSupportedExchanges()
}

let printOrderBook = async (id, symbol1, depth) => {

    let graphs=new Object();
    graphs.exchanges=Array();
    //     // check if the exchange is supported by ccxt
    let exchangeFound = ccxt.exchanges.indexOf(id) > -1
    if (exchangeFound) {
        let exchange = new ccxt[id]({ enableRateLimit: true })
        graphs.exchanges.push(id);
        graphs.exchanges[id]=Array();
        let symbols_in_exchange = await exchange.loadMarkets()
        
        for(var symbol in symbols_in_exchange){
            // console.log(symbol);
            graphs.exchanges[id].push(symbol);
            graphs.exchanges[id][symbol]=new Array();
            if(symbols_in_exchange[symbol].base != 'BTC'){continue;}
            let orderbook = await exchange.fetchOrderBook(symbols_in_exchange[symbol].symbol)
            log(symbols_in_exchange[symbol].symbol)
            try {
                //find highest of asks
                //find lowest of bids
                // console.log(orderbook.asks.length);
                
                var asks = orderbook.asks
                var bids = orderbook.bids
                console.log(asks);
                
                var max = asks.reduce(function (a, b) {
                    return Math.max(a[0], b[0]);
                });
                var min = bids.reduce(function (a, b) {
                    return Math.min(a[0], b[0]);
                });                
                graphs.exchanges[id][symbol].push(max);
                console.log(max,min);
                
            } catch ( e) {
                console.log(e);
                
            }
            
                //find highest of asks
                //find lowest of bids
                //store these in graph[exchange][highest_ask][lowest_bid] and graph[exchange][lowest_bid]
            
            //find which exchange has highest of highest_asks, say A, and which exchange has lowest of lowest_bids, say B.
            //sell btc on A
            //buy btc on B

        }
        console.log(graphs);
        
        return;
        for (var market in markets) {
            if (markets[market].base != 'USD')
                continue;
            /*
            for [A/B], if ask price is X and bid price is Y
            ask : someone looking to buy 1 A, is willing to pay X units of B
            bid : someone selling 1 A, would receive Y units of B
            spread % = ((ask - bid)/ask ) * 100

            The EUR/USD bid and offer prices were as follows:
            Bid price: 1.3350 USD per EUR
            Ask price: 1.3354 USD per EUR
            So someone looking to buy euros would have to pay $1.3354 
            per euro while someone looking to sell euros would only receive $1.3350.
            The spread is $0.0004 and the spread percentage is roughly 0.03%.

            */
            
            const orderbook = await exchange.fetchOrderBook(markets[market].symbol);
            console.log(markets[market].quote, orderbook.bids);

            // console.log(symbol);
            // break;
            // if(markets[market].base==='USD')
            //     graphs[exchange][quote]=markets[market]
        }

    }

    //         log('Instantiating', id.green, 'exchange')

    //         // instantiate the exchange by id
    //         let exchange = new ccxt[id]({ enableRateLimit: true })

    //         // load all markets from the exchange
    //         let markets = await exchange.loadMarkets()

    //         // // output a list of all market symbols
    //         // log (id.green, 'has', exchange.symbols.length, 'symbols:', exchange.symbols.join (', ').yellow)

    //         if (symbol in exchange.markets) {

    //             const market = exchange.markets[symbol]
    //             const pricePrecision = market.precision ? market.precision.price : 8
    //             const amountPrecision = market.precision ? market.precision.amount : 8

    //             // Object.values (markets).forEach (market => log (market))

    //             // make a table of all markets
    //             // const table = asTable.configure ({ delimiter: ' | ' }) (Object.values (markets))
    //             // log (table)

    //             const priceVolumeHelper = color => ([price, amount]) => ({
    //                 price: price.toFixed(pricePrecision)[color],
    //                 amount: amount.toFixed(amountPrecision)[color],
    //                 '  ': '  ',
    //             })

    //             const cursorUp = '\u001b[1A'
    //             const tableHeight = depth * 2 + 4 // bids + asks + headers

    //             log(' ') // empty line

    //             while (true) {

    //                 const orderbook = await exchange.fetchOrderBook(symbol)

    //                 log(symbol.green, exchange.iso8601(exchange.milliseconds()))

    //                 log(asTable.configure({ delimiter: ' | '.dim, right: true })([
    //                     ...orderbook.asks.slice(0, depth).reverse().map(priceVolumeHelper('red')),
    //                     // { price: '--------'.dim, amount: '--------'.dim },
    //                     ...orderbook.bids.slice(0, depth).map(priceVolumeHelper('green')),
    //                 ]))

    //                 log(cursorUp.repeat(tableHeight))
    //             }

    //         } else {
    //             log(exchange.markets)
    //             log.error('Symbol', symbol.bright, 'not found')
    //         }


    //     } else {

    //         log('Exchange ' + id.red + ' not found')
    //         printSupportedExchanges()
    //     }
}

    ; (async function main() {

        if (process.argv.length > 4) {

            const id = process.argv[2]
            const symbol = process.argv[3].toUpperCase()
            const depth = parseInt(process.argv[4])
            await printOrderBook(id, symbol, depth)

        } else {

            printUsage()
        }

        process.exit()

    })()