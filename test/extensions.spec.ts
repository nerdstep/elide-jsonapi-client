import ApiClient from '../src/index'

const getMockAdapter = (cb: any) => (config: any) => {
  cb()
  if (config.error) return Promise.reject(config)
  return Promise.resolve(config)
}

describe('useThrottle', () => {
  it('should throttle requests', async done => {
    expect.assertions(4)

    const count = 10
    const threshold = 1000
    const promises = []
    const onSuccess = jest.fn()
    const adapterCb = jest.fn()
    const mockedAdapter = getMockAdapter(adapterCb)

    const api = new ApiClient({
      adapter: mockedAdapter,
      useThrottle: true,
      throttleThreshold: threshold,
    })

    const start = Date.now()

    for (let i = 0; i < count; i++) {
      promises.push(api.get('articles').then(onSuccess))
    }

    await Promise.all(promises)

    const end = Date.now()

    expect(promises.length).toBe(count)
    expect(onSuccess.mock.calls.length).toBe(count)
    expect(adapterCb.mock.calls.length).toBe(1)
    expect(end - start < threshold).toBe(true)

    done()
  })
})

describe('useCache', () => {
  it('should cache requests', async done => {
    expect.assertions(3)

    const count = 10
    const promises = []
    const onSuccess = jest.fn()
    const adapterCb = jest.fn()
    const mockedAdapter = getMockAdapter(adapterCb)

    const api = new ApiClient({
      adapter: mockedAdapter,
      useCache: true,
    })

    for (let i = 0; i < count; i++) {
      promises.push(api.get('articles').then(onSuccess))
    }

    await Promise.all(promises)

    expect(promises.length).toBe(count)
    expect(onSuccess.mock.calls.length).toBe(count)
    expect(adapterCb.mock.calls.length).toBe(1)

    done()
  })
})
