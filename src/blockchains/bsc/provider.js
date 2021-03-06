import StaticJsonRpcBatchProvider from '../../clients/ethers/provider'

let provider

const getProvider = ()=> {

  if(provider) { return provider }

  setProviderEndpoints(['https://bsc-dataseed.binance.org'])

  return provider
}

const setProviderEndpoints = (endpoints)=> {
  setProvider(
    new StaticJsonRpcBatchProvider(
      endpoints[0], 'bsc'
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
