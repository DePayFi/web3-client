import parseUrl from './parseUrl'
import requestEVM from './platforms/evm/request'
import requestSolana from './platforms/solana/request'
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
        return requestEVM({ blockchain, address, api, method, params, block })
      } else if(supported.solana.includes(blockchain)) {
        return requestSolana({ blockchain, address, api, method, params, block })
      } else {
        throw 'Unknown blockchain: ' + blockchain
      }  
    }
  })
}

export default request
