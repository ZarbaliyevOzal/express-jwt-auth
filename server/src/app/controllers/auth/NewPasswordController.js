const { object, string, ref } = require('yup')
const { knex } = require('../../../utils/database')
const logger = require('../../../utils/logger')
const bcrypt = require('bcryptjs')

class NewPasswordController {
  async store(req, res) {
    const schema = object({
      token: string().required().label('Token'),
      password: string().required().min(6).max(12).label('Password'),
      password_confirmation: string().required().min(6).max(12)
        .oneOf([ ref('password') ], 'Password must match')
        .label('Password confirmation')
    })
    let valid = true
    let error = {}
    await schema.validate({
      token: req.params.token,
      password: req.body.password,
      password_confirmation: req.body.password_confirmation
    }, { abortEarly: false })
      .catch((err) => {
        err.inner.map((inn) => error[inn.path] = inn.errors)
        valid = false
      })

    if (!valid) return res.status(400).json({ errors: error, message: 'Validation error' })

    // find password reset record
    const passworReset = await knex('password_resets').where('token', req.params.token).first().then((resp) => resp)

    if (!passworReset) return res.status(400).json({ message: 'Invalid token or expired' })

    // find user
    const user = await knex('users').where('email', passworReset.email).first().then((resp) => resp)

    if (!user) return res.status(400).json({ message: 'User not found' })

    // token expires at
    const expires_at = (new Date(passworReset.created_at)).valueOf() + (1 * 60 * 60 * 1000)

    const is_token_expired = (new Date()).valueOf() > expires_at

    if (is_token_expired) res.status(400).json({ message: 'Invalid token or expired' })

    // update user password
    await knex('users').where('id', user.id)
      .update({ password: bcrypt.hashSync(req.body.password, 12) })
      .catch((err) => {
        logger.error(err.message)
      })

    return res.json({ message: 'Password was set successfully' })
  }
}

module.exports = new NewPasswordController