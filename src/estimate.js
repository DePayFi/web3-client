import estimateBsc from './blockchains/bsc/estimate'
import estimateEthereum from './blockchains/ethereum/estimate'
import estimatePolygon from './blockchains/polygon/estimate'
import { cache as cacheRequest } from './cache.evm'

let estimate = async function ({ blockchain, from, to, value, method, api, params, cache }) {
  if(!['ethereum', 'bsc', 'polygon'].includes(blockchain)) { throw 'Unknown blockchain: ' + blockchain }
  if(typeof value == 'undefined') { value = '0' }

  let result = await cacheRequest({
    expires: cache || 0,
    key: [blockchain, from, to, value, method, params],
    call: async () => {
      switch (blockchain) {

        case 'ethereum':
          return estimateEthereum({ from, to, value, method, api, params })
          break

        case 'bsc':
          return estimateBsc({ from, to, value, method, api, params })
          break

        case 'polygon':
          return estimatePolygon({ from, to, value, method, api, params })
          break
          
      }
    },
  })
  return result
}

export default estimate
