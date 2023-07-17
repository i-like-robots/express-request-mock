const { describe, it, mock } = require('node:test')
const assert = require('node:assert')
const subject = require('./')

const isRequest = (obj) => {
  const props = ['method', 'url', 'path', 'query']
  return props.every((prop) => Object.prototype.hasOwnProperty.call(obj, prop))
}

const isResponse = (obj) => {
  const props = ['statusCode', 'statusMessage', 'send', 'end']
  return props.every((prop) => Object.prototype.hasOwnProperty.call(obj, prop))
}

describe('Express Request Mock', () => {
  describe('when called with a method', () => {
    it('calls the method once', () => {
      const stub = mock.fn()

      subject(stub)

      assert.equal(stub.mock.calls.length, 1)
    })

    it('calls the method with the request, response and fallthrough function', () => {
      const stub = mock.fn()

      subject(stub)

      const [req, res, next] = stub.mock.calls[0].arguments

      assert.ok(isRequest(req))
      assert.ok(isResponse(res))
      assert.ok(next instanceof Function)
    })
  })

  describe('when called without a method', () => {
    it('throws a type error', () => {
      assert.throws(subject, TypeError)
    })
  })

  describe('when given options', () => {
    it('creates mocks using the options', () => {
      const stub = mock.fn()
      const query = { search: true }

      subject(stub, { query })

      const [request] = stub.mock.calls[0].arguments

      assert.deepStrictEqual(request.query, query)
    })
  })

  describe('when given decorators', () => {
    it('assigns the decorators to the mocks', () => {
      const stub = mock.fn()
      const locals = { authorized: true }

      subject(stub, undefined, { locals })

      const [request] = stub.mock.calls[0].arguments

      assert.deepStrictEqual(request.locals, locals)
    })
  })

  describe('when the promise is resolved', () => {
    describe('by the end event being emitted (sync)', () => {
      it('returns the request and response objects', async () => {
        const fixture = (_, res) => res.send('OK!')
        const { req, res } = await subject(fixture)

        assert.ok(isRequest(req))
        assert.ok(isResponse(res))
      })
    })

    describe('by the end event being emitted (async)', () => {
      it('returns the request and response objects', async () => {
        const fixture = (_, res) => process.nextTick(() => res.send('OK!'))
        const { req, res } = await subject(fixture)

        assert.ok(isRequest(req))
        assert.ok(isResponse(res))
      })
    })

    describe('by the fallthrough function being called', () => {
      it('returns the request and response objects', async () => {
        const fixture = (_req, _res, next) => next()
        const { req, res } = await subject(fixture)

        assert.ok(isRequest(req))
        assert.ok(isResponse(res))
      })
    })

    describe('by the fallthrough function being called with a bypass command', async () => {
      it('returns the request and response objects', async () => {
        const fixture = (_req, _res, next) => next('route')
        const { req, res } = await subject(fixture)

        assert.ok(isRequest(req))
        assert.ok(isResponse(res))
      })
    })
  })

  describe('when the promise is rejected', () => {
    describe('by the fallthrough function being called with an error', () => {
      it('rejects with the error', async () => {
        const fixture = (_req, _res, next) => next(new Error('oh no!'))

        await assert.rejects(() => subject(fixture), {
          name: 'Error',
          message: 'oh no!',
        })
      })
    })

    describe('by the code under test throwing an error', () => {
      it('rejects with the error', async () => {
        const fixture = () => {
          throw new Error('oh no!')
        }

        await assert.rejects(() => subject(fixture), {
          name: 'Error',
          message: 'oh no!',
        })
      })
    })
  })
})
