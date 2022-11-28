import { Connection } from '@depay/solana-web3.js'

class StaticJsonRpcSequentialProvider extends Connection {

  constructor(url, network, endpoints) {
    super(url)
    this._network = network
    this._endpoint = url
    this._endpoints = endpoints
  }
}

export default StaticJsonRpcSequentialProvider
