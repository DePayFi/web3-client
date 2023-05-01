import { ethers } from 'ethers'
import EVM from './provider'
import { paramsToContractArgs } from './contract'

const contractCall = ({ address, api, method, params, provider, block }) => {
  let contract = new ethers.Contract(address, api, provider)
  let args = paramsToContractArgs({ contract, method, params })
  return contract[method](...args, { blockTag: block })
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

export default async ({ blockchain, address, api, method, params, block, timeout, strategy = 'fallback' }) => {

  if(strategy === 'fastest') {

  } else {

    const provider = await EVM.getProvider(blockchain)
    const request = singleRequest({ blockchain, address, api, method, params, block, provider })
    
    if(timeout) {
      timeout = new Promise((_, reject)=>setTimeout(()=>reject(new Error("Web3ClientTimeout")), timeout))
      return Promise.race([request, timeout])
    } else {
      return request
    }
  }
}
