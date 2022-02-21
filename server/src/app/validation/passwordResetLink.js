const { object, string } = require('yup')

async function validate(input) {
  const schema = object({
    email: string().required().email()
  })
  let valid = false
  let errors = {}

  await schema.validate(input, { abortEarly: false, strict: true })
    .then(() => valid = true)
    .catch((err) => {
      err.inner.map((inn) => errors[inn.path] = inn.errors)
    })

  return { valid, errors }
}

module.exports = validate