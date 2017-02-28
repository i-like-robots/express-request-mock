const t = require('tap')
const sinon = require('sinon')
const subject = require('../')
const fixture = require('./fixture')

const noop = () => {}

t.test('Express Request Mock', (t) => {
  t.test('interface', (t) => {
    // type assertion fails when given Function
    // <https://github.com/tapjs/node-tap/issues/354>
    t.type(subject, 'function', 'exports a function')
    t.equal(subject.length, 2, 'that accepts two arguments')
    t.type(subject(noop), Promise, 'and returns a promise')
    t.end()
  })

  t.test('when given a method', (t) => {
    const stub = sinon.stub()

    subject(stub)

    // it calls the method with the request, response and fallthrough function spy
    sinon.assert.calledOnce(stub)
    sinon.assert.calledWithMatch(stub, Object, Object, Function)

    t.end()
  })

  t.test('when not given a method', (t) => {
    t.throws(subject, TypeError, 'it throws a type error')
    t.end()
  })

  t.test('resolves with request, response and fallthrough function spy', (t) => {
    const options = { params: { case: 'sync' } }

    return subject(fixture, options).then(({ req, res, next }) => {
      t.type(req, Object, 'it returns the request')
      t.type(res, Object, 'it returns the response')
      t.type(next, 'function', 'it returns the fallthrough function spy')

      t.end()
    })
  })

  t.test('resolves the returned promise when the end event is emitted (sync)', (t) => {
    const options = { params: { case: 'sync' } }

    return subject(fixture, options).then(({ res }) => {
      t.equal(res.statusCode, 200)
      t.end()
    })
  })

  t.test('resolves the returned promise when the end event is emitted (async)', (t) => {
    const options = { params: { case: 'async' } }

    return subject(fixture, options).then(({ res }) => {
      t.equal(res.statusCode, 200)
      t.end()
    })
  })

  t.test('resolves the returned promise when the fallthrough function is called', (t) => {
    const options = { params: { case: 'next' } }

    return subject(fixture, options).then(({ res }) => {
      t.equal(res.statusCode, 200)
      t.end()
    })
  })

  t.test('rejects the returned promise if the code under test throws', (t) => {
    const options = { params: { case: 'throws' } }

    return subject(fixture, options)
      .then(() => t.fail())
      .catch((err) => t.type(err, Error, 'and passes the error along'))
  })

  t.end()
})
