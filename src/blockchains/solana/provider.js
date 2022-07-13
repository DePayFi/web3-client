import StaticJsonRpcBatchProvider from '../../clients/solana/provider'

let provider

const getProvider = ()=> {

  if(provider) { return provider }

  setProviderEndpoints(['https://api.mainnet-beta.solana.com'])

  return provider
}

const setProviderEndpoints = (endpoints)=> {
  setProvider(
    new StaticJsonRpcBatchProvider(
      endpoints[0], 'solana'
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
