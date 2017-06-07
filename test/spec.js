const t = require('tap')
const sinon = require('sinon')
const subject = require('../')
const fixture = require('./fixture')

const noop = () => {}

t.test('Express Request Mock', (t) => {
  t.test('interface', (t) => {
    t.test('when imported', (t) => {
      // type assertion fails when given Function
      // <https://github.com/tapjs/node-tap/issues/354>
      t.type(subject, 'function', 'provides a function')
      t.type(subject(noop), Promise, 'that returns a promise')
      t.end()
    })

    t.test('when called with a method', (t) => {
      const stub = sinon.stub()

      subject(stub)

      t.ok(stub.calledOnce, 'it calls the method')
      t.ok(
        stub.calledWithMatch(
          sinon.match.object,
          sinon.match.object,
          sinon.match.func
        ),
        'with the request, response and fallthrough function'
      )

      t.end()
    })

    t.test('when called without a method', (t) => {
      t.throws(subject, TypeError, 'it throws a type error')
      t.end()
    })

    t.test('when given options', (t) => {
      const stub = sinon.stub()
      const query = { search: true }

      subject(stub, { query })

      t.ok(
        stub.calledWithMatch(
          sinon.match.has('query', query),
          sinon.match.object,
          sinon.match.func
        ),
        'the mocks are created with the options'
      )

      t.end()
    })

    t.test('when given decorators', (t) => {
      const stub = sinon.stub()
      const locals = { authorized: true }

      subject(stub, undefined, { locals })

      t.ok(
        stub.calledWithMatch(
          sinon.match.has('locals', locals),
          sinon.match.has('locals', locals),
          sinon.match.func
        ),
        'the mocks are assigned the decorators'
      )

      t.end()
    })

    t.end()
  })

  t.test('when the promise is resolved', (t) => {
    t.test('by the end event being emitted (sync)', (t) => {
      const options = { params: { case: 'ok-sync' } }

      return subject(fixture, options).then((props) => {
        t.type(props.req, Object, 'it provides the request object')
        t.type(props.res, Object, 'and the response object')
        t.end()
      })
    })

    t.test('by the end event being emitted (async)', (t) => {
      const options = { params: { case: 'ok-async' } }

      return subject(fixture, options).then((props) => {
        t.type(props.req, Object, 'it provides the request object')
        t.type(props.res, Object, 'and the response object')
        t.end()
      })
    })

    t.test('by the fallthrough function being called', (t) => {
      const options = { params: { case: 'ok-next' } }

      return subject(fixture, options).then((props) => {
        t.equal(props, undefined, 'it does not provide any arguments')
      })
    })

    t.test('by the fallthrough function being called with a bypass command', (t) => {
      const options = { params: { case: 'ok-bypass' } }

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
        .then(() => t.fail('the promise should not resolve'))
        .catch((err) => t.equal(err.message, 'next', 'it passes the error along'))
    })

    t.test('by the code under test throwing an error', (t) => {
      const options = { params: { case: 'fail-throws' } }

      return subject(fixture, options)
        .then(() => t.fail('the promise should not resolve'))
        .catch((err) => t.equal(err.message, 'throws', 'it passes the error along'))
    })

    t.end()
  })

  t.end()
})
