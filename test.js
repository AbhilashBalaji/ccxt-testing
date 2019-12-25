'use strict'

const ccxt = require('ccxt')
const log = require('ololog')

const symbols = ['BTC/USDT', 'BTC/USDC', 'ETH/USDT', 'ETH/USDC', 'XRP/USDT', 'XRP/USDC']
const exchanges = ['binance', 'bitfinex']
var final = new Array();

symbols.forEach(symbol => {
    ; var Result = (async () => {

        const result = await Promise.all(exchanges.map(async id => {
            try {
                const exchange = new ccxt[id]({ 'enableRateLimit': true })
                const ticker = await exchange.fetchTicker(symbol)
                return exchange.extend({ 'exchange': id, 'symbol': ticker.symbol })
            } catch (e) {
                console.log(e);

            }


        }))

        final.push(result);

    })().then(
        () => {
            console.log(final);
        }

    )


})
// console.log(final);






