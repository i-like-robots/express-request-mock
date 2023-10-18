# express-request-mock

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/i-like-robots/express-request-mock/blob/main/LICENSE)
![build status](https://github.com/i-like-robots/express-request-mock/actions/workflows/test.yml/badge.svg?branch=main) [![npm version](https://img.shields.io/npm/v/express-request-mock.svg?style=flat)](https://www.npmjs.com/package/express-request-mock)

A convenient wrapper for [node-mocks-http][1] which makes testing Express controllers and middleware easy.

```js
import requestMock from 'express-request-mock'
import handler from '../routes/animals'

it('returns a 200 response', async () => {
  const { response } = await requestMock(handler, options)
  expect(response.statusCode).toEqual(200)
})
```

[1]: https://github.com/howardabrams/node-mocks-http

## Installation

This is a [Node.js][node] module available through the [npm][npm] registry. Node.js 12 or higher is required.

```sh
$ npm install --save-dev express-request-mock
```

[node]: https://nodejs.org/en/
[npm]: https://www.npmjs.com/

## Usage

This package provides one function which accepts three arguments:

1. The route handler to test (a function which accepts a request, response, and optional fallthrough function.)
2. An options object for `createRequest` (the options are [documented here][2].)
3. An object containing extra properties to decorate to the request and response objects.

[2]: https://github.com/howardabrams/node-mocks-http#createrequest

The function returns a promise which will resolve when the response is ended or the fallthrough function (`next()`) is called. The promise will reject if the underlying code throws an error or the fallthrough function is called with an error.

When resolved the promise will to an object with the following keys:

1. `request`: The request object created by `createRequest`
2. `response`: The response object created by `createResponse`

Below is a complete example demonstrating the use of `express-request-mock` to test an Express route handler:

```js
import { describe, it } from 'node:test'
import assert from 'node:assert'
import requestMock from 'express-request-mock'
import handler from '../routes/animals'

describe('Controllers - Animals', () => {
  describe('when a valid species is requested', () => {
    const options = { query: { species: 'dog' } }

    it('returns a 200 response', async () => {
      const { response } = await requestMock(handler, options)
      assert.equal(response.statusCode, 200)
    })
  })

  describe('when a non-existent species is requested', () => {
    const options = { query: { species: 'unicorn' } }

    it('returns a 404 response', async () => {
      const { response } = await requestMock(handler, options)
      assert.equal(response.statusCode, 404)
    })
  })

  describe('when an invalid request is received', () => {
    const options = { query: {} }

    it('calls the fallthrough function with an error', async () => {
      const call = () => requestMock(handler, options)

      await assert.rejects(call, {
        name: 'NoSpeciesProvided',
        message: 'You must provide a species',
      })
    })
  })
})
```

## License

express-request-mock is MIT licensed.
