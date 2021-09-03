import ethereumProvider from './provider'
import request from '../../vms/evm/request'

export default async ({ address, api, method, params }) => {
  let provider = ethereumProvider()

  return request({
    provider,
    address,
    api,
    method,
    params
  })
}
