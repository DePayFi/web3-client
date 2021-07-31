'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ethers = require('ethers');
var depayWeb3Wallets = require('depay-web3-wallets');

function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }let getWindow = () => {
  if (typeof global == 'object') return global
  return window
};

let getCacheStore = () => {
  if (getWindow()._cacheStore == undefined) {
    resetCache();
  }
  return getWindow()._cacheStore
};

let resetCache = () => {
  getWindow()._cacheStore = {};
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

let cache = async function ({ call, key, expires = 0 }) {
  if (expires === 0) {
    return call()
  }

  let value;
  key = JSON.stringify(key);

  // get cached value
  value = get({ key, expires });
  if (value) {
    return value
  }

  // set new cache value
  value = await call();
  if (value) {
    set({ key, value, expires });
  }

  return value
};

async function ethereumProvider () {
  let wallet = depayWeb3Wallets.getWallet();
  let account = await wallet.account();

  if (account && await wallet.connectedTo('ethereum')) {
    return await new ethers.ethers.providers.Web3Provider(window.ethereum)
  } else {
    return await new ethers.ethers.providers.JsonRpcProvider(
      ['https://mainnet.infu', 'ra.io/v3/9aa3d95b3bc440fa8', '8ea12eaa4456161'].join(''),
    )
  }
}

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

let contractCall = ({ address, api, method, params, provider }) => {
  let contract = new ethers.ethers.Contract(address, api, provider);
  let args = paramsToContractArgs({ contract, method, params });
  return contract[method](...args)
};

let balance = ({ address, provider }) => {
  return provider.getBalance(address)
};

var request = async ({ provider, address, api, method, params }) => {
  if (api) {
    return contractCall({ address, api, method, params, provider })
  } else if (method === 'balance') {
    return balance({ address, provider })
  }
};

var requestEthereum = async ({ address, api, method, params }) => {
  let provider = await ethereumProvider();

  return request({
    provider,
    address,
    api,
    method,
    params
  })
};

async function bscProvider () {
  let wallet = depayWeb3Wallets.getWallet();
  let account = await wallet.account();

  if (account && await wallet.connectedTo('bsc')) {
    return await new ethers.ethers.providers.Web3Provider(window.ethereum)
  } else {
    return await new ethers.ethers.providers.JsonRpcProvider(
      'https://bsc-dataseed.binance.org'
    )
  }
}

var requestBsc = async ({ address, api, method, params }) => {
  let provider = await bscProvider();

  return request({
    provider,
    address,
    api,
    method,
    params
  })
};

var parseUrl = (url) => {
  if (typeof url == 'object') {
    return url
  }
  let deconstructed = url.match(/(?<blockchain>\w+):\/\/(?<address>[\w\d]+)\/(?<method>[\w\d]+)/);
  return deconstructed.groups
};

let request$1 = async function (url, options) {
  let { blockchain, address, method } = parseUrl(url);
  let { api, params, cache: cache$1 } = options || {};
  return await cache({
    expires: cache$1 || 0,
    key: [blockchain, address, method, params],
    call: () => {
      switch (blockchain) {

        case 'ethereum':
          return requestEthereum({ address, api, method, params })

        case 'bsc':
          return requestBsc({ address, api, method, params })

        default:
          throw 'Unknown blockchain: ' + blockchain
      }
    },
  })
};

let estimate = async ({ externalProvider, address, method, api, params, value }) => {
  let account = await depayWeb3Wallets.getWallet().account();
  if (!account) {
    throw 'No wallet connected!'
  }

  let provider = new ethers.ethers.providers.Web3Provider(externalProvider);
  let signer = provider.getSigner();

  let contract = new ethers.ethers.Contract(address, api, provider);
  let args = paramsToContractArgs({ contract, method, params });
  return contract.connect(signer).estimateGas[method](...args)
};

var estimateEthereum = async ({ address, method, api, params, value }) => {
  return estimate({
    externalProvider: window.ethereum,
    address,
    method,
    api,
    params,
    value
  })
};

var estimateBsc = async ({ address, method, api, params, value }) => {
  return estimate({
    externalProvider: window.ethereum,
    address,
    method,
    api,
    params,
    value
  })
};

let request$2 = async function (url, options) {
  let { blockchain, address, method } = parseUrl(url);
  let { api, params, value } = options || {};
  switch (blockchain) {
    
    case 'ethereum':
      return estimateEthereum({ address, method, api, params, value })

    case 'bsc':
      return estimateBsc({ address, method, api, params, value })

    default:
      throw 'Unknown blockchain: ' + blockchain
  }
};

async function provider (blockchain) {
  switch (blockchain) {
    
    case 'ethereum':
      return await ethereumProvider()

    case 'bsc':
      return await bscProvider()
    
    default:
      throw 'Unknown blockchain: ' + blockchain
  }
}

exports.estimate = request$2;
exports.provider = provider;
exports.request = request$1;
exports.resetCache = resetCache;
