import { getProvider } from './provider'
import estimate from '../../platforms/evm/estimate'

export default async ({ from, to, value, method, interface, params }) => {
  let provider = getProvider()
  return estimate({
    provider,
    from,
    to,
    value,
    method,
    interface,
    params
  })
}
