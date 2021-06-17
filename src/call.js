import callEthereum from './ethereum/call'

export default function({ blockchain, address, abi, method, params }){
  return new Promise((resolve, reject) => {

    switch(blockchain) {

      case 'ethereum':
        callEthereum({ blockchain, address, abi, method, params })
          .then((value)=>resolve(value))
      break

      default:
        reject("Unknown blockchain: "+blockchain)
    }
  })
}
