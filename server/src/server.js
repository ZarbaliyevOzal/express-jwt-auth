require('dotenv').config({ path: `${__dirname}/../.env` })
const express = require('express')
const app = express()
const cors = require('cors')
const routes = require('./routes/index')

app.use(express.json())
app.use(cors())
app.use('/', function(req, res, next) {
  if (req.originalUrl.includes('/verify-email/')) return next()
  if (req.headers['content-type'] && req.headers['content-type'] !== 'application/json') 
    return res.status(400).send('Headers must contain content-type: application/json')
  if (req.headers['accept'] !== 'application/json') 
    return res.status(400).send('Headers must contain accept: application/json')
  next()
})

app.use('/', routes.auth)
app.use('/', routes.profile)
app.use('/', routes.post)

app.listen(4000, () => {
  console.log('listening on port 4000')
})