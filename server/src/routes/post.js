const router = require('express').Router()
const { auth } = require('../middlewares/index')

const posts = [
  {
    id: 1,
    title: 'new rocket'
  },
  {
    id: 2,
    title: 'old rocket'
  }
]

router.get('/posts', auth, (req, res) => {
  res.json(posts)
})

module.exports = router