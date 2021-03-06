import { PublicKey, ACCOUNT_LAYOUT } from '@depay/solana-web3.js'

let accountInfo = async ({ address, api, method, params, provider, block }) => {
  const info = await provider.getAccountInfo(new PublicKey(address))
  return api.decode(info.data)
}

let balance = ({ address, provider }) => {
  return provider.getBalance(new PublicKey(address))
}

export default async ({ provider, address, api, method, params, block }) => {
  if(method == undefined || method === 'getAccountInfo') {
    if(api == undefined) { 
      api = ACCOUNT_LAYOUT 
    }
    return accountInfo({ address, api, method, params, provider, block })
  } else if(method === 'getProgramAccounts') {
    return provider.getProgramAccounts(new PublicKey(address), params)
  } else if(method === 'getTokenAccountBalance') {
    return provider.getTokenAccountBalance(new PublicKey(address))
  } else if (method === 'latestBlockNumber') {
    return provider.getBlockHeight()  
  } else if (method === 'balance') {
    return balance({ address, provider })
  }
}
