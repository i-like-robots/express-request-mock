module.exports = function (req, res, next) {
  switch (req.params.case) {
    case 'sync':
      res.send('OK!')
      break

    case 'async':
      process.nextTick(() => res.send('OK!'))
      break

    case 'error':
      res.status(406).end()
      break

    case 'next':
      next()
      break

    case 'throws':
      // IIFE because the linter will complain otherwise =/
      (() => { throw new Error('Something bad happened!') })()
      break
  }
}
