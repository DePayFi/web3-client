import callEthereum from './ethereum/call'

let call = function ({ blockchain, address, api, method, params }) {
  return new Promise((resolve, reject) => {
    switch (blockchain) {
      case 'ethereum':
        callEthereum({ blockchain, address, api, method, params }).then((value) => resolve(value))
        break

      default:
        reject('Unknown blockchain: ' + blockchain)
    }
  })
}

export default function (args) {
  if (!Array.isArray(args)) {
    // single request
    return call(args)
  } else {
    // parallel requests
    return Promise.all(args.map((arg) => call(arg)))
  }
}
