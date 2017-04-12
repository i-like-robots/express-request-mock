const { createMocks } = require('node-mocks-http')
const { EventEmitter: eventEmitter } = require('events')

const expressRequestMock = (handler, options = {}) => {
  if (typeof handler !== 'function') {
    throw new TypeError('fn must be a function')
  }

  const { req, res } = createMocks(options, { eventEmitter })

  return new Promise((resolve, reject) => {
    const next = (err) => {
      // Calling the fallthrough function with a string may be valid:-
      // 1. Calling with 'route' will skip any remaining route callbacks
      // 2. Calling with 'router' will exit the router and 404
      const isBypass = typeof err === 'string' && /^router?$/.test(err)

      if (err && !isBypass) {
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
