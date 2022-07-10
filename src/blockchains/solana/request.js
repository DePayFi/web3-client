import { getProvider } from './provider'
import request from '../../platforms/solana/request'

export default async ({ address, interface, method, params, block }) => {
  let provider = getProvider()

  return request({
    provider,
    address,
    interface,
    method,
    params,
    block
  })
}
