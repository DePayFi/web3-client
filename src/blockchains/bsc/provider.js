import { ethers } from 'ethers'

let provider
let promise

export default async function () {

  if(provider) { return provider }

  provider = await new ethers.providers.JsonRpcBatchProvider(
    'https://bsc-dataseed.binance.org'
  )

  return provider
}
