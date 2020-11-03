const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const { User } = require('../models')

module.exports = async (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.status(401).json({ error: { description: 'Token não fornecido' } })
  }
  const parts = authorization.split(' ')
  if (!parts.length === 2) {
    return res.status(401).json({ error: { description: 'Token com erro.' } })
  }
  const [scheme, hash] = parts
  if (scheme !== 'Bearer') {
    return res.status(401).json({ error: { description: 'Token mal formatado.' } })
  }
  try {
    const decoded = await promisify(jwt.verify)(hash, process.env.JWT_SECRET)
    req.userId = decoded.id
    req.userEmail = decoded.email
    req.userName = decoded.name

    const user = await User.findByPk(req.userId)

    if (!user) {
      return res.status(401).json({ error: { description: 'Token de usuário inexistente.' } })
    }
    req.reqUser = user

    const now = Date.now().valueOf() / 1000
    if (now > decoded.exp) {
      return res.status(401).json({ error: { description: 'Token expirado.' } })
    }

    return next()
  } catch (err) {
    console.log('err in middleware')
    console.log(err)
    return res.status(401).json({ error: { description: 'Token inválido.' } })
  }
}
