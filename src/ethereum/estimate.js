import { ethers } from 'ethers'
import { getWallet } from 'depay-crypto-wallets'
import { paramsToContractArgs } from './contract'

let estimate = async ({ address, method, api, params, value }) => {
  let account = await getWallet().account()
  if (!account) {
    throw 'No wallet connected!'
  }

  let provider = new ethers.providers.Web3Provider(window.ethereum)
  let signer = provider.getSigner()

  let contract = new ethers.Contract(address, api, provider)
  let args = paramsToContractArgs({ contract, method, params })
  return contract.connect(signer).estimateGas[method](...args)
}

export default estimate
