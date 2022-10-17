import { Buffer, TransactionInstruction, PublicKey, Transaction } from '@depay/solana-web3.js'
import { getProvider } from './provider'
import { supported } from './blockchains'

let simulate = async function ({ blockchain, from, to, keys, api, params }) {
  if(!supported.solana.includes(blockchain)) { throw `${blockchain} not supported for simulation!` }

  const data = Buffer.alloc(api.span)
  api.encode(params, data)

  keys = keys.map((key)=>{
    return({...key,
      pubkey: new PublicKey(key.pubkey)
    })
  })

  const instruction = new TransactionInstruction({
    programId: new PublicKey(to),
    keys,
    data
  })

  let transaction = new Transaction({ feePayer: new PublicKey(from) })
  transaction.add(instruction)

  let result
  try{
    const provider = await getProvider('solana')
    result = await provider.simulateTransaction(transaction)
  } catch (error) {
    console.log(error)
  }

  return({
    logs: result?.value?.logs
  })
}

export default simulate
