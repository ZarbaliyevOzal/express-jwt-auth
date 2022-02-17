const jwt = require('jsonwebtoken')
const { object, string } = require('yup')
const { knex } = require('../utils/database')
const bcrypt = require('bcryptjs')
const logger = require('../utils/logger')
// const { emailQueue } = require('../utils/queue')
const VerificationEmail = require('../app/mail/VerificationEmail')

function generateToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 })
}

class AuthController {
  /**
   * Login
   * @param {*} req 
   * @param {*} res 
   */
  async login(req, res) {
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

    // assign access token
    const accessToken = generateToken({ id: user.id })
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' })
    
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
        logger.log(err)
        return res.status(500).json({ error: err.message })
      })

    // create verification token
    const verificationToken = jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })

    await (new VerificationEmail(verificationToken, { id })).queue(data.email)

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

  /**
   * verify email
   * @param {*} req 
   * @param {*} res 
   */
  async verifyEmail(req, res) {
    const user = await knex('users').where('id', req.params.id).first().then(res)
    if (!user) res.status(404).json({ message: 'User not found' })
    // validate token
    jwt.verify(req.params.token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
      if (err) return res.status(401).json({ message: 'Invalid token' })
      if (data.id !== user.id) res.status(401).json({ message: 'Invalid token' })
      await knex('users').where('id', req.params.id)
        .update({ verified_at: new Date() })
      res.json({ message: 'Your account verified. Thanks' })
    })
  }

  /**
   * resend verification link
   * @param {*} req 
   * @param {*} res 
   */
  async resendVerificationLink(req, res) {
    const user = await knex('users').where('id', req.user.id).first().then(res)
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (user.verified_at) return res.status(400).json({ message: 'Email already verified' })
    const verificationToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
    await (new VerificationEmail(verificationToken, { id: user.id })).queue(user.email)
    return res.json({ message: 'Verification link was sent to your email address' })
  }
}

module.exports = AuthController