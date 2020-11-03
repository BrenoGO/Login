const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.VIRTUAL,
      passwordHash: DataTypes.STRING,
      authToken: DataTypes.STRING
    },
    {
      hooks: {
        beforeSave: async (user) => {
          if (user.password) {
            user.passwordHash = await bcrypt.hash(user.password, 8)
          }
        }
      }
    }
  )

  User.prototype.checkPassword = function checkPassword (password) {
    return bcrypt.compare(password, this.passwordHash)
  }

  User.prototype.generateToken = function generateToken (expiresIn = '30 days') {
    return jwt.sign(
      {
        id: this.id,
        email: this.email,
        name: this.name
      },
      process.env.JWT_SECRET,
      {
        expiresIn
      }
    )
  }

  User.associate = (models) => {
    // associatings here..
  }

  return User
}
