import estimateEVM from './platforms/evm/estimate'
import { getProvider } from './provider'
import { cache as cacheRequest } from './cache'
import { supported } from './blockchains'

let estimate = async function ({ blockchain, from, to, value, method, api, params, cache }) {
  if(!supported.includes(blockchain)) { throw 'Unknown blockchain: ' + blockchain }
  if(typeof value == 'undefined') { value = '0' }

  const provider = await getProvider(blockchain)
  
  return await cacheRequest({
    expires: cache || 0,
    key: [blockchain, from, to, value, method, params],
    call: async()=>estimateEVM({ provider, from, to, value, method, api, params })
  })
}

export default estimate
