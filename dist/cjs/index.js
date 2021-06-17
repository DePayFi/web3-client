'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ethers = require('ethers');

function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
let account, provider;

async function ethereumProvider(){
  let newAccount;

  if(_optionalChain([window, 'optionalAccess', _ => _.ethereum])){
    let accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if(accounts instanceof Array) {
      newAccount = accounts[0];
    }
  }

  if(provider && account === account) { return provider }
  account = newAccount;

  if(account) {
    provider = new ethers.ethers.providers.Web3Provider(window.ethereum);
  } else {
    provider = new ethers.ethers.providers.JsonRpcProvider(['https://mainnet.infu','ra.io/v3/9aa3d95b3bc440fa8','8ea12eaa4456161'].join(''));
  }

  return provider
}

async function callEthereum({ blockchain, address, abi, method, params }){

  let contract = new ethers.ethers.Contract(address, abi, await ethereumProvider());
  let fragment = contract.interface.fragments.find((fragment)=>{ return fragment.name == method });
  let args = fragment.inputs.map((input)=>{
    return params[input.name]
  });

  return await contract[method](...args);
}

function call({ blockchain, address, abi, method, params }){
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
}

function provider$1(blockchain){
  switch(blockchain) {

    case 'ethereum':
      ethereumProvider();
    break

    default:
      throw("Unknown blockchain: "+blockchain)
  }
}

exports.call = call;
exports.provider = provider$1;
