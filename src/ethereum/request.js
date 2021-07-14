import ethereumProvider from './provider'
import ethers from 'ethers'

let contractCall = ({ address, api, method, params, provider }) => {
  let contract = new ethers.Contract(address, api, provider)
  let fragment = contract.interface.fragments.find((fragment) => {
    return fragment.name == method
  })
  let args = fragment.inputs.map((input, index) => {
    if (Array.isArray(params)) {
      return params[index]
    } else {
      return params[input.name]
    }
  })
  return contract[method](...args)
}

let balance = ({ address, provider }) => {
  return provider.getBalance(address)
}

export default async ({ address, api, method, params }) => {
  let provider = await ethereumProvider()

  if (api) {
    return contractCall({ address, api, method, params, provider })
  } else if (method === 'balance') {
    return balance({ address, provider })
  }
}
