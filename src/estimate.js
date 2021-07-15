import estimateEthereum from './ethereum/estimate'
import parseUrl from './parseUrl'

let request = async function (url, options) {
  let { blockchain, address, method } = parseUrl(url)
  let { api, params, value } = options || {}
  switch (blockchain) {
    case 'ethereum':
      return estimateEthereum({ address, method, api, params, value })
      break

    default:
      throw 'Unknown blockchain: ' + blockchain
  }
}

export default request
