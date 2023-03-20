(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@depay/solana-web3.js'), require('ethers')) :
  typeof define === 'function' && define.amd ? define(['exports', '@depay/solana-web3.js', 'ethers'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Web3Client = {}, global.SolanaWeb3js, global.ethers));
})(this, (function (exports, solanaWeb3_js, ethers) { 'use strict';

  class StaticJsonRpcSequentialProvider extends solanaWeb3_js.Connection {

    constructor(url, network, endpoints) {
      super(url);
      this._network = network;
      this._endpoint = url;
      this._endpoints = endpoints;
    }
  }

  let _window;

  let getWindow = () => {
    if(_window) { return _window }
    if (typeof global == 'object') {
      _window = global;
    } else {
      _window = window;
    }
    return _window
  };

  const ENDPOINTS = {
    solana: ['https://solana-mainnet.phantom.app/YBPpkkN4g91xDiAnTE9r0RcMkjg0sKUIWvAfoFVJ', 'https://mainnet-beta.solflare.network', 'https://solana-mainnet.rpc.extrnode.com']
  };

  const getProviders = ()=> {
    if(getWindow()._clientProviders == undefined) {
      getWindow()._clientProviders = {};
    }
    return getWindow()._clientProviders
  };

  const setProvider$1 = (blockchain, provider)=> {
    getProviders()[blockchain] = provider;
  };

  const setProviderEndpoints$1 = async (blockchain, endpoints)=> {
    
    let endpoint;
    let window = getWindow();

    if(
      window.fetch == undefined ||
      (typeof process != 'undefined' && process['env'] && process['env']['NODE_ENV'] == 'test') ||
      (typeof window.cy != 'undefined')
    ) {
      endpoint = endpoints[0];
    } else {
      
      let responseTimes = await Promise.all(endpoints.map((endpoint)=>{
        return new Promise(async (resolve)=>{
          let timeout = 900;
          let before = new Date().getTime();
          setTimeout(()=>resolve(timeout), timeout);
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ method: 'getIdentity', id: 1, jsonrpc: '2.0' })
          });
          if(!response.ok) { return resolve(999) }
          let after = new Date().getTime();
          resolve(after-before);
        })
      }));

      const fastestResponse = Math.min(...responseTimes);
      const fastestIndex = responseTimes.indexOf(fastestResponse);
      endpoint = endpoints[fastestIndex];
    }
    
    setProvider$1(
      blockchain,
      new StaticJsonRpcSequentialProvider(endpoint, blockchain, endpoints)
    );
  };

  const getProvider$1 = async (blockchain)=> {

    let providers = getProviders();
    if(providers && providers[blockchain]){ return providers[blockchain] }
    
    let window = getWindow();
    if(window._getProviderPromise && window._getProviderPromise[blockchain]) { return await window._getProviderPromise[blockchain] }

    if(!window._getProviderPromise){ window._getProviderPromise = {}; }
    window._getProviderPromise[blockchain] = new Promise(async(resolve)=> {
      await setProviderEndpoints$1(blockchain, ENDPOINTS[blockchain]);
      resolve(getWindow()._clientProviders[blockchain]);
    });

    return await window._getProviderPromise[blockchain]
  };

  var Solana = {
    getProvider: getProvider$1,
    setProviderEndpoints: setProviderEndpoints$1,
    setProvider: setProvider$1,
  };

  let supported = ['solana'];
  supported.evm = [];
  supported.solana = ['solana'];

  const getProvider = async (blockchain)=>{

    if(supported.evm.includes(blockchain)) ; else if(supported.solana.includes(blockchain)) {


      return await Solana.getProvider(blockchain)


    } else {
      throw 'Unknown blockchain: ' + blockchain
    }
  };

  const setProvider = (blockchain, provider)=>{

    if(supported.evm.includes(blockchain)) ; else if(supported.solana.includes(blockchain)) {


      return Solana.setProvider(blockchain, provider)


    } else {
      throw 'Unknown blockchain: ' + blockchain
    }
  };

  const setProviderEndpoints = (blockchain, endpoints)=>{

    if(supported.evm.includes(blockchain)) ; else if(supported.solana.includes(blockchain)) {


      return Solana.setProviderEndpoints(blockchain, endpoints)


    } else {
      throw 'Unknown blockchain: ' + blockchain
    }
  };

  function _optionalChain$1(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let simulate = async function ({ blockchain, from, to, keys, api, params }) {
    if(!supported.solana.includes(blockchain)) { throw `${blockchain} not supported for simulation!` }

    const data = solanaWeb3_js.Buffer.alloc(api.span);
    api.encode(params, data);

    keys = keys.map((key)=>{
      return({...key,
        pubkey: new solanaWeb3_js.PublicKey(key.pubkey)
      })
    });

    const instruction = new solanaWeb3_js.TransactionInstruction({
      programId: new solanaWeb3_js.PublicKey(to),
      keys,
      data
    });

    let transaction = new solanaWeb3_js.Transaction({ feePayer: new solanaWeb3_js.PublicKey(from) });
    transaction.add(instruction);

    let result;
    try{
      const provider = await getProvider('solana');
      result = await provider.simulateTransaction(transaction);
    } catch (error) {
      console.log(error);
    }

    return({
      logs: _optionalChain$1([result, 'optionalAccess', _ => _.value, 'optionalAccess', _2 => _2.logs])
    })
  };

  const getContractArguments = ({ contract, method, params })=>{
    let fragment = contract.interface.fragments.find((fragment) => {
      return fragment.name == method
    });

    if(params instanceof Array) {
      return params
    } else if (params instanceof Object) {
      return fragment.inputs.map((input) => {
        return params[input.name]
      })
    }
  };

  var estimateEVM = ({ provider, from, to, value, method, api, params }) => {
    if(typeof api == "undefined"){
      return provider.estimateGas({ from, to, value })
    } else {
      let contract = new ethers.ethers.Contract(to, api, provider);
      let contractMethod = contract.estimateGas[method];
      let contractArguments = getContractArguments({ contract, method, params });
      if(contractArguments) {
        return contractMethod(...contractArguments, { from, value })
      } else {
        return contractMethod({ from, value })
      }
    }
  };

  function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let getCacheStore = () => {
    if (getWindow()._cacheStore == undefined) {
      resetCache();
    }
    return getWindow()._cacheStore
  };

  let getPromiseStore = () => {
    if (getWindow()._promiseStore == undefined) {
      resetCache();
    }
    return getWindow()._promiseStore
  };

  let resetCache = () => {
    getWindow()._cacheStore = {};
    getWindow()._promiseStore = {};
    getWindow()._clientProviders = {};
  };

  let set = function ({ key, value, expires }) {
    getCacheStore()[key] = {
      expiresAt: Date.now() + expires,
      value,
    };
  };

  let get = function ({ key, expires }) {
    let cachedEntry = getCacheStore()[key];
    if (_optionalChain([cachedEntry, 'optionalAccess', _ => _.expiresAt]) > Date.now()) {
      return cachedEntry.value
    }
  };

  let getPromise = function({ key }) {
    return getPromiseStore()[key]
  };

  let setPromise = function({ key, promise }) {
    getPromiseStore()[key] = promise;
    return promise
  };

  let deletePromise = function({ key }) {
    getPromiseStore()[key] = undefined; 
  };

  let cache = function ({ call, key, expires = 0 }) {
    return new Promise((resolve, reject)=>{
      let value;
      key = JSON.stringify(key);
      
      // get existing promise (of a previous pending request asking for the exact same thing)
      let existingPromise = getPromise({ key });
      if(existingPromise) { 
        return existingPromise
          .then(resolve)
          .catch(reject)
      }

      setPromise({ key, promise: new Promise((resolveQueue, rejectQueue)=>{
        if (expires === 0) {
          return call()
            .then((value)=>{
              resolve(value);
              resolveQueue(value);
            })
            .catch((error)=>{
              reject(error);
              rejectQueue(error);
            })
        }
        
        // get cached value
        value = get({ key, expires });
        if (value) {
          resolve(value);
          resolveQueue(value);
          return value
        }

        // set new cache value
        call()
          .then((value)=>{
            if (value) {
              set({ key, value, expires });
            }
            resolve(value);
            resolveQueue(value);
          })
          .catch((error)=>{
            reject(error);
            rejectQueue(error);
          });
        })
      }).then(()=>{
        deletePromise({ key });
      }).catch(()=>{
        deletePromise({ key });
      });
    })
  };

  let estimate = async function ({ blockchain, from, to, value, method, api, params, cache: cache$1 }) {
    if(!supported.includes(blockchain)) { throw 'Unknown blockchain: ' + blockchain }
    if(typeof value == 'undefined') { value = '0'; }

    const provider = await getProvider(blockchain);
    
    return await cache({
      expires: cache$1 || 0,
      key: [blockchain, from, to, value, method, params],
      call: async()=>estimateEVM({ provider, from, to, value, method, api, params })
    })
  };

  let accountInfo = async ({ address, api, method, params, provider, block }) => {
    const info = await provider.getAccountInfo(new solanaWeb3_js.PublicKey(address));
    return api.decode(info.data)
  };

  let balance = ({ address, provider }) => {
    return provider.getBalance(new solanaWeb3_js.PublicKey(address))
  };

  var requestSolana = async ({ blockchain, address, api, method, params, block }) => {
    const provider = await Solana.getProvider(blockchain);

    if(method == undefined || method === 'getAccountInfo') {
      if(api == undefined) { 
        api = solanaWeb3_js.ACCOUNT_LAYOUT; 
      }
      return accountInfo({ address, api, method, params, provider, block })
    } else if(method === 'getProgramAccounts') {
      return provider.getProgramAccounts(new solanaWeb3_js.PublicKey(address), params).then((accounts)=>{
        if(api){
          return accounts.map((account)=>{
            account.data = api.decode(account.account.data);
            return account
          })
        } else {
          return accounts
        }
      })
    } else if(method === 'getTokenAccountBalance') {
      return provider.getTokenAccountBalance(new solanaWeb3_js.PublicKey(address))
    } else if (method === 'latestBlockNumber') {
      return provider.getBlockHeight()  
    } else if (method === 'balance') {
      return balance({ address, provider })
    }
  };

  var parseUrl = (url) => {
    if (typeof url == 'object') {
      return url
    }
    let deconstructed = url.match(/(?<blockchain>\w+):\/\/(?<part1>[\w\d]+)(\/(?<part2>[\w\d]+)*)?/);

    if(deconstructed.groups.part2 == undefined) {
      if(deconstructed.groups.part1.match(/\d/)) {
        return {
          blockchain: deconstructed.groups.blockchain,
          address: deconstructed.groups.part1
        }
      } else {
        return {
          blockchain: deconstructed.groups.blockchain,
          method: deconstructed.groups.part1
        }
      }
    } else {
      return {
        blockchain: deconstructed.groups.blockchain,
        address: deconstructed.groups.part1,
        method: deconstructed.groups.part2
      }
    }
  };

  let request = async function (url, options) {
    let { blockchain, address, method } = parseUrl(url);
    let { api, params, cache: cache$1, block } = (typeof(url) == 'object' ? url : options) || {};

    return await cache({
      expires: cache$1 || 0,
      key: [blockchain, address, method, params, block],
      call: async()=>{
        if(supported.evm.includes(blockchain)) ; else if(supported.solana.includes(blockchain)) {


          return requestSolana({ blockchain, address, api, method, params, block })


        } else {
          throw 'Unknown blockchain: ' + blockchain
        }  
      }
    })
  };

  exports.estimate = estimate;
  exports.getProvider = getProvider;
  exports.request = request;
  exports.resetCache = resetCache;
  exports.setProvider = setProvider;
  exports.setProviderEndpoints = setProviderEndpoints;
  exports.simulate = simulate;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
