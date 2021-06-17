(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ethers')) :
  typeof define === 'function' && define.amd ? define(['exports', 'ethers'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.BlockchainCall = {}, global.ethers));
}(this, (function (exports, ethers) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var ethers__default = /*#__PURE__*/_interopDefaultLegacy(ethers);

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

    if(provider && newAccount === account) { return provider }
    account = newAccount;

    if(account) {
      provider = new ethers__default['default'].providers.Web3Provider(window.ethereum);
    } else {
      provider = new ethers__default['default'].providers.JsonRpcProvider(['https://mainnet.infu','ra.io/v3/9aa3d95b3bc440fa8','8ea12eaa4456161'].join(''));
    }

    return provider
  }

  async function callEthereum({ blockchain, address, abi, method, params }){

    let contract = new ethers__default['default'].Contract(address, abi, await ethereumProvider());
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

  function call$1(args){
    if (!Array.isArray(args)) {
      // single request
      return call(args)
    } else {
      // parallel requests
      return Promise.all(args.map((arg)=>call(arg)))
    }
  }

  async function provider$1(blockchain){
    switch(blockchain) {

      case 'ethereum':
        return await ethereumProvider()

      default:
        throw("Unknown blockchain: "+blockchain)
    }
  }

  exports.call = call$1;
  exports.provider = provider$1;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
