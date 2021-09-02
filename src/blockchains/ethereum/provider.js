import { ethers } from 'ethers'

let provider

export default async function () {

  if(provider) { return provider }

  provider = await new ethers.providers.JsonRpcBatchProvider(
    ['https://mainnet.infu', 'ra.io/v3/9aa3d95b3bc440fa8', '8ea12eaa4456161'].join(''),
  )

  return provider
}
