const { knex } = require('../../../utils/database')
const signupSchema = require('../../validation/signup')
const jwt = require('jsonwebtoken')
const VerificationEmail = require('../../mail/VerificationEmail')
const bcrypt = require('bcryptjs')

class RegisterController {

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async store(req, res) {
    let errors = {}
    let valid = false

    await signupSchema.validate({
      first_name: req.body.first_name?.trim(),
      last_name: req.body.last_name?.trim(),
      email: req.body.email?.trim(),
      password: req.body.password?.trim(),
      password_confirmation: req.body.password_confirmation?.trim(),
    }, { abortEarly: false })
      .then(() => valid = true)
      .catch((err) => {
        err.inner.map((inn) => errors[inn.path] = inn.errors)
      })

    if (!valid) return res.status(400).json({ errors: errors, message: 'Validation errors' }) 

    const data = {
      first_name: req.body.first_name.trim(),
      last_name: req.body.last_name?.trim(),
      email: req.body.email.trim(),
      password: bcrypt.hashSync(req.body.password, 12)
    }

    let id = null
    
    // create user
    await knex('users').insert(data)
      .then((res) => id = res[0])
      .catch((err) => {
        logger.log(err)
        return res.status(500).json({ error: err.message })
      })

    // create verification token
    const verificationToken = jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })

    await (new VerificationEmail(verificationToken, { id })).queue(data.email)

    const user = await knex('users')
      .select([ 'id', 'email', 'first_name', 'last_name', 'verified_at', 'deleted_at', 'created_at', 'updated_at' ])
      .where('id', id)
      .first()
      .then((res) => res)

    // sign jwt tokens
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 })
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' })

    return res.json({ id: id, message: 'Successfully registered', accessToken, refreshToken })
  }
}

module.exports = new RegisterController