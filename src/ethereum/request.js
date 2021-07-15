import ethereumProvider from './provider'
import { ethers } from 'ethers'
import { paramsToContractArgs } from './contract'

let contractCall = ({ address, api, method, params, provider }) => {
  let contract = new ethers.Contract(address, api, provider)
  let args = paramsToContractArgs({ contract, method, params })
  return contract[method](...args)
}

let balance = ({ address, provider }) => {
  return provider.getBalance(address)
}

export default async ({ address, api, method, params }) => {
  let provider = await ethereumProvider()

  if (api) {
    return contractCall({ address, api, method, params, provider })
  } else if (method === 'balance') {
    return balance({ address, provider })
  }
}
