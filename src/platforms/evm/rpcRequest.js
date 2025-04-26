import EVM from './provider'
import { getConfiguration } from '../../configuration'

const singleRequest = ({ blockchain, request, provider }) =>{
  return provider.send(request.method, request.params)
}

export default async ({ blockchain, request, timeout, strategy }) => {

  strategy = strategy ? strategy : (getConfiguration().strategy || 'failover')
  timeout = timeout ? timeout : (getConfiguration().timeout || undefined)

  if(strategy === 'fastest') {

    const providers = await EVM.getProviders(blockchain)
    
    let allRequestsFailed = []

    const allRequestsInParallel = providers.map((provider)=>{
      return new Promise((resolve)=>{
        allRequestsFailed.push(
          singleRequest({ blockchain, request, provider }).then(resolve)
        )
      })
    })
    
    const timeoutPromise = new Promise((_, reject)=>setTimeout(()=>{ reject(new Error("Web3ClientTimeout")) }, timeout || 10000))

    allRequestsFailed = Promise.all(allRequestsFailed.map((request)=>{
      return new Promise((resolve)=>{ request.catch(resolve) })
    })).then(()=>{ return })

    return Promise.race([...allRequestsInParallel, timeoutPromise, allRequestsFailed])

  } else { // failover

    const provider = await EVM.getProvider(blockchain)
    const _request = singleRequest({ blockchain, request, provider })
    
    if(timeout) {
      timeout = new Promise((_, reject)=>setTimeout(()=>{ reject(new Error("Web3ClientTimeout")) }, timeout))
      return Promise.race([_request, timeout])
    } else {
      return _request
    }
  }
}
