import { cache as cacheRequest } from './cache'
import requestEthereum from './ethereum/request'

let parseUrl = (url) => {
  let deconstructed = url.match(/(?<blockchain>\w+):\/\/(?<address>[\w\d]+)\/(?<method>[\w\d]+)/)
  return deconstructed.groups
}

let request = async function (url, options) {
  let { blockchain, address, method } = parseUrl(url)
  let { api, params, cache } = options || {}
  return await cacheRequest({
    expires: cache || 0,
    key: [blockchain, address, method, params],
    call: () => {
      switch (blockchain) {
        case 'ethereum':
          return requestEthereum({ address, api, method, params })
          break

        default:
          throw 'Unknown blockchain: ' + blockchain
      }
    },
  })
}

export default request
