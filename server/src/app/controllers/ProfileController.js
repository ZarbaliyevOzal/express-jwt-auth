const { knex } = require('../../utils/database')

class ProfileController {
  /**
   * get profile data
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async index(req, res) {
    const user = await knex('users')
      .select([ 'id', 'email', 'first_name', 'last_name', 'verified_at', 'created_at', 'updated_at' ])
      .where('id', req.user.id)
      .first()
      .then((res) => res)
    return res.json({ user })
  }
}

module.exports = new ProfileController