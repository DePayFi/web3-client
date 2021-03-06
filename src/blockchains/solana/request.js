import { getProvider } from './provider'
import request from '../../platforms/solana/request'

export default async ({ address, api, method, params, block }) => {
  let provider = getProvider()

  return request({
    provider,
    address,
    api,
    method,
    params,
    block
  })
}
