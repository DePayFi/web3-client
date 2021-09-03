import { StaticJsonRpcBatchProvider } from '../../ethers/providers'

let provider

export default function () {

  if(provider) { return provider }

  provider = new StaticJsonRpcBatchProvider(
    ['https://mainnet.infu', 'ra.io/v3/9aa3d95b3bc440fa8', '8ea12eaa4456161'].join(''), 'ethereum'
  )

  return provider
}
