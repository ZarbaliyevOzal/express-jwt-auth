const ejs = require('ejs')
const fs = require('fs');
const path = require('path')
const { emailQueue } = require('../../utils/queue')

class VerificationEmail {
  token;
  user;

  constructor(token, user) {
    this.token = token
    this.user = user
  }

  layout(content) {
    const str = fs.readFileSync(path.join(__dirname, '../../views/vendor/mail/default.ejs'), 'utf-8')
    return ejs.render(str, { content })
  }

  build() {
    const url = `${process.env.APP_URL}/verify-email/${this.user.id}?token=${this.token}`
    const str = fs.readFileSync(path.join(__dirname, '../../views/email/verification.ejs'), 'utf-8')
    const content = ejs.render(str, { url })
    return this.layout(content)
  }

  async queue(to) {
    const html = this.build()
    return emailQueue.add({ to, subject: 'Verify email address', html })
  }
}

module.exports = VerificationEmail