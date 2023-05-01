import { Connection } from '@depay/solana-web3.js'

class StaticJsonRpcSequentialProvider extends Connection {

  constructor(url, network, endpoints, failover) {
    super(url)
    this._network = network
    this._endpoint = url
    this._endpoints = endpoints
    this._failover = failover
  }
}

export default StaticJsonRpcSequentialProvider
