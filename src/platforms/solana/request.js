import Solana from './provider'
import { getConfiguration } from '../../configuration'
import { PublicKey, ACCOUNT_LAYOUT } from '@depay/solana-web3.js'

const accountInfo = async ({ address, api, method, params, provider, block }) => {
  const info = await provider.getAccountInfo(new PublicKey(address))
  if(!info || !info.data) { return }
  return api.decode(info.data)
}

const balance = ({ address, provider }) => {
  return provider.getBalance(new PublicKey(address))
}

const singleRequest = async({ blockchain, address, api, method, params, block, provider, providers })=> {

  try {

    if(method == undefined || method === 'getAccountInfo') {
      if(api == undefined) {
        api = ACCOUNT_LAYOUT 
      }
      return await accountInfo({ address, api, method, params, provider, block })
    } else if(method === 'getProgramAccounts') {
      return await provider.getProgramAccounts(new PublicKey(address), params).then((accounts)=>{
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
      return await provider.getTokenAccountBalance(new PublicKey(address))
    } else if (method === 'latestBlockNumber') {
      return await provider.getBlockHeight()  
    } else if (method === 'balance') {
      return await balance({ address, provider })
    }

  } catch (error){
    if(providers && error && [
      'Failed to fetch', '504', '503', '502', '500', '429', '426', '422', '413', '409', '408', '406', '405', '404', '403', '402', '401', '400'
    ].some((errorType)=>error.toString().match(errorType))) {
      let nextProvider = providers[providers.indexOf(provider)+1] || providers[0]
      return singleRequest({ blockchain, address, api, method, params, block, provider: nextProvider, providers })
    } else {
      throw error
    }
  }
}

export default async ({ blockchain, address, api, method, params, block, timeout, strategy }) => {

  strategy = strategy ? strategy : (getConfiguration().strategy || 'failover')
  timeout = timeout ? timeout : (getConfiguration().timeout || undefined)

  const providers = await Solana.getProviders(blockchain)

  if(strategy === 'fastest') {

    return Promise.race(providers.map((provider)=>{

      const succeedingRequest = new Promise((resolve)=>{
        singleRequest({ blockchain, address, api, method, params, block, provider }).then(resolve)
      }) // failing requests are ignored during race/fastest
    
      const timeoutPromise = new Promise((_, reject)=>setTimeout(()=>{ reject(new Error("Web3ClientTimeout")) }, timeout || 10000))
        
      return Promise.race([succeedingRequest, timeoutPromise])
    }))
    
  } else { // failover

    const provider = await Solana.getProvider(blockchain)
    const request = singleRequest({ blockchain, address, api, method, params, block, provider, providers })

    if(timeout) {
      timeout = new Promise((_, reject)=>setTimeout(()=>{ reject(new Error("Web3ClientTimeout")) }, timeout))
      return Promise.race([request, timeout])
    } else {
      return request
    }
  }
}
