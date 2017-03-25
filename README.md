# Express Request Mock

![Build status](https://api.travis-ci.org/i-like-robots/express-request-mock.png) [![Coverage Status](https://coveralls.io/repos/github/i-like-robots/express-request-mock/badge.svg?branch=master)](https://coveralls.io/github/i-like-robots/express-request-mock)

A convenient wrapper for [node-mocks-http][1] to make testing Express controllers easy.

## Installation

```sh
$ npm install express-request-mock --save-dev
```

## Usage

First include the module in your tests:

```js
const expressRequestMock = require('express-request-mock')
```

The module provides one function which accepts two arguments:

1. The route handler function to test, which accepts a request and response object and (optional) fallthrough function.
2. An optional hash of options for `createRequest` (the options for which are [documented here][2]).

```js
const handler = require('../../controllers/animals')
const options = { params: { species: 'dog' } }
const request = expressRequestMock(handler, options)
```

The provided handler will be called and a promise returned. The promise will _resolve_ either when the response is ended or the fallthrough function called. The promise will reject if either the underlying code throws an error or fallthrough function is called with an error.

When the promise is resolved by the response ending it will provide an object with the following keys:

1. `req`: The request object created by `createRequest`
2. `res`: The response object created by `createResponse`

```js
request.then(({ req, res }) => {
  // write assertions!
})
```

## Example

Below is an example using `express-request-mock` to test a controller along with [Mocha][4] and [Chai][5]:

```js
const { expect } = require('chai')
const expressRequestMock = require('express-request-mock')
const handler = require('../../controllers/animals')

describe('Controllers - Animals', () => {
  context('when a species is requested', () => {
    const options = { params: { species: 'dog' } }

    it('returns a 200 response', () => (
      return expressRequestMock(handler, options).then(({ res }) => {
        expect(res.statusCode).to.equal(200)
      })
    ))
  })

  context('when a non-existant species is requested', () => {
    const options = { params: { species: 'unicorn' } }

    it('returns a 404 response', () => (
      return expressRequestMock(handler, options).then(({ res }) => {
        expect(res.statusCode).to.equal(404)
      })
    ))
  })

  context('when an error happens', () => {
    const options = { params: {} }

    it('falls through and passes the error along', () => (
      return expressRequestMock(handler, options).catch((err) => {
        expect(err.name).to.equal('NoSpeciesProvided')
      })
    ))
  })
})
```

[1]: https://github.com/howardabrams/node-mocks-http
[2]: https://github.com/howardabrams/node-mocks-http#createrequest
[3]: http://sinonjs.org/
[4]: https://mochajs.org/
[5]: http://chaijs.com/
