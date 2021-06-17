import provider from './provider'
import { ethers } from 'ethers'

export default async function({ blockchain, address, abi, method, params }){

  let contract = new ethers.Contract(address, abi, await provider());
  let fragment = contract.interface.fragments.find((fragment)=>{ return fragment.name == method });
  let args = fragment.inputs.map((input)=>{
    return params[input.name]
  });

  return await contract[method](...args);
}
