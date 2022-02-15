const Bull = require('bull')
const { sendMail } = require('./mail')

// detailed reference https://github.com/OptimalBits/bull/blob/master/REFERENCE.md

const emailQueue = new Bull('email', process.env.REDIS_URL, {
  defaultJobOptions: {
    attempts: 3
  }
})

emailQueue.process(async (job) => {
  const { to, subject, text } = job.data
  return sendMail({ to, subject, text })
})

module.exports = { emailQueue }