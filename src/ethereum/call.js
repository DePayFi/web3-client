import { ethers } from 'ethers';

export default async function({ blockchain, address, abi, method, params }){
  let account, provider;

  if(window?.ethereum){
    let accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if(accounts instanceof Array) {
      account = accounts[0];
    }
  }

  if(account) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  } else {
    throw('plain HTTP/RPC provider')
  }

  let contract = new ethers.Contract(address, abi, provider);
  let fragment = contract.interface.fragments.find((fragment)=>{ return fragment.name == method });
  let args = fragment.inputs.map((input)=>{
    return params[input.name]
  });

  return await contract[method](...args);
}
