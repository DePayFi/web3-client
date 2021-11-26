import { 
  getProvider as getEthereumProvider,
  setProviderEndpoints as setEthereumProviderEndpoints,
  setProvider as setEthereumProvider
} from './blockchains/ethereum/provider'

import {
  getProvider as getBscProvider,
  setProviderEndpoints as setBscProviderEndpoints,
  setProvider as setBscProvider,
} from './blockchains/bsc/provider'

const provider = (blockchain)=>{

  switch (blockchain) {
    
    case 'ethereum':
      return getEthereumProvider()
      break

    case 'bsc':
      return getBscProvider()
      break
    
    default:
      throw 'Unknown blockchain: ' + blockchain
  }
}

const setProvider = (blockchain, provider)=>{

  switch (blockchain) {
    
    case 'ethereum':
      return setEthereumProvider(provider)
      break

    case 'bsc':
      return setBscProvider(provider)
      break
    
    default:
      throw 'Unknown blockchain: ' + blockchain
  }
}

const setProviderEndpoints = (blockchain, endpoints)=>{

  switch (blockchain) {
    
    case 'ethereum':
      return setEthereumProviderEndpoints(endpoints)
      break

    case 'bsc':
      return setBscProviderEndpoints(endpoints)
      break
    
    default:
      throw 'Unknown blockchain: ' + blockchain
  }
}

export {
  provider,
  setProvider,
  setProviderEndpoints,
}
