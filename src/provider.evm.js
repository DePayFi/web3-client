import { 
  getProvider as getEthereumProvider,
  setProviderEndpoints as setEthereumProviderEndpoints,
  setProvider as setEthereumProvider,
  resetProvider as resetEthereumProvider,
} from './blockchains/ethereum/provider'

import {
  getProvider as getBscProvider,
  setProviderEndpoints as setBscProviderEndpoints,
  setProvider as setBscProvider,
  resetProvider as resetBscProvider,
} from './blockchains/bsc/provider'

import {
  getProvider as getPolygonProvider,
  setProviderEndpoints as setPolygonProviderEndpoints,
  setProvider as setPolygonProvider,
  resetProvider as resetPolygonProvider,
} from './blockchains/polygon/provider'

const provider = (blockchain)=>{

  switch (blockchain) {
    
    case 'ethereum':
      return getEthereumProvider()
      break

    case 'bsc':
      return getBscProvider()
      break

    case 'polygon':
      return getPolygonProvider()
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

    case 'polygon':
      return setPolygonProvider(provider)
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

    case 'polygon':
      return setPolygonProviderEndpoints(endpoints)
      break

    default:
      throw 'Unknown blockchain: ' + blockchain
  }
}

const resetProviders = ()=>{
  resetEthereumProvider()
  resetBscProvider()
  resetPolygonProvider()
}

export {
  provider,
  setProvider,
  setProviderEndpoints,
  resetProviders,
}
