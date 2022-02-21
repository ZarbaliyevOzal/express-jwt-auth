const { knex } = require('../../../utils/database')
const validate = require('../../validation/passwordResetLink')
const crypto = require('crypto')
const logger = require('../../../utils/logger')
const PasswordReset = require('../../mail/PasswordReset')

class PasswordResetLinkController {
  async store(req, res) {
    const { valid, errors } = await validate(req.body)
    if (!valid) return res.status(400).json({ errors: errors, message: 'Validation error' })
    const email = req.body.email.trim()
    
    const user = await knex('users').where('email', email).first().then((resp) => resp)
    if (!user) return res.json({ message: 'Password reset link was sent to email address' })
    
    // generate token
    const token = crypto.randomBytes(32).toString('hex')
    
    // store token
    await knex('password_resets').insert({ email: req.body.email.trim(), token })
      .then((resp) => resp[0])
      .catch((err) => {
        logger.error(err)
      })
    
    // send email
    await (new PasswordReset(token, req.body.email.trim())).queue(req.body.email.trim())

    return res.json({ 
      message: 'Password reset link was sent to email address',
      email 
    })
  }
}

module.exports = new PasswordResetLinkController