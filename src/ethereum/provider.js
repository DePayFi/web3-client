import { ethers } from 'ethers'
import { getWallet } from 'depay-crypto-wallets'

let account, provider

export default async function () {
  let newAccount

  if (window?.ethereum) {
    newAccount = await getWallet().account()
  }

  if (provider && newAccount === account) {
    return provider
  }
  account = newAccount

  if (account) {
    provider = await new ethers.providers.Web3Provider(window.ethereum)
  } else {
    provider = await new ethers.providers.JsonRpcProvider(
      ['https://mainnet.infu', 'ra.io/v3/9aa3d95b3bc440fa8', '8ea12eaa4456161'].join(''),
    )
  }

  return provider
}
