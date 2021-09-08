import { StaticJsonRpcBatchProvider } from '../../ethers/providers'

let provider

const getProvider = ()=> {

  if(provider) { return provider }

  setProvider([['https://mainnet.infu', 'ra.io/v3/9aa3d95b3bc440fa8', '8ea12eaa4456161'].join('')])

  return provider
}

const setProvider = (endpoints)=> {

  provider = new StaticJsonRpcBatchProvider(
    endpoints[0], 'ethereum'
  )
}

export {
  getProvider,
  setProvider
}
