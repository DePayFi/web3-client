import bscProvider from './provider'
import request from '../../vms/evm/request'

export default async ({ address, api, method, params }) => {
  let provider = await bscProvider()

  return request({
    provider,
    address,
    api,
    method,
    params
  })
}
