import { Connection, Buffer, PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction, ACCOUNT_LAYOUT } from '@depay/solana-web3.js';
import Blockchains from '@depay/web3-blockchains';
import { ethers } from 'ethers';

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

const getConfiguration = () =>{
  if(getWindow()._Web3ClientConfiguration === undefined) {
    getWindow()._Web3ClientConfiguration = {};
  }
  return getWindow()._Web3ClientConfiguration
};

const setConfiguration = (configuration) =>{
  getWindow()._Web3ClientConfiguration = !!configuration ? configuration : {};
  return getWindow()._Web3ClientConfiguration
};

function _optionalChain$3(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
const BATCH_INTERVAL = 10;
const CHUNK_SIZE = 50;
const MAX_RETRY = 10;

class StaticJsonRpcSequentialProvider extends Connection {

  constructor(url, network, endpoints, failover) {
    super(url);
    this._provider = new Connection(url);
    this._network = network;
    this._endpoint = url;
    this._endpoints = endpoints;
    this._failover = failover;
    this._pendingBatch = [];
    this._rpcRequest = this._rpcRequestReplacement.bind(this);
  }

  handleError(error, attempt, chunk) {
    if(attempt < MAX_RETRY) {
      const index = this._endpoints.indexOf(this._endpoint)+1;
      this._endpoint = index >= this._endpoints.length ? this._endpoints[0] : this._endpoints[index];
      this._provider = new Connection(this._endpoint);
      this.requestChunk(chunk, attempt+1);
    } else {
      chunk.forEach((inflightRequest) => {
        inflightRequest.reject(error);
      });
    }
  }

  batchRequest(requests, attempt) {
    return new Promise((resolve, reject) => {
      if (requests.length === 0) resolve([]); // Do nothing if requests is empty

      const batch = requests.map(params => {
        return this._rpcClient.request(params.methodName, params.args)
      });

      fetch(
        this._endpoint,
        {
          method: 'POST',
          body: JSON.stringify(batch),
          headers: { 'Content-Type': 'application/json' },
          signal: _optionalChain$3([AbortSignal, 'optionalAccess', _ => _.timeout]) ? AbortSignal.timeout(60000) : undefined  // 60-second timeout
        }
      ).then((response)=>{
        if(response.ok) {
          response.json().then((parsedJson)=>{
            if(parsedJson.find((entry)=>_optionalChain$3([entry, 'optionalAccess', _2 => _2.error]))) {
              if(attempt < MAX_RETRY) {
                reject('Error in batch found!');
              } else {
                resolve(parsedJson);
              }
            } else {
              resolve(parsedJson);
            }
          }).catch(reject);
        } else {
          reject(`${response.status} ${response.text}`);
        }
      }).catch(reject);
    })
  }

  requestChunk(chunk, attempt) {

    const batch = chunk.map((inflight) => inflight.request);

    try {
      return this.batchRequest(batch, attempt)
        .then((result) => {
          chunk.forEach((inflightRequest, index) => {
            const payload = result[index];
            if (_optionalChain$3([payload, 'optionalAccess', _3 => _3.error])) {
              const error = new Error(payload.error.message);
              error.code = payload.error.code;
              error.data = payload.error.data;
              inflightRequest.reject(error);
            } else if(payload) {
              inflightRequest.resolve(payload);
            } else {
              inflightRequest.reject();
            }
          });
        }).catch((error)=>this.handleError(error, attempt, chunk))
    } catch (error){ return this.handleError(error, attempt, chunk) }
  }
    
  _rpcRequestReplacement(methodName, args) {

    const request = { methodName, args };

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
        this._pendingBatch = [];
        this._pendingBatchAggregator = null;
        // Prepare Chunks of CHUNK_SIZE
        const chunks = [];
        for (let i = 0; i < Math.ceil(batch.length / CHUNK_SIZE); i++) {
          chunks[i] = batch.slice(i*CHUNK_SIZE, (i+1)*CHUNK_SIZE);
        }
        chunks.forEach((chunk)=>{
          // Get the request as an array of requests
          chunk.map((inflight) => inflight.request);
          return this.requestChunk(chunk, 1)
        });
      }, getConfiguration().batchInterval || BATCH_INTERVAL);
    }

    return promise
  }
}

function _optionalChain$2(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
const getAllProviders = ()=> {
  if(getWindow()._Web3ClientProviders == undefined) {
    getWindow()._Web3ClientProviders = {};
  }
  return getWindow()._Web3ClientProviders
};

const setProvider$1 = (blockchain, provider)=> {
  if(provider == undefined) { return }
  if(getAllProviders()[blockchain] === undefined) { getAllProviders()[blockchain] = []; }
  const index = getAllProviders()[blockchain].indexOf(provider);
  if(index > -1) {
    getAllProviders()[blockchain].splice(index, 1);
  }
  getAllProviders()[blockchain].unshift(provider);
};

const setProviderEndpoints$1 = async (blockchain, endpoints, detectFastest = true)=> {
  
  getAllProviders()[blockchain] = endpoints.map((endpoint, index)=>
    new StaticJsonRpcSequentialProvider(endpoint, blockchain, endpoints, ()=>{
      if(getAllProviders()[blockchain].length === 1) {
        setProviderEndpoints$1(blockchain, endpoints, detectFastest);
      } else {
        getAllProviders()[blockchain].splice(index, 1);
      }
    })
  );

  let provider;
  let window = getWindow();

  if(
    window.fetch == undefined ||
    (typeof process != 'undefined' && process['env'] && process['env']['NODE_ENV'] == 'test') ||
    (typeof window.cy != 'undefined') ||
    detectFastest === false
  ) {
    provider = getAllProviders()[blockchain][0];
  } else {
    
    let responseTimes = await Promise.all(endpoints.map((endpoint)=>{
      return new Promise(async (resolve)=>{
        let timeout = 900;
        let before = new Date().getTime();
        setTimeout(()=>resolve(timeout), timeout);
        let response;
        try {
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            referrer: "",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({ method: 'getIdentity', id: 1, jsonrpc: '2.0' }),
            signal: _optionalChain$2([AbortSignal, 'optionalAccess', _ => _.timeout]) ? AbortSignal.timeout(60000) : undefined  // 60-second timeout
          });
        } catch (e) {}
        if(!_optionalChain$2([response, 'optionalAccess', _2 => _2.ok])) { return resolve(999) }
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
    await setProviderEndpoints$1(blockchain, Blockchains[blockchain].endpoints);
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
    await setProviderEndpoints$1(blockchain, Blockchains[blockchain].endpoints);
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
supported.svm = ['solana'];

function _optionalChain$1(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
let getCacheStore = () => {
  if (getWindow()._Web3ClientCacheStore == undefined) {
    getWindow()._Web3ClientCacheStore = {};
  }
  return getWindow()._Web3ClientCacheStore
};

let getPromiseStore = () => {
  if (getWindow()._Web3ClientPromiseStore == undefined) {
    getWindow()._Web3ClientPromiseStore = {};
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

// Periodically clean up expired cache entries (every 5 minutes), to prevent memory leaks
if (typeof process == 'undefined' || process.env && "production" === 'test') {
  setInterval(() => {
    const store = getCacheStore();
    const now = Date.now();
    for (const key in store) {
      if (store[key].expiresAt < now) {
        delete store[key];
      }
    }
  }, 10 * 60 * 1000); // 10 minutes in milliseconds
}

const getProvider = async (blockchain)=>{

  if(supported.evm.includes(blockchain)) ; else if(supported.svm.includes(blockchain)) {


    return await Solana.getProvider(blockchain)


  } else {
    throw 'Unknown blockchain: ' + blockchain
  }
};

const getProviders = async (blockchain)=>{

  if(supported.evm.includes(blockchain)) ; else if(supported.svm.includes(blockchain)) {


    return await Solana.getProviders(blockchain)


  } else {
    throw 'Unknown blockchain: ' + blockchain
  }
};

const setProvider = (blockchain, provider)=>{

  if(supported.evm.includes(blockchain)) ; else if(supported.svm.includes(blockchain)) {


    return Solana.setProvider(blockchain, provider)


  } else {
    throw 'Unknown blockchain: ' + blockchain
  }
};

const setProviderEndpoints = (blockchain, endpoints, detectFastest)=>{

  if(supported.evm.includes(blockchain)) ; else if(supported.svm.includes(blockchain)) {


    return Solana.setProviderEndpoints(blockchain, endpoints, detectFastest)


  } else {
    throw 'Unknown blockchain: ' + blockchain
  }
};

function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
let simulate = async function ({ blockchain, from, to, keys, api, params }) {
  if(!supported.svm.includes(blockchain)) { throw `${blockchain} not supported for simulation!` }

  const data = Buffer.alloc(api.span);
  api.encode(params, data);

  keys = keys.map((key)=>{
    return({...key,
      pubkey: new PublicKey(key.pubkey)
    })
  });

  const instruction = new TransactionInstruction({
    programId: new PublicKey(to),
    keys,
    data
  });

  const instructions = [];
  instructions.push(instruction);

  const messageV0 = new TransactionMessage({
    payerKey: new PublicKey(from),
    instructions,
  }).compileToV0Message();

  const transactionV0 = new VersionedTransaction(messageV0);

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

const findFragment = ({ fragments, method, params })=>{
  return fragments.find((fragment) => {
    return(
      fragment.name == method &&
      (fragment.inputs && params && typeof(params) === 'object' ? fragment.inputs.length == Object.keys(params).length : true)
    )
  })
};

const getContractArguments = ({ contract, method, params })=>{
  let fragment = findFragment({ fragments: contract.interface.fragments, method, params });

  if(params instanceof Array) {
    return params
  } else if (params instanceof Object) {
    return fragment.inputs.map((input) => {
      return params[input.name]
    })
  }
};

const tupleParamsToMethodSignature = (components) =>{
  return `(${
    components.map((component)=>{
      if(component.type === 'tuple') {
        return tupleParamsToMethodSignature(component.components)
      } else {
        return component.type 
      }
    }).join(',')
  })`
};

var estimateEVM = ({ provider, from, to, value, method, api, params }) => {
  if(typeof api == "undefined"){
    return provider.estimateGas({ from, to, value })
  } else {
    let contract = new ethers.Contract(to, api, provider);
    let fragment = findFragment({ fragments: contract.interface.fragments, method, params });
    let contractArguments = getContractArguments({ contract, method, params });
    if(contract[method] === undefined) {
      method = `${method}(${fragment.inputs.map((input)=>{
        if(input.type === 'tuple') {
          return tupleParamsToMethodSignature(input.components)
        } else {
          return input.type
        }
      }).join(',')})`;
    }
    let contractMethod = contract.estimateGas[method];
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
  const info = await provider.getAccountInfo(new PublicKey(address));
  if(!info || !info.data) { return }
  return api.decode(info.data)
};

const balance = ({ address, provider }) => {
  return provider.getBalance(new PublicKey(address))
};

const singleRequest = async({ blockchain, address, api, method, params, block, provider, providers })=> {

  try {

    if(method == undefined || method === 'getAccountInfo') {
      if(api == undefined) {
        api = ACCOUNT_LAYOUT; 
      }
      return await accountInfo({ address, api, method, params, provider, block })
    } else if(method === 'getProgramAccounts') {
      return await provider.getProgramAccounts(new PublicKey(address), params).then((accounts)=>{
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
      return await provider.getTokenAccountBalance(new PublicKey(address))
    } else if (method === 'latestBlockNumber') {
      return await provider.getSlot(params ? params : undefined)
    } else if (method === 'balance') {
      return await balance({ address, provider })
    }

  } catch (error){
    if(providers && error && [
      'Failed to fetch', 'limit reached', '504', '503', '502', '500', '429', '426', '422', '413', '409', '408', '406', '405', '404', '403', '402', '401', '400'
    ].some((errorType)=>error.toString().match(errorType))) {
      let nextProvider = providers[providers.indexOf(provider)+1] || providers[0];
      return singleRequest({ blockchain, address, api, method, params, block, provider: nextProvider, providers })
    } else {
      throw error
    }
  }
};

var requestSolana = async ({ blockchain, address, api, method, params, block, timeout, strategy }) => {

  strategy = strategy ? strategy : (getConfiguration().strategy || 'failover');
  timeout = timeout ? timeout : (getConfiguration().timeout || undefined);

  const providers = await Solana.getProviders(blockchain);

  if(strategy === 'fastest') {

    let allRequestsFailed = [];

    const allRequestsInParallel = providers.map((provider)=>{
      return new Promise((resolve)=>{
        allRequestsFailed.push(
          singleRequest({ blockchain, address, api, method, params, block, provider }).then(resolve)
        );
      })
    });
    
    const timeoutPromise = new Promise((_, reject)=>setTimeout(()=>{ reject(new Error("Web3ClientTimeout")); }, timeout || 60000)); // 60s default timeout

    allRequestsFailed = Promise.all(allRequestsFailed.map((request)=>{
      return new Promise((resolve)=>{ request.catch(resolve); })
    })).then(()=>{ return });

    return Promise.race([...allRequestsInParallel, timeoutPromise, allRequestsFailed])

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
  const { api, params, cache: cache$1, block, timeout, strategy, cacheKey } = (typeof(url) == 'object' ? url : options) || {};

  return await cache({
    expires: cache$1 || 0,
    key: cacheKey || [blockchain, address, method, params, block],
    call: async()=>{
      if(supported.evm.includes(blockchain)) ; else if(supported.svm.includes(blockchain)) {


        return requestSolana({ blockchain, address, api, method, params, block, strategy, timeout })


      } else {
        throw 'Unknown blockchain: ' + blockchain
      }  
    }
  })
};

export { estimate, getProvider, getProviders, request, resetCache, setConfiguration, setProvider, setProviderEndpoints, simulate };
