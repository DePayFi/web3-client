import { PublicKey } from '@solana/web3.js'

let contractCall = ({ address, interface, method, params, provider, block }) => {
  const info = provider.getAccountInfo(new PublicKey(address))
  
  return 
}

let balance = ({ address, provider }) => {
  return provider.getBalance(new PublicKey(address))
}

export default async ({ provider, address, interface, method, params, block }) => {
  if (interface) {
    return contractCall({ address, interface, method, params, provider, block })
  } else if (method === 'latestBlockNumber') {
    return provider.getBlockHeight()  
  } else if (method === 'balance') {
    return balance({ address, provider })
  }
}
