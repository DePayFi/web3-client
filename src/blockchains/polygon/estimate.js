import estimate from '../../vms/evm/estimate'

export default async ({ address, method, api, params, value }) => {
  return estimate({
    externalProvider: window.ethereum,
    address,
    method,
    api,
    params,
    value
  })
}
