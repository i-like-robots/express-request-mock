# Express Request Mock

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

The module exposes one function that accepts two arguments:

1. Your controller method under test which accepts a request and response object and (optional) fallthrough function.
2. An optional hash of options for `createRequest` (the options for which are [documented here][2]).

```js
const animals = require('../../controllers/animals')
const options = { params: { species: 'dog' } }
const request = expressRequestMock(animals, options)
```

The function will call the given controller method and return a promise. The promise will resolve with an obect containing the following keys:

1. `req`: The request object created by `createRequest`
2. `res`: The response object created by `createResponse`
3. `next`: A [Sinon][3] spy for the Express fallthrough function

```js
request.then(({ req, res, next }) => {
  // write assertions
})
```

## Example

Below is an example using `express-request-mock` to test a controller along with [Mocha][4] and [Chai][5]:

```js
const { expect } = require('chai')
const expressRequestMock = require('express-request-mock')
const animals = require('../../controllers/animals')

describe('Controllers - Animals', () => {
  context('when a species is requested', () => {
    const options = { params: { species: 'dog' } }

    it('returns a 200 response', () => (
      expressRequestMock(animals, options).then(({ res }) => {
        expect(res.statusCode).to.equal(200)
      })
    ))
  })

  context('when a non-existant species is requested', () => {
    const options = { params: { species: 'unicorn' } }

    it('returns a 404 response', () => (
      expressRequestMock(animals, options).then(({ res }) => {
        expect(res.statusCode).to.equal(404)
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
