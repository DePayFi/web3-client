import { StaticJsonRpcBatchProvider } from '../../ethers/providers'

let provider

const getProvider = ()=> {

  if(provider) { return provider }

  setProvider(['https://bsc-dataseed.binance.org'])

  return provider
}

const setProvider = (endpoints)=> {

  provider = new StaticJsonRpcBatchProvider(
    endpoints[0], 'bsc'
  )
}

export {
  getProvider,
  setProvider
}
