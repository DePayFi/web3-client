import { ethers } from 'ethers'
import EVM from './provider'
import { paramsToContractArgs } from './contract'

let contractCall = ({ address, api, method, params, provider, block }) => {
  let contract = new ethers.Contract(address, api, provider)
  let args = paramsToContractArgs({ contract, method, params })
  return contract[method](...args, { blockTag: block })
}

let balance = ({ address, provider }) => {
  return provider.getBalance(address)
}

let transactionCount = ({ address, provider }) => {
  return provider.getTransactionCount(address)
}

export default async ({ blockchain, address, api, method, params, block }) => {
  const provider = await EVM.getProvider(blockchain)
  
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
