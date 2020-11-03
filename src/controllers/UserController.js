const { User } = require('../models')
const EmailService = require('../services/EmailService')
const { SEND_GRID_TEMPLATES_IDS } = require('../config/consts')
const VerificationService = require('../services/VerificationService')

module.exports = {
  async loginTestEmail (req, res) {
    try {
      const { email } = req.body
      const user = await User.findOne({ where: { email } })
      if (user) return res.status(200).json({ sucesso: 'Usuário existente' })
      return res.status(200).json({ sucesso: 'Usuário pode ser criado' })
    } catch (err) {
      console.log(err)
      return res.status(500).send()
    }
  },
  async login (req, res) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ where: { email } })
      if (!user) return res.status(401).send()
      if (!await user.checkPassword(password)) return res.status(401).send()
      await user.update({ authToken: user.generateToken() })
      return res.status(200).json({ user })
    } catch (err) {
      console.log(err)
      return res.status(500).send()
    }
  },
  async register (req, res) {
    try {
      const { email, name, password } = req.body
      const user = await User.create({ email, name, password })
      await user.update({ authToken: user.generateToken() })
      EmailService.send(
        email,
        SEND_GRID_TEMPLATES_IDS.WELCOME,
        { name }
      )
      return res.status(201).json({ user })
    } catch (err) {
      console.log(err)
      return res.status(500).send()
    }
  },
  async recoverReq (req, res) {
    try {
      const { email } = req.body
      const user = await User.findOne({ where: { email } })
      if (!user) return res.status(401).send()
      const emailRespose = await VerificationService.sendEmailCode(email)
      if (emailRespose.error) {
        console.log(emailRespose.error)
        throw Error('erro ao enviar e-mail de recuperação de senha')
      }
      return res.status(204).send()
    } catch (err) {
      console.log(err)
      return res.status(500).send()
    }
  },
  async recoverTestCode (req, res) {
    try {
      const { email, code } = req.body
      const user = await User.findOne({ where: { email } })
      if (!user) return res.status(401).send()
      const emailRespose = await VerificationService.checkCode(email, code)
      if (emailRespose.error) return res.status(400).json({ error: emailRespose.error })
      await user.update({ authToken: user.generateToken() })
      return res.status(204).send()
    } catch (err) {
      console.log(err)
      return res.status(500).send()
    }
  },
  async recoverUpdatePassWord (req, res) {
    try {
      const { reqUser, body: { password } } = req
      await reqUser.update({ password })
      return res.status(204).send()
    } catch (err) {
      console.log(err)
      return res.status(500).send()
    }
  },
  async private (req, res) {
    res.status(200).json({ ok: 'entered in private route' })
  }
}
