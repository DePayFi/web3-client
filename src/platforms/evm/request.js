import EVM from './provider'
import { ethers } from 'ethers'
import { getConfiguration } from '../../configuration'
import { paramsToContractArgs } from './contract'

const contractCall = ({ address, api, method, params, provider, block }) => {
  const contract = new ethers.Contract(address, api, provider)
  const args = paramsToContractArgs({ contract, method, params })
  console.log(contract.interface.fragments)
  const fragment = contract.interface.fragments.find((fragment)=>fragment.name === method)
  if(fragment && fragment.stateMutability === 'nonpayable') {
    return contract.callStatic[method](...args, { blockTag: block })
  } else {
    return contract[method](...args, { blockTag: block })
  }
}

const balance = ({ address, provider }) => {
  return provider.getBalance(address)
}

const transactionCount = ({ address, provider }) => {
  return provider.getTransactionCount(address)
}

const singleRequest = ({ blockchain, address, api, method, params, block, provider }) =>{
  if (api) {
    return contractCall({ address, api, method, params, provider, block })
  } else if (method === 'latestBlockNumber') {
    return provider.getBlockNumber()
  } else if (method === 'balance') {
    return balance({ address, provider })
  } else if (method === 'transactionCount') {
    return transactionCount({ address, provider })
  }
}

export default async ({ blockchain, address, api, method, params, block, timeout, strategy }) => {

  strategy = strategy ? strategy : (getConfiguration().strategy || 'failover')
  timeout = timeout ? timeout : (getConfiguration().timeout || undefined)

  if(strategy === 'fastest') {

    return Promise.race((await EVM.getProviders(blockchain)).map((provider)=>{

      const request = singleRequest({ blockchain, address, api, method, params, block, provider })
    
      if(timeout) {
        const timeoutPromise = new Promise((_, reject)=>setTimeout(()=>{ reject(new Error("Web3ClientTimeout")) }, timeout))
        return Promise.race([request, timeoutPromise])
      } else {
        return request
      }
    }))

  } else { // failover

    const provider = await EVM.getProvider(blockchain)
    const request = singleRequest({ blockchain, address, api, method, params, block, provider })
    
    if(timeout) {
      timeout = new Promise((_, reject)=>setTimeout(()=>{ reject(new Error("Web3ClientTimeout")) }, timeout))
      return Promise.race([request, timeout])
    } else {
      return request
    }
  }
}
