const nodemailer = require('nodemailer')
const mailConfig = require('../config/mail')

class Mailable {
  transport;
  to;
  subject;


  constructor() {
    this.transport = nodemailer.createTransport(mailConfig.mailers[mailConfig.default])
  }

  async send({ to, subject, html }) {
    const data = {
      from: `${mailConfig.from.name} <${mailConfig.from.address}>`,
      to: to,
      subject,
      html
    }
    return this.transport.sendMail(data)
  }
}

module.exports = new Mailable()