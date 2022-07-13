import { Connection } from '@depay/solana-web3.js'

class StaticJsonRpcSequentialProvider extends Connection {

  constructor(url, network) {
    super(url)
    this._network = network
  }
}

export default StaticJsonRpcSequentialProvider
