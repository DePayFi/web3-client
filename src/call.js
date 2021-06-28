import { cache as cacheCall } from './cache'
import callEthereum from './ethereum/call'

let call = async function ({ blockchain, address, api, method, params, cache = 0 }) {
  return await cacheCall({
    expires: cache,
    key: [blockchain, address, method, params],
    call: ()=>{
      switch (blockchain) {
        case 'ethereum':
          return callEthereum({ blockchain, address, api, method, params })
          break

        default:
          throw('Unknown blockchain: ' + blockchain)
      }
    }
  })
}

export default function (args) {
  if (!Array.isArray(args)) {
    // single request
    return call(args)
  } else {
    // parallel requests
    return Promise.all(args.map((arg) => call(arg)))
  }
}
