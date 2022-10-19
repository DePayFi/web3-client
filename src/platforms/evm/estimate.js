import { ethers } from 'ethers'

const getContractArguments = ({ contract, method, params })=>{
  let fragment = contract.interface.fragments.find((fragment) => {
    return fragment.name == method
  })

  if(params instanceof Array) {
    return params
  } else if (params instanceof Object) {
    return fragment.inputs.map((input) => {
      return params[input.name]
    })
  } else {
    throw 'Contract params have wrong type!'
  }
}

export default ({ provider, from, to, value, method, api, params }) => {
  if(typeof api == "undefined"){
    return provider.estimateGas({ from, to, value })
  } else {
    let contract = new ethers.Contract(to, api, provider)
    return contract.estimateGas[method](...getContractArguments({ contract, method, params }), { from, value })
  }
}
