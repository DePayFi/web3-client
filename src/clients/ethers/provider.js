import { Blockchain } from '@depay/web3-blockchains'
import { ethers } from 'ethers'

const BATCH_INTERVAL = 10
const CHUNK_SIZE = 99

class StaticJsonRpcBatchProvider extends ethers.providers.JsonRpcProvider {

    constructor(url, network) {
      super(url)
      this._network = network
    }

    detectNetwork() {
      return Promise.resolve(Blockchain.findByName(this._network).id)
    }
    
    send(method, params) {
      const request = {
        method: method,
        params: params,
        id: (this._nextId++),
        jsonrpc: "2.0"
      };
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
          this._pendingBatch = null;
          this._pendingBatchAggregator = null;
          // Prepare Chunks of CHUNK_SIZE
          const chunks = []
          for (let i = 0; i < Math.ceil(batch.length / CHUNK_SIZE); i++) {
            chunks[i] = batch.slice(i*CHUNK_SIZE, (i+1)*CHUNK_SIZE);
          }
          chunks.forEach((chunk)=>{
            // Get the request as an array of requests
            const request = chunk.map((inflight) => inflight.request);
            return ethers.utils.fetchJson(this.connection, JSON.stringify(request)).then((result) => {
              // For each result, feed it to the correct Promise, depending
              // on whether it was a success or error
              chunk.forEach((inflightRequest, index) => {
                const payload = result[index];
                if (payload.error) {
                  const error = new Error(payload.error.message);
                  error.code = payload.error.code;
                  error.data = payload.error.data;
                  inflightRequest.reject(error);
                }
                else {
                  inflightRequest.resolve(payload.result);
                }
              });
            }, (error) => {
              chunk.forEach((inflightRequest) => {
                inflightRequest.reject(error);
              });
            });
          })
        }, BATCH_INTERVAL);
    }
    return promise;
  }
}

export default StaticJsonRpcBatchProvider
