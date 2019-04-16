const { createMocks } = require('node-mocks-http')
const { EventEmitter } = require('events')

const expressRequestMock = (callback, options = {}, decorators = {}) => {
  if (typeof callback !== 'function') {
    throw new TypeError('callback must be a function')
  }

  const { req, res } = createMocks(options, { eventEmitter: EventEmitter })

  // append extra properties to request and response, à la middleware
  Object.assign(req, decorators)
  Object.assign(res, decorators)

  return new Promise((resolve, reject) => {
    const done = () => resolve({ req, res, request: req, response: res })

    const next = (err) => {
      // Calling the fallthrough function with a string may be valid:-
      // 1. Calling with 'route' will skip any remaining route callbacks
      // 2. Calling with 'router' will exit the router and 404
      const isBypass = typeof err === 'string' && /^router?$/.test(err)

      if (err && !isBypass) {
        reject(err)
      } else {
        done()
      }
    }

    res.on('end', done)

    callback(req, res, next)
  })
}

module.exports = expressRequestMock
