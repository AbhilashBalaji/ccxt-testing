/*
    USDT/BTC 
    ask : 1 USDT for x BTC
    bid : sell 1 USDT for y BTC
    USDT ,USDC ,
*/

'use strict'

const ccxt = require('ccxt')
const symbols = ['BTC/USDT', 'BTC/USDC', 'ETH/USDT', 'ETH/USDC', 'XRP/USDT', 'XRP/USDC']
const exchanges = ['binance', 'bitfinex']
