import { ethers } from 'ethers'
import { getWallet } from 'depay-web3-wallets'

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
      'https://bsc-dataseed.binance.org'
    )
  }

  return provider
}
