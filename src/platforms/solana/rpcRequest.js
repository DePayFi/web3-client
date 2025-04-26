import Solana from './provider'
import { getConfiguration } from '../../configuration'

const singleRequest = async({ blockchain, request, providers })=> {
  console.log('not implemented yet', request, provider)
}

export default async ({ blockchain, request, timeout, strategy }) => {

  strategy = strategy ? strategy : (getConfiguration().strategy || 'failover')
  timeout = timeout ? timeout : (getConfiguration().timeout || undefined)

  const providers = await Solana.getProviders(blockchain)

  if(strategy === 'fastest') {

    let allRequestsFailed = []

    const allRequestsInParallel = providers.map((provider)=>{
      return new Promise((resolve)=>{
        allRequestsFailed.push(
          singleRequest({ blockchain, address, api, method, params, block, provider }).then(resolve)
        )
      })
    })
    
    const timeoutPromise = new Promise((_, reject)=>setTimeout(()=>{ reject(new Error("Web3ClientTimeout")) }, timeout || 60000)) // 60s default timeout

    allRequestsFailed = Promise.all(allRequestsFailed.map((request)=>{
      return new Promise((resolve)=>{ request.catch(resolve) })
    })).then(()=>{ return })

    return Promise.race([...allRequestsInParallel, timeoutPromise, allRequestsFailed])

  } else { // failover

    const provider = await Solana.getProvider(blockchain)
    const _request = singleRequest({ blockchain, address, api, method, params, block, provider, providers })

    if(timeout) {
      timeout = new Promise((_, reject)=>setTimeout(()=>{ reject(new Error("Web3ClientTimeout")) }, timeout))
      return Promise.race([_request, timeout])
    } else {
      return _request
    }
  }
}
