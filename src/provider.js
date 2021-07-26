import ethereumProvider from './blockchains/ethereum/provider'
import bscProvider from './blockchains/bsc/provider'

export default async function (blockchain) {
  switch (blockchain) {
    
    case 'ethereum':
      return await ethereumProvider()
      break

    case 'bsc':
      return await bscProvider()
      break
    
    default:
      throw 'Unknown blockchain: ' + blockchain
  }
}
