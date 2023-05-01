import Solana from './provider'
import { PublicKey, ACCOUNT_LAYOUT } from '@depay/solana-web3.js'

const accountInfo = async ({ address, api, method, params, provider, block }) => {
  const info = await provider.getAccountInfo(new PublicKey(address))
  return api.decode(info.data)
}

const balance = ({ address, provider }) => {
  return provider.getBalance(new PublicKey(address))
}

const singleRequest = ({ blockchain, address, api, method, params, block, provider })=> {

  if(method == undefined || method === 'getAccountInfo') {
    if(api == undefined) {
      api = ACCOUNT_LAYOUT 
    }
    return accountInfo({ address, api, method, params, provider, block })
  } else if(method === 'getProgramAccounts') {
    return provider.getProgramAccounts(new PublicKey(address), params).then((accounts)=>{
      if(api){
        return accounts.map((account)=>{
          account.data = api.decode(account.account.data)
          return account
        })
      } else {
        return accounts
      }
    })
  } else if(method === 'getTokenAccountBalance') {
    return provider.getTokenAccountBalance(new PublicKey(address))
  } else if (method === 'latestBlockNumber') {
    return provider.getBlockHeight()  
  } else if (method === 'balance') {
    return balance({ address, provider })
  }
}


export default async ({ blockchain, address, api, method, params, block, timeout, strategy = 'fallback' }) => {

  if(strategy === 'fastest') {
    timeout = new Promise((resolve)=>setTimeout(()=>reject("Web3ClientTimeout"), timeout))
    return Promise.race([request, timeout])
  } else {

    const provider = await Solana.getProvider(blockchain)
    const request = singleRequest({ blockchain, address, api, method, params, block, provider })

    if(timeout) {
      timeout = new Promise((_, reject)=>setTimeout(()=>reject(new Error("Web3ClientTimeout")), timeout))
      return Promise.race([request, timeout])
    } else {
      return request
    }
  }
}
