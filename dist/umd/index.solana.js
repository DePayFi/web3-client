(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@depay/solana-web3.js'), require('@depay/web3-blockchains'), require('ethers')) :
  typeof define === 'function' && define.amd ? define(['exports', '@depay/solana-web3.js', '@depay/web3-blockchains', 'ethers'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Web3Client = {}, global.SolanaWeb3js, global.Web3Blockchains, global.ethers));
})(this, (function (exports, solanaWeb3_js, Blockchains, ethers) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Blockchains__default = /*#__PURE__*/_interopDefaultLegacy(Blockchains);

  class StaticJsonRpcSequentialProvider extends solanaWeb3_js.Connection {

    constructor(url, network, endpoints, failover) {
      super(url);
      this._network = network;
      this._endpoint = url;
      this._endpoints = endpoints;
      this._failover = failover;
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

  const getAllProviders = ()=> {
    if(getWindow()._Web3ClientProviders == undefined) {
      getWindow()._Web3ClientProviders = {};
    }
    return getWindow()._Web3ClientProviders
  };

  const setProvider$1 = (blockchain, provider)=> {
    if(getAllProviders()[blockchain] === undefined) { getAllProviders()[blockchain] = []; }
    const index = getAllProviders()[blockchain].indexOf(provider);
    if(index > -1) {
      getAllProviders()[blockchain].splice(index, 1);
    }
    getAllProviders()[blockchain].unshift(provider);
  };

  const setProviderEndpoints$1 = async (blockchain, endpoints)=> {
    
    getAllProviders()[blockchain] = endpoints.map((endpoint, index)=>
      new StaticJsonRpcSequentialProvider(endpoint, blockchain, endpoints)
    );

    let provider;
    let window = getWindow();

    if(
      window.fetch == undefined ||
      (typeof process != 'undefined' && process['env'] && process['env']['NODE_ENV'] == 'test') ||
      (typeof window.cy != 'undefined')
    ) {
      provider = getAllProviders()[blockchain][0];
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
      provider = getAllProviders()[blockchain][fastestIndex];
    }
    
    setProvider$1(blockchain, provider);
  };

  const getProvider$1 = async (blockchain)=> {

    let providers = getAllProviders();
    if(providers && providers[blockchain]){ return providers[blockchain][0] }
    
    let window = getWindow();
    if(window._Web3ClientGetProviderPromise && window._Web3ClientGetProviderPromise[blockchain]) { return await window._Web3ClientGetProviderPromise[blockchain] }

    if(!window._Web3ClientGetProviderPromise){ window._Web3ClientGetProviderPromise = {}; }
    window._Web3ClientGetProviderPromise[blockchain] = new Promise(async(resolve)=> {
      await setProviderEndpoints$1(blockchain, Blockchains__default["default"][blockchain].endpoints);
      resolve(getWindow()._Web3ClientProviders[blockchain][0]);
    });

    return await window._Web3ClientGetProviderPromise[blockchain]
  };

  const getProviders$1 = async(blockchain)=>{

    let providers = getAllProviders();
    if(providers && providers[blockchain]){ return providers[blockchain] }
    
    let window = getWindow();
    if(window._Web3ClientGetProvidersPromise && window._Web3ClientGetProvidersPromise[blockchain]) { return await window._Web3ClientGetProvidersPromise[blockchain] }

    if(!window._Web3ClientGetProvidersPromise){ window._Web3ClientGetProvidersPromise = {}; }
    window._Web3ClientGetProvidersPromise[blockchain] = new Promise(async(resolve)=> {
      await setProviderEndpoints$1(blockchain, Blockchains__default["default"][blockchain].endpoints);
      resolve(getWindow()._Web3ClientProviders[blockchain]);
    });

    return await window._Web3ClientGetProvidersPromise[blockchain]
  };

  var Solana = {
    getProvider: getProvider$1,
    getProviders: getProviders$1,
    setProviderEndpoints: setProviderEndpoints$1,
    setProvider: setProvider$1,
  };

  let supported = ['solana'];
  supported.evm = [];
  supported.solana = ['solana'];

  function _optionalChain$1(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let getCacheStore = () => {
    if (getWindow()._Web3ClientCacheStore == undefined) {
      resetCache();
    }
    return getWindow()._Web3ClientCacheStore
  };

  let getPromiseStore = () => {
    if (getWindow()._Web3ClientPromiseStore == undefined) {
      resetCache();
    }
    return getWindow()._Web3ClientPromiseStore
  };

  let resetCache = () => {
    getWindow()._Web3ClientCacheStore = {};
    getWindow()._Web3ClientPromiseStore = {};
    getWindow()._Web3ClientProviders = {};
    getWindow()._Web3ClientGetProviderPromise = undefined;
  };

  let set = function ({ key, value, expires }) {
    getCacheStore()[key] = {
      expiresAt: Date.now() + expires,
      value,
    };
  };

  let get = function ({ key, expires }) {
    let cachedEntry = getCacheStore()[key];
    if (_optionalChain$1([cachedEntry, 'optionalAccess', _ => _.expiresAt]) > Date.now()) {
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

  const getProvider = async (blockchain)=>{

    if(supported.evm.includes(blockchain)) ; else if(supported.solana.includes(blockchain)) {


      return await Solana.getProvider(blockchain)


    } else {
      throw 'Unknown blockchain: ' + blockchain
    }
  };

  const getProviders = async (blockchain)=>{

    if(supported.evm.includes(blockchain)) ; else if(supported.solana.includes(blockchain)) {


      return await Solana.getProviders(blockchain)


    } else {
      throw 'Unknown blockchain: ' + blockchain
    }
  };

  const setProvider = (blockchain, provider)=>{

    resetCache();

    if(supported.evm.includes(blockchain)) ; else if(supported.solana.includes(blockchain)) {


      return Solana.setProvider(blockchain, provider)


    } else {
      throw 'Unknown blockchain: ' + blockchain
    }
  };

  const setProviderEndpoints = (blockchain, endpoints)=>{

    resetCache();

    if(supported.evm.includes(blockchain)) ; else if(supported.solana.includes(blockchain)) {


      return Solana.setProviderEndpoints(blockchain, endpoints)


    } else {
      throw 'Unknown blockchain: ' + blockchain
    }
  };

  function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
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

    const instructions = [];
    instructions.push(instruction);

    const messageV0 = new solanaWeb3_js.TransactionMessage({
      payerKey: new solanaWeb3_js.PublicKey(from),
      instructions,
    }).compileToV0Message();

    const transactionV0 = new solanaWeb3_js.VersionedTransaction(messageV0);

    let result;
    try{
      const provider = await getProvider('solana');
      result = await provider.simulateTransaction(transactionV0);
    } catch (error) {
      console.log(error);
    }

    return({
      logs: _optionalChain([result, 'optionalAccess', _ => _.value, 'optionalAccess', _2 => _2.logs])
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

  const accountInfo = async ({ address, api, method, params, provider, block }) => {
    const info = await provider.getAccountInfo(new solanaWeb3_js.PublicKey(address));
    return api.decode(info.data)
  };

  const balance = ({ address, provider }) => {
    return provider.getBalance(new solanaWeb3_js.PublicKey(address))
  };

  const singleRequest = async({ blockchain, address, api, method, params, block, provider, providers })=> {

    try {

      if(method == undefined || method === 'getAccountInfo') {
        if(api == undefined) {
          api = solanaWeb3_js.ACCOUNT_LAYOUT; 
        }
        return await accountInfo({ address, api, method, params, provider, block })
      } else if(method === 'getProgramAccounts') {
        return await provider.getProgramAccounts(new solanaWeb3_js.PublicKey(address), params).then((accounts)=>{
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
        return await provider.getTokenAccountBalance(new solanaWeb3_js.PublicKey(address))
      } else if (method === 'latestBlockNumber') {
        return await provider.getBlockHeight()  
      } else if (method === 'balance') {
        return await balance({ address, provider })
      }

    } catch (error){
      if(providers && error && [
        'Failed to fetch', '504', '503', '502', '500', '429', '426', '422', '413', '409', '408', '406', '405', '404', '403', '402', '401', '400'
      ].some((errorType)=>error.toString().match(errorType))) {
        let nextProvider = providers[providers.indexOf(provider)+1] || providers[0];
        return singleRequest({ blockchain, address, api, method, params, block, provider: nextProvider, providers })
      } else {
        throw error
      }
    }
  };

  var requestSolana = async ({ blockchain, address, api, method, params, block, timeout, strategy = 'fallback' }) => {

    const providers = await Solana.getProviders(blockchain);

    if(strategy === 'fastest') {

      return Promise.race(providers.map((provider)=>{

        const succeedingRequest = new Promise((resolve)=>{
          singleRequest({ blockchain, address, api, method, params, block, provider }).then(resolve);
        }); // failing requests are ignored during race/fastest
      
        const timeoutPromise = new Promise((_, reject)=>setTimeout(()=>{ reject(new Error("Web3ClientTimeout")); }, timeout || 10000));
          
        return Promise.race([succeedingRequest, timeoutPromise])
      }))
      
    } else { // failover

      const provider = await Solana.getProvider(blockchain);
      const request = singleRequest({ blockchain, address, api, method, params, block, provider, providers });

      if(timeout) {
        timeout = new Promise((_, reject)=>setTimeout(()=>{ reject(new Error("Web3ClientTimeout")); }, timeout));
        return Promise.race([request, timeout])
      } else {
        return request
      }
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

  const request = async function (url, options) {
    
    const { blockchain, address, method } = parseUrl(url);
    const { api, params, cache: cache$1, block, timeout, strategy } = (typeof(url) == 'object' ? url : options) || {};

    return await cache({
      expires: cache$1 || 0,
      key: [blockchain, address, method, params, block],
      call: async()=>{
        if(supported.evm.includes(blockchain)) ; else if(supported.solana.includes(blockchain)) {


          return requestSolana({ blockchain, address, api, method, params, block, strategy, timeout })


        } else {
          throw 'Unknown blockchain: ' + blockchain
        }  
      }
    })
  };

  exports.estimate = estimate;
  exports.getProvider = getProvider;
  exports.getProviders = getProviders;
  exports.request = request;
  exports.resetCache = resetCache;
  exports.setProvider = setProvider;
  exports.setProviderEndpoints = setProviderEndpoints;
  exports.simulate = simulate;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
