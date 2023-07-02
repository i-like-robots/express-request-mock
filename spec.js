const { describe } = require('node:test')
const assert = require('node:assert')
const sinon = require('sinon')
const subject = require('./')

describe('Express Request Mock', () => {
  describe('when called with a method', () => {
    const stub = sinon.stub()

    subject(stub)

    assert.ok(stub.calledOnce, 'it calls the method')
    assert.ok(
      stub.calledWithMatch(sinon.match.object, sinon.match.object, sinon.match.func),
      'with the request, response and fallthrough function'
    )
  })

  describe('when called without a method', () => {
    assert.throws(subject, TypeError, 'it throws a type error')
  })

  describe('when given options', () => {
    const stub = sinon.stub()
    const query = { search: true }

    subject(stub, { query })

    assert.ok(
      stub.calledWithMatch(sinon.match.has('query', query), sinon.match.object, sinon.match.func),
      'the mocks are created using the options'
    )
  })

  describe('when given decorators', () => {
    const stub = sinon.stub()
    const locals = { authorized: true }

    subject(stub, undefined, { locals })

    assert.ok(
      stub.calledWithMatch(
        sinon.match.has('locals', locals),
        sinon.match.has('locals', locals),
        sinon.match.func
      ),
      'the mocks are assigned the decorators'
    )
  })
})

describe('when the promise is resolved', () => {
  describe('by the end event being emitted (sync)', async () => {
    const fixture = (_req, res) => res.send('OK!')
    const { req, res } = await subject(fixture)

    assert.ok(req, 'it provides the request object')
    assert.ok(res, 'it provides the response object')
  })

  describe('by the end event being emitted (async)', async () => {
    const fixture = (_req, res) => process.nextTick(() => res.send('OK!'))
    const { req, res } = await subject(fixture)

    assert.ok(req, 'it provides the request object')
    assert.ok(res, 'it provides response object')
  })

  describe('by the fallthrough function being called', async () => {
    const fixture = (_req, _res, next) => next()
    const { req, res } = await subject(fixture)

    assert.ok(req, 'it provides the request object')
    assert.ok(res, 'it provides response object')
  })

  describe('by the fallthrough function being called with a bypass command', async () => {
    const fixture = (_req, _res, next) => next('route')
    const { req, res } = await subject(fixture)

    assert.ok(req, 'it provides the request object')
    assert.ok(res, 'it provides response object')
  })
})

describe('when the promise is rejected', () => {
  describe('by the fallthrough function being called with an error', async () => {
    const fixture = (_req, _res, next) => next(new Error('oh no!'))

    await assert.rejects(() => subject(fixture), {
      name: 'Error',
      message: 'oh no!',
    })
  })

  describe('by the code under test throwing an error', async () => {
    const fixture = () => {
      throw new Error('oh no!')
    }

    await assert.rejects(() => subject(fixture), {
      name: 'Error',
      message: 'oh no!',
    })
  })
})
