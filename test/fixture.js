module.exports = function (req, res, next) {
  switch (req.params.case) {
    case 'ok-sync':
      res.send('OK!')
      break

    case 'ok-async':
      process.nextTick(() => res.send('OK!'))
      break

    case 'ok-next':
      next()
      break

    case 'ok-bypass':
      next('route')
      break

    case 'fail-next':
      next(new Error('next'))
      break

    case 'fail-throws':
      // IIFE because the linter will complain otherwise =/
      throw new Error('throws')
  }
}
