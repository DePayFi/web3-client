import ethereumProvider from './ethereum/provider'

export default function(blockchain){
  switch(blockchain) {

    case 'ethereum':
      ethereumProvider()
    break

    default:
      throw("Unknown blockchain: "+blockchain)
  }
}
