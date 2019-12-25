# -*- coding: utf-8 -*-

import asyncio
import ccxt
import ccxt.async_support as ccxta  # noqa: E402
import time
import os
import sys
import itertools
import json

root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(root + '/python')

symbol = ['ETH/BTC','ETH/USD']


# def sync_client(exchange):
#     client = getattr(ccxt, exchange)()
#     client.load_markets()
#     if symbol not in client.symbols:
#         raise Exception(exchange + ' does not support symbol ' + symbol)
#     orderbook = client.fetch_order_book(symbol)
#     return orderbook


async def async_client(symbol,exchange):
    client = getattr(ccxta, exchange)()
    await client.load_markets()
    if symbol not in client.symbols:
        raise Exception(exchange + ' does not support symbol ' + symbol)
    tickers = await client.fetch_order_book(symbol)
    await client.close()
    return tickers


async def multi_orderbooks(symbols,exchanges):
    input_coroutines = [
        async_client(symbol, exchange)
        for symbol, exchange in itertools.product(symbols,exchanges)]
    tickers = await asyncio.gather(*input_coroutines, return_exceptions=True)
    return tickers

# async def multi_symbol_orderbooks(symbols,exchanges):
#     input_coroutines=[multi_orderbooks(symbol,exchanges) for symbol in symbols]
#     tickers=await asyncio.gather(*input_coroutines, return_exceptions=True)
#     return tickers


if __name__ == '__main__':

    # Consider review request rate limit in the methods you call
    exchanges = [
        'BTC/USDT', 'BTC/USDC', 'ETH/USDT', 'ETH/USDC', 'XRP/USDT', 'XRP/USDC'
    ]

    tic = time.time()
    a = asyncio.get_event_loop().run_until_complete(multi_orderbooks(symbol,exchanges))
    print(len(a))
    # r=json.dumps(a)
    print(a)
    # for i in a :
    #     print(a)
    # print("async call spend:", time.time() - tic)

    # time.sleep(1)

    # tic = time.time()
    # a = [sync_client(exchange) for exchange in exchanges]
    # print("sync call spend:", time.time() - tic)