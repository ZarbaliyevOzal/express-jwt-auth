const jwt = require('jsonwebtoken')
const { object, string, email } = require('yup')
const { knex } = require('../utils/database')
const bcrypt = require('bcryptjs')
const logger = require('../utils/logger')

function generateToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 })
}

let refreshTokens = []

class AuthController {
  /**
   * Login
   * @param {*} req 
   * @param {*} res 
   */
  login(req, res) {
    const { email, password } = req.body
    const user = { email }
    // assign access token
    const accessToken = generateToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' })
    // refreshTokens.push(refreshToken)
    res.json({ accessToken, refreshToken })
  }

  /**
   * Sign up
   * @param {*} req 
   * @param {*} res 
   */
  async signup(req, res) {
    const schema = object({
      first_name: string().required().max(5).label('First name'),
      last_name: string().nullable().max(45).label('Last name'),
      email: string().required().email().max(255)
        .test(
          'unique', 
          'Email already in use', 
          async (value) => {
            const user = await knex('users').where('email', value.trim()).first().then((res) => res)
            return !user 
          }  
        )
        .label('Email'),
      password: string().required().min(6).max(12).label('Password'),
      password_confirmation: string().required().min(6).max(12)
        .test('password_confirmation', 'Retype password does not match password', (value) => value === req.body.password)
        .label('Retype password')
    })

    let valid = false
    let errors = {}

    await schema.validate({
      first_name: req.body.first_name?.trim(),
      last_name: req.body.last_name?.trim(),
      email: req.body.email?.trim(),
      password: req.body.password?.trim(),
      password_confirmation: req.body.password_confirmation?.trim(),
    }, { abortEarly: false })
      .then(() => valid = true)
      .catch((err) => err.inner.map((inn) => errors[inn.path] = inn.errors))

    if (!valid) return res.status(400).json({ errors: errors })

    const data = {
      first_name: req.body.first_name.trim(),
      last_name: req.body.last_name.trim(),
      email: req.body.email.trim(),
      password: bcrypt.hashSync(req.body.password, 12)
    }

    // create user
    const id = await knex('users').insert(data)
      .then((res) => res[0])
      .catch((err) => {
        console.log(err)
        return res.status(500).json({ error: err.message })
      })

    if (!id) return res.status(400).json({ message: 'Unsuccessfull registration' })

    // send welcome mail in queue
    // sign jwt tokens
    const accessToken = generateToken({ id })
    const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' })

    return res.json({ id: id, message: 'Successfully registered', accessToken, refreshToken })
  }

  /**
   * Re-generate new access token and refresh token
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  token(req, res) {
    const refreshToken = req.body.token
    if (!refreshToken) return res.sendStatus(401)
    // if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(401)
      const accessToken = generateToken({ email: user.email })
      const refreshToken = jwt.sign({email: user.email}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' })
      return res.json({ accessToken, refreshToken })
    })
  }

  /**
   * logout
   * @param {*} req 
   * @param {*} res 
   */
  logout(req, res) {
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token)
    res.sendStatus(204)
  }
}

module.exports = AuthController