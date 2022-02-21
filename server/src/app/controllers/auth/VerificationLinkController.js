const { knex } = require('../../../utils/database')
const VerificationEmail = require('../../mail/VerificationEmail')
const jwt = require('jsonwebtoken')

class VerificationLinkController {
  /**
   * resend verification link
   * @param {*} req 
   * @param {*} res 
   */
  async store(req, res) {
    const user = await knex('users').where('id', req.user.id).first().then(res)
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (user.verified_at) return res.status(400).json({ message: 'Email already verified' })
    const verificationToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
    await (new VerificationEmail(verificationToken, { id: user.id })).queue(user.email)
    return res.json({ message: 'Verification link was sent to your email address' })
  }
}

module.exports = new VerificationLinkController