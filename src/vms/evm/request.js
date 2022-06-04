import { ethers } from 'ethers'
import { paramsToContractArgs } from './contract'

let contractCall = ({ address, api, method, params, provider, block }) => {
  let contract = new ethers.Contract(address, api, provider)
  let args = paramsToContractArgs({ contract, method, params })
  return contract[method](...args, { blockTag: block })
}

let balance = ({ address, provider }) => {
  return provider.getBalance(address)
}

export default async ({ provider, address, api, method, params, block }) => {
  if (api) {
    return contractCall({ address, api, method, params, provider, block })
  } else if (method === 'latestBlockNumber') {
    return provider.getBlockNumber()
  } else if (method === 'balance') {
    return balance({ address, provider })
  }
}
