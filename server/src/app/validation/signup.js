const { object, string, ref } = require('yup')
const { knex } = require('../../utils/database')

module.exports = object({
  first_name: string().required().max(2).label('First name'),
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
    // .test('password_confirmation', 'Retype password does not match password', (value) => value === req.body.password)
    .oneOf([ref('password')], 'Password mast match')
    .label('Retype password')
})