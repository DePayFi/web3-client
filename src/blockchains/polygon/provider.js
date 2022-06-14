import { StaticJsonRpcBatchProvider } from '../../ethers/providers'

let provider

const getProvider = ()=> {

  if(provider) { return provider }

  setProviderEndpoints(['https://polygon-rpc.com'])

  return provider
}

const setProviderEndpoints = (endpoints)=> {
  setProvider(
    new StaticJsonRpcBatchProvider(
      endpoints[0], 'polygon'
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
  resetProvider,
}
