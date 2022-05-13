import parseUrl from './parseUrl'
import requestBsc from './blockchains/bsc/request'
import requestEthereum from './blockchains/ethereum/request'
import requestPolygon from './blockchains/polygon/request'
import { cache as cacheRequest } from './cache'

let request = async function (url, options) {
  let { blockchain, address, method } = parseUrl(url)
  let { api, params, cache } = options || {}
  if(!['ethereum', 'bsc', 'polygon'].includes(blockchain)) { throw 'Unknown blockchain: ' + blockchain }
  let result = await cacheRequest({
    expires: cache || 0,
    key: [blockchain, address, method, params],
    call: async () => {
      switch (blockchain) {

        case 'ethereum':
          return requestEthereum({ address, api, method, params })
          break

        case 'bsc':
          return requestBsc({ address, api, method, params })
          break

        case 'polygon':
          return requestPolygon({ address, api, method, params })
          break
          
      }
    },
  })
  return result
}

export default request
