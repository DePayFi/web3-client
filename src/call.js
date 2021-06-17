import callEthereum from './ethereum/call'

let call = function({ blockchain, address, abi, method, params }){
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

export default call
