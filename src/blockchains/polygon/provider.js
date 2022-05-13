import { StaticJsonRpcBatchProvider } from '../../ethers/providers'

let provider

const getProvider = ()=> {

  if(provider) { return provider }

  setProviderEndpoints(['https://rpc-mainnet.matic.network'])

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

export {
  getProvider,
  setProvider,
  setProviderEndpoints,
}
