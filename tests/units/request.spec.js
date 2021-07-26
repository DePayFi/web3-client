import { request } from 'src/'

describe('request contract data', () => {

  it('should reject the promise if the given blockchain is unknown', async ()=> {
    await expect(
      request('nonexisting://0x7a250d5630b4cf539739df2c5dacb4c659f2488d/getAmountsOut', {
        api: []
      })
    ).rejects.toEqual('Unknown blockchain: nonexisting')
  })
})
