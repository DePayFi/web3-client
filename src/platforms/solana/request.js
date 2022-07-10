import { PublicKey } from '@solana/web3.js'

let contractCall = ({ address, api, method, params, provider, block }) => {
  const info = provider.getAccountInfo(new PublicKey(address))
  
  return 
}

let balance = ({ address, provider }) => {
  return provider.getBalance(new PublicKey(address))
}

export default async ({ provider, address, api, method, params, block }) => {
  if (api) {
    return contractCall({ address, api, method, params, provider, block })
  } else if (method === 'latestBlockNumber') {
    return provider.getBlockHeight()  
  } else if (method === 'balance') {
    return balance({ address, provider })
  }
}
