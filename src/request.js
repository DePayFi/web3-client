import { cache as cacheRequest } from './cache'
import requestEthereum from './blockchains/ethereum/request'
import requestBsc from './blockchains/bsc/request'
import parseUrl from './parseUrl'

let request = async function (url, options) {
  let { blockchain, address, method } = parseUrl(url)
  let { api, params, cache } = options || {}
  let result = await cacheRequest({
    expires: cache || 0,
    key: [blockchain, address, method, params],
    call: () => {
      switch (blockchain) {

        case 'ethereum':
          return requestEthereum({ address, api, method, params })
          break

        case 'bsc':
          return requestBsc({ address, api, method, params })
          break

        default:
          throw 'Unknown blockchain: ' + blockchain
      }
    },
  })
  return result
}

export default request
