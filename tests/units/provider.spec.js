import { provider } from 'dist/cjs/index.js'
import { ethers } from 'ethers'
import { Web3Mock } from 'depay-web3mock'

describe('provider', () => {
  
  it('provides an RPC provider per default', async ()=> {
    let selectedProvider = await provider('ethereum');
    expect(
      !!Object.getPrototypeOf(selectedProvider).constructor.toString().match('JsonRpcProvider')
    ).toEqual(true)
  });

  it('provides a web3 wallet provider if wallet is connected', async ()=> {
    Web3Mock({ mocks: 'ethereum' });
    let selectedProvider = await provider('ethereum');
    expect(
      !!Object.getPrototypeOf(selectedProvider).constructor.toString().match('Web3Provider')
    ).toEqual(true)
  });

  it('switches from RPC to web3 wallet in case wallet connects in the meantime', async ()=> {
    let selectedProvider;
    
    global.ethereum = undefined // reset from previous test

    selectedProvider = await provider('ethereum');
    expect(
      !!Object.getPrototypeOf(selectedProvider).constructor.toString().match('JsonRpcProvider')
    ).toEqual(true)

    Web3Mock({ mocks: 'ethereum' });
    selectedProvider = await provider('ethereum');

    expect(
      !!Object.getPrototypeOf(selectedProvider).constructor.toString().match('Web3Provider')
    ).toEqual(true)    
  })
});
