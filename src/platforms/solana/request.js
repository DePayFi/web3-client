import { PublicKey } from '@depay/solana-web3.js'

let accountInfo = async ({ address, api, method, params, provider, block }) => {
  const info = await provider.getAccountInfo(new PublicKey(address))
  return api.decode(info.data)
}

let balance = ({ address, provider }) => {
  return provider.getBalance(new PublicKey(address))
}

export default async ({ provider, address, api, method, params, block }) => {
  if (api) {
    return accountInfo({ address, api, method, params, provider, block })
  } else if (method === 'latestBlockNumber') {
    return provider.getBlockHeight()  
  } else if (method === 'balance') {
    return balance({ address, provider })
  }
}
