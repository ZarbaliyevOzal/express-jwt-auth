const { object, string } = require('yup')
const { knex } = require('../../../utils/database')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

class LoginController {
  
  /**
   * 
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async store(req, res) {
    const schema = object({
      email: string().email().required(),
      password: string().required()
    })
    let errors = {}
    let valid = false
    await schema.validate({ email: req.body.email?.trim(), password: req.body.password })
      .then(() => valid = true)
      .catch((err) => err.inner.map((inn) => errors[inn.path] = inn.errors))

    if (!valid) return res.status(400).json({ errors: errors })

    const user = await knex('users').where('email', req.body.email.trim()).first().then(res)

    if (!user) return res.status(400).json({ message: 'Email or password wrong' })

    if (!bcrypt.compare(req.body.password, user.password)) 
      return res.status(400).json({ message: 'Email or password wrong' })

    const payload = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      verified_at: user.verified_at,
      deleted_at: user.deleted_at,
      created_at: user.created_at,
      updated_at: user.updated_at
    }

    // assign access token
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 })
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' })
    
    res.json({ accessToken, refreshToken })
  }
}

module.exports = new LoginController