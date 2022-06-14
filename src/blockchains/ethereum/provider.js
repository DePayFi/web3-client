import { StaticJsonRpcBatchProvider } from '../../ethers/providers'

let provider

const getProvider = ()=> {

  if(provider) { return provider }

  setProviderEndpoints([['https://mainnet.infu', 'ra.io/v3/9aa3d95b3bc440fa8', '8ea12eaa4456161'].join('')])

  return provider
}

const setProviderEndpoints = (endpoints)=> {
  setProvider(
    new StaticJsonRpcBatchProvider(
      endpoints[0], 'ethereum'
    )
  )
}

const setProvider = (givenProvider)=> {
  provider = givenProvider
}

const resetProvider = ()=> { provider = undefined }

export {
  getProvider,
  setProvider,
  setProviderEndpoints,
  resetProvider
}
