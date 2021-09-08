import { getProvider as getEthereumProvider, setProvider as setEthereumProvider } from './blockchains/ethereum/provider'
import { getProvider as getBscProvider, setProvider as setBscProvider } from './blockchains/bsc/provider'

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

const setProvider = (blockchain, endpoints)=>{

  switch (blockchain) {
    
    case 'ethereum':
      return setEthereumProvider(endpoints)
      break

    case 'bsc':
      return setBscProvider(endpoints)
      break
    
    default:
      throw 'Unknown blockchain: ' + blockchain
  }
}


export {
  provider,
  setProvider
}
