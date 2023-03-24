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

let request = async function (url, options) {
  let { blockchain, address, method } = parseUrl(url)
  let { api, params, cache, block } = (typeof(url) == 'object' ? url : options) || {}

  return await cacheRequest({
    expires: cache || 0,
    key: [blockchain, address, method, params, block],
    call: async()=>{
      if(supported.evm.includes(blockchain)) {

        /*#if _EVM

        return await requestEVM({ blockchain, address, api, method, params, block })

        /*#elif _SOLANA

        //#else */

        return await requestEVM({ blockchain, address, api, method, params, block })

        //#endif

      } else if(supported.solana.includes(blockchain)) {

        /*#if _EVM

        /*#elif _SOLANA

        return requestSolana({ blockchain, address, api, method, params, block })

        //#else */

        return await requestSolana({ blockchain, address, api, method, params, block })

        //#endif

      } else {
        throw 'Unknown blockchain: ' + blockchain
      }  
    }
  })
}

export default request
