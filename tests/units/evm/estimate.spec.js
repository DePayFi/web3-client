import { estimate, provider, resetCache } from 'src/'
import { mock, resetMocks } from '@depay/web3-mock'
import { supported } from 'src/blockchains'

describe('estimate', () => {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      const api = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
      beforeEach(resetMocks)
      beforeEach(resetCache)
      beforeEach(()=>mock({ blockchain, provider: provider(blockchain), accounts: { return: accounts } }))

      it('estimates a contract transaction', async ()=> {
        let mockedGas = '200'
        let mockedEstimate = mock({
          blockchain,
          estimate: {
            api,
            from: accounts[0],
            to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
            method: 'transfer',
            params: { recipient: '0x08B277154218CCF3380CAE48d630DA13462E3950', amount: '100000000000000000' },
            return: mockedGas
          }
        })

        let gas = await estimate({
          blockchain,
          from: accounts[0],
          to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
          method: 'transfer',
          params: { recipient: '0x08B277154218CCF3380CAE48d630DA13462E3950', amount: '100000000000000000' },
          api
        })

        expect(mockedEstimate).toHaveBeenCalled()
        expect(gas.toString()).toEqual('200')
      })

      it('estimates a simple transfer', async ()=> {
        let mockedGas = '200'
        let mockedEstimate = mock({
          blockchain,
          estimate: {
            from: accounts[0],
            to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
            value: '100000000000000000',
            return: mockedGas
          }
        })

        let gas = await estimate({
          blockchain,
          from: accounts[0],
          to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
          value: '100000000000000000'
        })

        expect(mockedEstimate).toHaveBeenCalled()
        expect(gas.toString()).toEqual('200')
      })
    })
  })
})
