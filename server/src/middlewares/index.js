const jwt = require('jsonwebtoken')

function auth(req, res, next) {
  const authorization = req.headers['authorization']
  const token = authorization && authorization.split(' ')[1]
  if (!token) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) return res.status(401).send(err)
    req.user = payload
    next()
  })
}

module.exports = {
  auth
}