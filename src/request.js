/*#if _EVM

import requestEVM from './platforms/evm/request'

/*#elif _SOLANA

import requestSolana from './platforms/solana/request'

//#else */

import requestEVM from './platforms/evm/request'
import requestSolana from './platforms/solana/request'

//#endif

import parseUrl from './parseUrl'
import { cache as cacheRequest } from './cache'
import { supported } from './blockchains'

const request = async function (url, options) {
  
  const { blockchain, address, method } = parseUrl(url)
  const { api, params, cache, block, timeout, strategy, cacheKey } = (typeof(url) == 'object' ? url : options) || {}

  return await cacheRequest({
    expires: cache || 0,
    key: cacheKey || [blockchain, address, method, params, block],
    call: async()=>{
      if(supported.evm.includes(blockchain)) {

        /*#if _EVM

        return await requestEVM({ blockchain, address, api, method, params, block, strategy, timeout })

        /*#elif _SOLANA

        //#else */

        return await requestEVM({ blockchain, address, api, method, params, block, strategy, timeout })

        //#endif

      } else if(supported.solana.includes(blockchain)) {

        /*#if _EVM

        /*#elif _SOLANA

        return requestSolana({ blockchain, address, api, method, params, block, strategy, timeout })

        //#else */

        return await requestSolana({ blockchain, address, api, method, params, block, strategy, timeout })

        //#endif

      } else {
        throw 'Unknown blockchain: ' + blockchain
      }  
    }
  })
}

export default request
