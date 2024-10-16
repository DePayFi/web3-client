import { Connection } from '@depay/solana-web3.js'
import { getConfiguration } from '../../configuration'

const BATCH_INTERVAL = 10
const CHUNK_SIZE = 50
const MAX_RETRY = 10

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

  handleError(error, attempt, chunk) {
    if(attempt < MAX_RETRY) {
      const index = this._endpoints.indexOf(this._endpoint)+1
      this._endpoint = index >= this._endpoints.length ? this._endpoints[0] : this._endpoints[index]
      this._provider = new Connection(this._endpoint)
      this.requestChunk(chunk, attempt+1)
    } else {
      chunk.forEach((inflightRequest) => {
        inflightRequest.reject(error)
      })
    }
  }

  batchRequest(requests, attempt) {
    return new Promise((resolve, reject) => {
      if (requests.length === 0) resolve([]) // Do nothing if requests is empty

      const batch = requests.map(params => {
        return this._rpcClient.request(params.methodName, params.args)
      })

      fetch(
        this._endpoint,
        {
          method: 'POST',
          body: JSON.stringify(batch),
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(10000)  // 10-second timeout
        }
      ).then((response)=>{
        if(response.ok) {
          response.json().then((parsedJson)=>{
            if(parsedJson.find((entry)=>entry?.error)) {
              if(attempt < MAX_RETRY) {
                reject('Error in batch found!')
              } else {
                resolve(parsedJson);
              }
            } else {
              resolve(parsedJson);
            }
          }).catch(reject)
        } else {
          reject(`${response.status} ${response.text}`)
        }
      }).catch(reject)
    })
  }

  requestChunk(chunk, attempt) {

    const batch = chunk.map((inflight) => inflight.request)

    try {
      return this.batchRequest(batch, attempt)
        .then((result) => {
          chunk.forEach((inflightRequest, index) => {
            const payload = result[index]
            if (payload?.error) {
              const error = new Error(payload.error.message)
              error.code = payload.error.code
              error.data = payload.error.data
              inflightRequest.reject(error)
            } else if(payload) {
              inflightRequest.resolve(payload)
            } else {
              inflightRequest.reject()
            }
          })
        }).catch((error)=>this.handleError(error, attempt, chunk))
    } catch (error){ return this.handleError(error, attempt, chunk) }
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
          return this.requestChunk(chunk, 1)
        })
      }, getConfiguration().batchInterval || BATCH_INTERVAL)
    }

    return promise
  }
}

export default StaticJsonRpcSequentialProvider
