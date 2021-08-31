import { ethers } from 'ethers'
import { getWallet } from 'depay-web3-wallets'

export default async function () {
  let wallet = getWallet()
  let account = wallet?.account()

  if (await account && await wallet.connectedTo('bsc')) {
    return await new ethers.providers.Web3Provider(window.ethereum)
  } else {
    return await new ethers.providers.JsonRpcProvider(
      'https://bsc-dataseed.binance.org'
    )
  }

  return provider
}
