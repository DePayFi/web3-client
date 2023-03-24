(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@depay/solana-web3.js'), require('@depay/web3-blockchains'), require('ethers')) :
  typeof define === 'function' && define.amd ? define(['exports', '@depay/solana-web3.js', '@depay/web3-blockchains', 'ethers'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Web3Client = {}, global.SolanaWeb3js, global.Web3Blockchains, global.ethers));
})(this, (function (exports, solanaWeb3_js, Blockchains, ethers) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Blockchains__default = /*#__PURE__*/_interopDefaultLegacy(Blockchains);

  const BATCH_INTERVAL = 10;
  const CHUNK_SIZE = 99;

  class StaticJsonRpcBatchProvider extends ethers.ethers.providers.JsonRpcProvider {

    constructor(url, network, endpoints) {
      super(url);
      this._network = network;
      this._endpoint = url;
      this._endpoints = endpoints;
    }

    detectNetwork() {
      return Promise.resolve(Blockchains__default["default"].findByName(this._network).id)
    }

    requestChunk(chunk, endpoint) {
      
      const request = chunk.map((inflight) => inflight.request);

      return ethers.ethers.utils.fetchJson(endpoint, JSON.stringify(request))
        .then((result) => {
          // For each result, feed it to the correct Promise, depending
          // on whether it was a success or error
          chunk.forEach((inflightRequest, index) => {
            const payload = result[index];
            if (payload.error) {
              const error = new Error(payload.error.message);
              error.code = payload.error.code;
              error.data = payload.error.data;
              inflightRequest.reject(error);
            }
            else {
              inflightRequest.resolve(payload.result);
            }
          });
        }).catch((error) => {
          if(error && error.code == 'SERVER_ERROR') {
            const index = this._endpoints.indexOf(this._endpoint)+1;
            this._endpoint = index >= this._endpoints.length ? this._endpoints[0] : this._endpoints[index];
            this.requestChunk(chunk, this._endpoint);
          } else {
            chunk.forEach((inflightRequest) => {
              inflightRequest.reject(error);
            });
          }
        })
    }
      
    send(method, params) {

      const request = {
        method: method,
        params: params,
        id: (this._nextId++),
        jsonrpc: "2.0"
      };

      if (this._pendingBatch == null) {
        this._pendingBatch = [];
      }

      const inflightRequest = { request, resolve: null, reject: null };

      const promise = new Promise((resolve, reject) => {
        inflightRequest.resolve = resolve;
        inflightRequest.reject = reject;
      });

      this._pendingBatch.push(inflightRequest);

      if (!this._pendingBatchAggregator) {
        // Schedule batch for next event loop + short duration
        this._pendingBatchAggregator = setTimeout(() => {
          // Get the current batch and clear it, so new requests
          // go into the next batch
          const batch = this._pendingBatch;
          this._pendingBatch = null;
          this._pendingBatchAggregator = null;
          // Prepare Chunks of CHUNK_SIZE
          const chunks = [];
          for (let i = 0; i < Math.ceil(batch.length / CHUNK_SIZE); i++) {
            chunks[i] = batch.slice(i*CHUNK_SIZE, (i+1)*CHUNK_SIZE);
          }
          chunks.forEach((chunk)=>{
            // Get the request as an array of requests
            chunk.map((inflight) => inflight.request);
            return this.requestChunk(chunk, this._endpoint)
          });
        }, BATCH_INTERVAL);
      }

      return promise
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

  // MAKE SURE PROVIDER SUPPORT BATCH SIZE OF 99 BATCH REQUESTS!
  const ENDPOINTS$1 = {
    ethereum: ['https://rpc.ankr.com/eth', 'https://eth.llamarpc.com', 'https://ethereum.publicnode.com'],
    bsc: ['https://bsc-dataseed.binance.org', 'https://bsc-dataseed1.ninicoin.io', 'https://bsc-dataseed3.defibit.io'],
    polygon: ['https://polygon-rpc.com', 'https://poly-rpc.gateway.pokt.network', 'https://matic-mainnet.chainstacklabs.com'],
    fantom: ['https://fantom.blockpi.network/v1/rpc/public', 'https://rpcapi.fantom.network', 'https://rpc.ftm.tools'],
    velas: ['https://velas-mainnet.rpcfast.com/?api_key=xbhWBI1Wkguk8SNMu1bvvLurPGLXmgwYeC4S6g2H7WdwFigZSmPWVZRxrskEQwIf', 'https://evmexplorer.velas.com/rpc', 'https://explorer.velas.com/rpc'],
  };

  const getProviders$1 = ()=> {
    if(getWindow()._clientProviders == undefined) {
      getWindow()._clientProviders = {};
    }
    return getWindow()._clientProviders
  };

  const setProvider$2 = (blockchain, provider)=> {
    getProviders$1()[blockchain] = provider;
  };

  const setProviderEndpoints$2 = async (blockchain, endpoints)=> {
    
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
            body: JSON.stringify({ method: 'net_version', id: 1, jsonrpc: '2.0' })
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
    
    setProvider$2(
      blockchain,
      new StaticJsonRpcBatchProvider(endpoint, blockchain, endpoints)
    );
  };

  const getProvider$2 = async (blockchain)=> {

    let providers = getProviders$1();
    if(providers && providers[blockchain]){ return providers[blockchain] }
    
    let window = getWindow();
    if(window._getProviderPromise && window._getProviderPromise[blockchain]) { return await window._getProviderPromise[blockchain] }

    if(!window._getProviderPromise){ window._getProviderPromise = {}; }
    window._getProviderPromise[blockchain] = new Promise(async(resolve)=> {
      await setProviderEndpoints$2(blockchain, ENDPOINTS$1[blockchain]);
      resolve(getWindow()._clientProviders[blockchain]);
    });

    return await window._getProviderPromise[blockchain]
  };

  var EVM = {
    getProvider: getProvider$2,
    setProviderEndpoints: setProviderEndpoints$2,
    setProvider: setProvider$2,
  };

  class StaticJsonRpcSequentialProvider extends solanaWeb3_js.Connection {

    constructor(url, network, endpoints) {
      super(url);
      this._network = network;
      this._endpoint = url;
      this._endpoints = endpoints;
    }
  }

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

  let supported = ['ethereum', 'bsc', 'polygon', 'solana', 'fantom', 'velas'];
  supported.evm = ['ethereum', 'bsc', 'polygon', 'fantom', 'velas'];
  supported.solana = ['solana'];

  function _optionalChain$1(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
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

    if(supported.evm.includes(blockchain)) {


      return await EVM.getProvider(blockchain)


    } else if(supported.solana.includes(blockchain)) {


      return await Solana.getProvider(blockchain)


    } else {
      throw 'Unknown blockchain: ' + blockchain
    }
  };

  const setProvider = (blockchain, provider)=>{

    resetCache();

    if(supported.evm.includes(blockchain)) {


      return EVM.setProvider(blockchain, provider)


    } else if(supported.solana.includes(blockchain)) {


      return Solana.setProvider(blockchain, provider)


    } else {
      throw 'Unknown blockchain: ' + blockchain
    }
  };

  const setProviderEndpoints = (blockchain, endpoints)=>{

    resetCache();

    if(supported.evm.includes(blockchain)) {


      return EVM.setProviderEndpoints(blockchain, endpoints)


    } else if(supported.solana.includes(blockchain)) {


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

  let paramsToContractArgs = ({ contract, method, params }) => {
    let fragment = contract.interface.fragments.find((fragment) => {
      return fragment.name == method
    });

    return fragment.inputs.map((input, index) => {
      if (Array.isArray(params)) {
        return params[index]
      } else {
        return params[input.name]
      }
    })
  };

  let contractCall = ({ address, api, method, params, provider, block }) => {
    let contract = new ethers.ethers.Contract(address, api, provider);
    let args = paramsToContractArgs({ contract, method, params });
    return contract[method](...args, { blockTag: block })
  };

  let balance$1 = ({ address, provider }) => {
    return provider.getBalance(address)
  };

  let transactionCount = ({ address, provider }) => {
    return provider.getTransactionCount(address)
  };

  var requestEVM = async ({ blockchain, address, api, method, params, block }) => {
    const provider = await EVM.getProvider(blockchain);
    
    if (api) {
      return contractCall({ address, api, method, params, provider, block })
    } else if (method === 'latestBlockNumber') {
      return provider.getBlockNumber()
    } else if (method === 'balance') {
      return balance$1({ address, provider })
    } else if (method === 'transactionCount') {
      return transactionCount({ address, provider })
    }
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
        if(supported.evm.includes(blockchain)) {


          return await requestEVM({ blockchain, address, api, method, params, block })


        } else if(supported.solana.includes(blockchain)) {


          return await requestSolana({ blockchain, address, api, method, params, block })


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
