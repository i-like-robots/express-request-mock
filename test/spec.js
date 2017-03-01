const t = require('tap')
const sinon = require('sinon')
const subject = require('../')
const fixture = require('./fixture')

const noop = () => {}

t.test('Express Request Mock', (t) => {
  t.test('the interface', (t) => {
    t.test('when imported', (t) => {
      // type assertion fails when given Function
      // <https://github.com/tapjs/node-tap/issues/354>
      t.type(subject, 'function', 'exports a function')
      t.type(subject(noop), Promise, 'and returns a promise')
      t.end()
    })

    t.test('when called with a method', (t) => {
      const stub = sinon.stub()

      subject(stub)

      // it calls the method with the request, response and fallthrough function
      sinon.assert.calledOnce(stub)
      sinon.assert.calledWithMatch(stub, Object, Object, Function)

      t.end()
    })

    t.test('when called without a method', (t) => {
      t.throws(subject, TypeError, 'it throws a type error')
      t.end()
    })

    t.end()
  })

  t.test('when the promise is resolved', (t) => {
    t.test('it resolves with', (t) => {
      const options = { params: { case: 'ok-sync' } }

      return subject(fixture, options).then((props) => {
        t.type(props.req, Object, 'the request object')
        t.type(props.res, Object, 'the response object')

        t.end()
      })
    })

    t.test('by the end event being emitted (sync)', (t) => {
      const options = { params: { case: 'ok-sync' } }

      return subject(fixture, options).then((props) => {
        t.equal(Object.keys(props).length, 2, 'it provides the request and response objects')
        t.end()
      })
    })

    t.test('by the end event being emitted (async)', (t) => {
      const options = { params: { case: 'ok-async' } }

      return subject(fixture, options).then((props) => {
        t.equal(Object.keys(props).length, 2, 'it provides the request and response objects')
        t.end()
      })
    })

    t.test('by the fallthrough function being called', (t) => {
      const options = { params: { case: 'ok-next' } }

      return subject(fixture, options).then(() => {
        t.pass('it does not provide any arguments')
      })
    })

    t.end()
  })

  t.test('when the promise is rejected', (t) => {
    t.test('by the fallthrough function being called with an error', (t) => {
      const options = { params: { case: 'fail-next' } }

      return subject(fixture, options)
        .then(() => t.fail())
        .catch((err) => t.type(err, 'NextError', 'and passes the error along'))
    })

    t.test('by the code under test throwing an error', (t) => {
      const options = { params: { case: 'fail-throws' } }

      return subject(fixture, options)
        .then(() => t.fail())
        .catch((err) => t.type(err, 'ThrowsError', 'and passes the error along'))
    })

    t.end()
  })

  t.end()
})
