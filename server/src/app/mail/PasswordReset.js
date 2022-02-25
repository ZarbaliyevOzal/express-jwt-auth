const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const { emailQueue } = require('../../utils/queue')

class PasswordReset {
  token;
  email;

  constructor(token, email) {
    this.token = token
    this.email = email
  }

  layout(content) {
    const str = fs.readFileSync(path.join(__dirname, '../../views/vendor/mail/default.ejs'), 'utf-8')
    return ejs.render(str, { content })
  }

  build() {
    const url = `${process.env.APP_URL}/api/v1/password-reset/${this.token}?email=${this.email}`
    const str = fs.readFileSync(path.join(__dirname, '../../views/email/passwordReset.ejs'), 'utf-8')
    const content = ejs.render(str, { url })
    return this.layout(content)
  }

  async queue(to) {
    const html = this.build()
    return emailQueue.add({ to, subject: 'Password reset', html })
  }
}

module.exports = PasswordReset