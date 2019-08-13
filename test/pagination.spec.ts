import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import ApiClient from '../src/index'

const mock = new MockAdapter(axios)

const api = new ApiClient({
  pagination: {
    size: 1,
    totals: true,
    type: 'offset',
  },
})

afterEach(() => {
  mock.reset()
})

describe('get', () => {
  it('should set limit to 1', async done => {
    expect.assertions(1)

    mock.onGet('/articles').reply(config => {
      if (typeof config.paramsSerializer === 'function') {
        expect(config.paramsSerializer({ page: 1 })).toEqual(
          'page%5Btotals%5D=true&page%5Boffset%5D=0&page%5Blimit%5D=1',
        )
      }

      return [200]
    })

    try {
      await api.get('articles')
      done()
    } catch (err) {
      done.fail(err)
    }
  })
})
