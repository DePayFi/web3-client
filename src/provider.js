import ethereumProvider from './ethereum/provider'

export default async function (blockchain) {
  switch (blockchain) {
    case 'ethereum':
      return await ethereumProvider()
      break

    default:
      throw 'Unknown blockchain: ' + blockchain
  }
}
