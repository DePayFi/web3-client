import { StaticJsonRpcBatchProvider } from '../../ethers/providers'

let provider

export default function () {

  if(provider) { return provider }

  provider = new StaticJsonRpcBatchProvider(
    'https://bsc-dataseed.binance.org', 'bsc'
  )

  return provider
}
