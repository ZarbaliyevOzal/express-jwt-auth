const { knex } = require('../../../utils/database')
const jwt = require('jsonwebtoken')

class VerifyEmailController {
  /**
   * 
   * @param {*} req 
   * @param {*} res 
   */
  async store(req, res) {
    const user = await knex('users').where('id', req.params.id).first().then(res)
    if (!user) res.status(404).json({ message: 'User not found' })
    // validate token
    jwt.verify(req.params.token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
      if (err) return res.status(401).json({ message: 'Invalid token' })
      if (data.id !== user.id) res.status(401).json({ message: 'Invalid token' })
      await knex('users').where('id', req.params.id)
        .update({ verified_at: new Date() })
      // return res.json({ message: 'Your account verified. Thanks' })
      return res.redirect('http://localhost:3000')
    })
  }
}

module.exports = new VerifyEmailController