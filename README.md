Stop relying on connected wallets when fetching data for dApps.

This JavaScript library abstracts calls to blockchains by either:

- using the connected wallet RPC (if the wallet is actually connected)
- fallback to an official RPC in case no wallet is connected

This allows you e.g. to fetch and display blockchain data in your Apps without any connected wallet
and potentially hand off actual transactions to another device (e.g. mobile) and postpone the requirement to actually
connect a wallet until it's necessary (e.g. to sign transactions).

## Quickstart

```
yarn add depay-blockchain-call
```

or 

```
npm install --save depay-blockchain-call
```

```javascript
import { call } from 'depay-blockchain-call'


```



## Development

### Get started

```
yarn install
yarn start
```

### Release

```
npm publish
```
