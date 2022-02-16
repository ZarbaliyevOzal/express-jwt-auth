module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Default Mailer
  |--------------------------------------------------------------------------
  |
  | This option controls the default mailer that is used to send any email
  | messages sent by your application. Alternative mailers may be setup
  | and used as needed; however, this mailer will be used by default.
  |
  */

  default: process.env.MAIL_MAILER ?? 'smtp',

  

  mailers: {
    smtp: {
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    }
  },

  /*
  |--------------------------------------------------------------------------
  | Global "From" Address
  |--------------------------------------------------------------------------
  |
  | You may wish for all e-mails sent by your application to be sent from
  | the same address. Here, you may specify a name and address that is
  | used globally for all e-mails that are sent by your application.
  |
  */

  from: {
    address: process.env.MAIL_FROM_ADDRESS ?? 'hello@example.com',
    name: process.env.MAIL_FROM_NAME ?? 'Example'
  }
}