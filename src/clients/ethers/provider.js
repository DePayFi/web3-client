import { Blockchain } from '@depay/web3-blockchains'
import { fetchJson } from "@ethersproject/web"
import { JsonRpcBatchProvider } from '@ethersproject/providers'

const BATCH_INTERVAL = 10

class StaticJsonRpcBatchProvider extends JsonRpcBatchProvider {

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
          // Get teh current batch and clear it, so new requests
          // go into the next batch
          const batch = this._pendingBatch;
          this._pendingBatch = null;
          this._pendingBatchAggregator = null;
          // Get the request as an array of requests
          const request = batch.map((inflight) => inflight.request);
          return fetchJson(this.connection, JSON.stringify(request)).then((result) => {
            // For each result, feed it to the correct Promise, depending
            // on whether it was a success or error
            batch.forEach((inflightRequest, index) => {
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
            batch.forEach((inflightRequest) => {
              inflightRequest.reject(error);
            });
          });
        }, BATCH_INTERVAL);
    }
    return promise;
  }
}

export default StaticJsonRpcBatchProvider
