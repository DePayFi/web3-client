import ethereumProvider from './blockchains/ethereum/provider'
import bscProvider from './blockchains/bsc/provider'

export default function (blockchain) {
  switch (blockchain) {
    
    case 'ethereum':
      return ethereumProvider()
      break

    case 'bsc':
      return bscProvider()
      break
    
    default:
      throw 'Unknown blockchain: ' + blockchain
  }
}
