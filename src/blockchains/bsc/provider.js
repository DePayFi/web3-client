import { StaticJsonRpcBatchProvider } from '../../ethers/providers'

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

export {
  getProvider,
  setProvider,
  setProviderEndpoints,
}
