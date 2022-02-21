const jwt = require('jsonwebtoken')

class TokenController {
  /**
   * 
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  store(req, res) {
    const refreshToken = req.body.token
    if (!refreshToken) return res.sendStatus(401)
    // if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(401)
      const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 })
      const refreshToken = jwt.sign({email: user.email}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' })
      return res.json({ accessToken, refreshToken })
    })
  }
}

module.exports = new TokenController