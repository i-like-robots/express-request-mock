const { createMocks } = require('node-mocks-http')
const { EventEmitter: eventEmitter } = require('events')

const expressRequestMock = (handler, options = {}) => {
  if (typeof handler !== 'function') {
    throw new TypeError('fn must be a function')
  }

  const { req, res } = createMocks(options, { eventEmitter })

  return new Promise((resolve, reject) => {
    const next = (err) => {
      if (err && err instanceof Error) {
        reject(err)
      } else {
        resolve()
      }
    }

    const done = () => resolve({ req, res })

    res.on('end', done)

    try {
      handler(req, res, next)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = expressRequestMock
