const jwt = require('jsonwebtoken')
const { knex } = require('../../../utils/database')

class TokenController {
  /**
   * 
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async store(req, res) {
    const refreshToken = req.body.token
    if (!refreshToken) return res.sendStatus(401)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, data) => {
      if (err) return res.sendStatus(401)
      const user = await knex('users')
        .select([ 'id', 'email', 'first_name', 'last_name', 'verified_at', 'deleted_at', 'created_at', 'updated_at' ])
        .where('id', data.id)
        .first()
        .then((res) => res)
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 })
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' })
      return res.json({ accessToken, refreshToken })
    })
  }
}

module.exports = new TokenController