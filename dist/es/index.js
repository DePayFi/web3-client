import { ethers } from 'ethers';

function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
async function callEthereum({ blockchain, address, abi, method, params }){
  let account, provider;

  if(_optionalChain([window, 'optionalAccess', _ => _.ethereum])){
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

let call = function({ blockchain, address, abi, method, params }){
  return new Promise((resolve, reject) => {

    switch(blockchain) {

      case 'ethereum':
        callEthereum({ blockchain, address, abi, method, params })
          .then((value)=>resolve(value));
      break

      default:
        reject("Unknown blockchain: "+blockchain);
    }
  })
};

export { call };
