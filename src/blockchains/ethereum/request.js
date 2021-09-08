import { getProvider } from './provider'
import request from '../../vms/evm/request'

export default async ({ address, api, method, params }) => {
  let provider = getProvider()

  return request({
    provider,
    address,
    api,
    method,
    params
  })
}
