# Express Request Mock

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/i-like-robots/express-request-mock/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/i-like-robots/express-request-mock.svg?branch=master)](https://travis-ci.org/i-like-robots/express-request-mock) [![Coverage Status](https://coveralls.io/repos/github/i-like-robots/express-request-mock/badge.svg?branch=master)](https://coveralls.io/github/i-like-robots/express-request-mock) [![npm version](https://img.shields.io/npm/v/express-request-mock.svg?style=flat)](https://www.npmjs.com/package/express-request-mock) [![Greenkeeper badge](https://badges.greenkeeper.io/i-like-robots/express-request-mock.svg)](https://greenkeeper.io/)

A convenient wrapper for [node-mocks-http][1] which makes testing Express controllers and middleware easy.

```js
const expressRequestMock = require('express-request-mock')
const subject = require('../../controllers/animals')

it('returns a 200 response', async () => {
  const { res } = await expressRequestMock(subject, options)
  expect(res.statusCode).to.equal(200)
})
```

[1]: https://github.com/howardabrams/node-mocks-http

## Installation

This is a [Node.js][node] module available through the [npm][npm] registry. Before installing, download and install Node.js. Node.js 8 or higher is required.

Installation is done using the [npm install][install] command:

```sh
$ npm install -D express-request-mock
```

[node]: https://nodejs.org/en/
[npm]: https://www.npmjs.com/
[install]: https://docs.npmjs.com/getting-started/installing-npm-packages-locally

## Usage

First include the module in your test:

```js
const expressRequestMock = require('express-request-mock')
```

The module provides one function which accepts up to three arguments:

1. The route handler to test (a function which accepts a request, response, and optional fallthrough function.)
2. An optional options object for `createRequest` (the options for which are [documented here][2].)
3. An optional object with properties to append to the request and response objects (which can be useful when mocking middleware.)

[2]: https://github.com/howardabrams/node-mocks-http#createrequest

```js
const subject = require('../../controllers/animals')
const options = { query: { species: 'dog' } }
const decorators = { authorized: true }
const request = expressRequestMock(subject, options, decorators)
```

The function returns a promise which will _resolve_ either when the response is ended or the fallthrough function (`next()`) is called. The promise will _reject_ if either the underlying code throws an error or the fallthrough function is called with an error.

The promise will resolve to an object with the following keys:

1. `req`: The request object created by `createRequest`
2. `res`: The response object created by `createResponse`

```js
request.then(({ req, res }) => {
  // write assertions!
})
```

## Example

Below is an example using `express-request-mock` to test a controller along with [Mocha] and [Chai] (but it also works just as well with Jest, Tap, or Jasmine!):

[Mocha]: https://mochajs.org/
[Chai]: http://chaijs.com/


```js
const { expect } = require('chai')
const expressRequestMock = require('express-request-mock')
const subject = require('../../controllers/animals')

describe('Controllers - Animals', () => {
  context('when a valid species is requested', () => {
    const options = { query: { species: 'dog' } }

    it('returns a 200 response', async () => {
      const { res } = await expressRequestMock(subject, options)
      expect(res.statusCode).to.equal(200)
    })
  })

  context('when a non-existant species is requested', () => {
    const options = { query: { species: 'unicorn' } }

    it('returns a 404 response', async () => {
      const { res } =  await expressRequestMock(subject, options)
      expect(res.statusCode).to.equal(404)
    })
  })

  context('when an error happens', () => {
    const options = { query: {} }

    it('calls the fallthrough function with the error', async () => {
      try {
        await expressRequestMock(subject, options)
      } catch (error) {
        expect(error.name).to.equal('NoSpeciesProvided')
      }
    })
  })
})
```

## License

express-request-mock is MIT licensed.
