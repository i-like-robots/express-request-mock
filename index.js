const sinon = require('sinon')
const { createMocks } = require('node-mocks-http')
const { EventEmitter: eventEmitter } = require('events')

const createHttpRequest = (options = {}) => {
  const props = createMocks(options, { eventEmitter })

  // Emit end event if fallthrough function is called
  const next = sinon.spy(() => props.res.emit('end'))

  return Object.assign({}, props, { next })
}

const expressRequestMock = (action, options) => {
  if (typeof action !== 'function') {
    throw new TypeError('action must be a function')
  }

  const { req, res, next } = createHttpRequest(options)

  return new Promise((resolve, reject) => {
    res.on('end', () => resolve({ req, res, next }))

    try {
      action(req, res, next)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = expressRequestMock
