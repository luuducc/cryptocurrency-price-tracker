const asyncWrapper = fn => async (req, res, next) => {
  try {
    await fn(req, res, next)
  } catch (err) {
    console.log('err here', err)
    res.status(500).json({ err })
  }
}

module.exports = asyncWrapper