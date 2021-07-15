import ethers, { ethers as ethers$1 } from 'ethers';
import { getWallet } from 'depay-crypto-wallets';

function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }let cacheStore = {};

let resetCache = () => {
  cacheStore = {};
};

let set = function ({ key, value, expires }) {
  cacheStore[key] = {
    expiresAt: Date.now() + expires,
    value,
  };
};

let get = function ({ key, expires }) {
  let cachedEntry = cacheStore[key];
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

function _optionalChain$1(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
let account, provider;

async function ethereumProvider () {
  let newAccount;

  if (_optionalChain$1([window, 'optionalAccess', _ => _.ethereum])) {
    newAccount = await getWallet().account();
  }

  if (provider && newAccount === account) {
    return provider
  }
  account = newAccount;

  if (account) {
    provider = await new ethers.providers.Web3Provider(window.ethereum);
  } else {
    provider = await new ethers.providers.JsonRpcProvider(
      ['https://mainnet.infu', 'ra.io/v3/9aa3d95b3bc440fa8', '8ea12eaa4456161'].join(''),
    );
  }

  return provider
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
  let contract = new ethers.Contract(address, api, provider);
  let args = paramsToContractArgs({ contract, method, params });
  return contract[method](...args)
};

let balance = ({ address, provider }) => {
  return provider.getBalance(address)
};

var requestEthereum = async ({ address, api, method, params }) => {
  let provider = await ethereumProvider();

  if (api) {
    return contractCall({ address, api, method, params, provider })
  } else if (method === 'balance') {
    return balance({ address, provider })
  }
};

var parseUrl = (url) => {
  let deconstructed = url.match(/(?<blockchain>\w+):\/\/(?<address>[\w\d]+)\/(?<method>[\w\d]+)/);
  return deconstructed.groups
};

let request = async function (url, options) {
  let { blockchain, address, method } = parseUrl(url);
  let { api, params, cache: cache$1 } = options || {};
  return await cache({
    expires: cache$1 || 0,
    key: [blockchain, address, method, params],
    call: () => {
      switch (blockchain) {
        case 'ethereum':
          return requestEthereum({ address, api, method, params })

        default:
          throw 'Unknown blockchain: ' + blockchain
      }
    },
  })
};

let estimate = async ({ address, method, api, params, value }) => {
  let account = await getWallet().account();
  if (!account) {
    throw 'No wallet connected!'
  }

  let provider = new ethers$1.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();

  let contract = new ethers$1.Contract(address, api, provider);
  let args = paramsToContractArgs({ contract, method, params });
  return contract.connect(signer).estimateGas[method](...args)
};

let request$1 = async function (url, options) {
  let { blockchain, address, method } = parseUrl(url);
  let { api, params, value } = options || {};
  switch (blockchain) {
    case 'ethereum':
      return estimate({ address, method, api, params, value })

    default:
      throw 'Unknown blockchain: ' + blockchain
  }
};

async function provider$1 (blockchain) {
  switch (blockchain) {
    case 'ethereum':
      return await ethereumProvider()
    default:
      throw 'Unknown blockchain: ' + blockchain
  }
}

export { request$1 as estimate, provider$1 as provider, request, resetCache };
