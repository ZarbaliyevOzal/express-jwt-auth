const Bull = require('bull')
const Mailable = require('../utils/Mailable')

// detailed reference https://github.com/OptimalBits/bull/blob/master/REFERENCE.md

const emailQueue = new Bull('email', process.env.REDIS_URL, {
  defaultJobOptions: {
    attempts: 3
  }
})

emailQueue.process(async (job) => {
  const { to, subject, html } = job.data
  return Mailable.send({ to, subject, html })
})

module.exports = { emailQueue }