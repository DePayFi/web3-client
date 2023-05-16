import { Connection } from '@depay/solana-web3.js'
import { getConfiguration } from '../../configuration'

const BATCH_INTERVAL = 10
const CHUNK_SIZE = 99

class StaticJsonRpcSequentialProvider extends Connection {

  constructor(url, network, endpoints, failover) {
    super(url)
    this._provider = new Connection(url)
    this._network = network
    this._endpoint = url
    this._endpoints = endpoints
    this._failover = failover
    this._pendingBatch = []
    this._rpcRequest = this._rpcRequestReplacement.bind(this)
  }

  requestChunk(chunk) {

    const batch = chunk.map((inflight) => inflight.request)

    const handleError = (error)=>{
      if(error && [
        'Failed to fetch', 'limit reached', '504', '503', '502', '500', '429', '426', '422', '413', '409', '408', '406', '405', '404', '403', '402', '401', '400'
      ].some((errorType)=>error.toString().match(errorType))) {
        const index = this._endpoints.indexOf(this._endpoint)+1
        this._endpoint = index >= this._endpoints.length ? this._endpoints[0] : this._endpoints[index]
        this._provider = new Connection(this._endpoint)
        this.requestChunk(chunk)
      } else {
        chunk.forEach((inflightRequest) => {
          inflightRequest.reject(error)
        })
      }
    }

    try {
      return this._provider._rpcBatchRequest(batch)
        .then((result) => {
          // For each result, feed it to the correct Promise, depending
          // on whether it was a success or error
          chunk.forEach((inflightRequest, index) => {
            const payload = result[index]
            if (payload.error) {
              const error = new Error(payload.error.message)
              error.code = payload.error.code
              error.data = payload.error.data
              inflightRequest.reject(error)
            } else {
              inflightRequest.resolve(payload)
            }
          })
        }).catch(handleError)
    } catch (error){ return handleError(error) }
  }
    
  _rpcRequestReplacement(methodName, args) {

    const request = { methodName, args }

    if (this._pendingBatch == null) {
      this._pendingBatch = []
    }

    const inflightRequest = { request, resolve: null, reject: null }

    const promise = new Promise((resolve, reject) => {
      inflightRequest.resolve = resolve
      inflightRequest.reject = reject
    })

    this._pendingBatch.push(inflightRequest)

    if (!this._pendingBatchAggregator) {
      // Schedule batch for next event loop + short duration
      this._pendingBatchAggregator = setTimeout(() => {
        // Get the current batch and clear it, so new requests
        // go into the next batch
        const batch = this._pendingBatch
        this._pendingBatch = []
        this._pendingBatchAggregator = null
        // Prepare Chunks of CHUNK_SIZE
        const chunks = []
        for (let i = 0; i < Math.ceil(batch.length / CHUNK_SIZE); i++) {
          chunks[i] = batch.slice(i*CHUNK_SIZE, (i+1)*CHUNK_SIZE)
        }
        chunks.forEach((chunk)=>{
          // Get the request as an array of requests
          const request = chunk.map((inflight) => inflight.request)
          return this.requestChunk(chunk)
        })
      }, getConfiguration().batchInterval || BATCH_INTERVAL)
    }

    return promise
  }
}

export default StaticJsonRpcSequentialProvider
