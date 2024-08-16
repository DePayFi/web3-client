import Blockchains from '@depay/web3-blockchains'
import { ethers } from 'ethers'
import { getConfiguration } from '../../configuration'

const BATCH_INTERVAL = 10
const CHUNK_SIZE = 99
const MAX_RETRY = 5

class StaticJsonRpcBatchProvider extends ethers.providers.JsonRpcProvider {

  constructor(url, network, endpoints, failover) {
    super(url)
    this._network = network
    this._endpoint = url
    this._endpoints = endpoints
    this._failover = failover
    this._pendingBatch = []
  }

  detectNetwork() {
    return Promise.resolve(Blockchains.findByName(this._network).id)
  }

  requestChunk(chunk, endpoint, attempt) {

    try {

      const request = chunk.map((inflight) => inflight.request)
      return ethers.utils.fetchJson(endpoint, JSON.stringify(request))
        .then((result) => {
          // For each result, feed it to the correct Promise, depending
          // on whether it was a success or error
          chunk.forEach((inflightRequest, index) => {
            const payload = result[index]
            if (payload?.error) {
              const error = new Error(payload.error.message)
              error.code = payload.error.code
              error.data = payload.error.data
              inflightRequest.reject(error)
            } else if(payload?.result) {
              inflightRequest.resolve(payload.result)
            } else {
              inflightRequest.reject()
            }
          })
        }).catch((error) => {
          if(attempt < MAX_RETRY && error && error.code == 'SERVER_ERROR') {
            const index = this._endpoints.indexOf(this._endpoint)+1
            this._failover()
            this._endpoint = index >= this._endpoints.length ? this._endpoints[0] : this._endpoints[index]
            this.requestChunk(chunk, this._endpoint, attempt+1)
          } else {
            chunk.forEach((inflightRequest) => {
              inflightRequest.reject(error)
            })
          }
        })

    } catch {

      chunk.forEach((inflightRequest) => {
        inflightRequest.reject()
      })
    }
  }
    
  send(method, params) {

    const request = {
      method: method,
      params: params,
      id: (this._nextId++),
      jsonrpc: "2.0"
    }

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
          return this.requestChunk(chunk, this._endpoint, 1)
        })
      }, getConfiguration().batchInterval || BATCH_INTERVAL)
    }

    return promise
  }

}

export default StaticJsonRpcBatchProvider
