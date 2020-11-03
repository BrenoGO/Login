const moment = require('moment')
const { Verification_Code } = require('../models')
const EmailService = require('./EmailService')
const { SEND_GRID_TEMPLATES_IDS } = require('../config/consts')

const generateCode = () => {
  const num = Math.ceil(Math.random() * 999999)
  let str = String(num)
  while (str.length < 6) {
    str = `0${str}`
  }
  return str
}

module.exports = {
  checkCode: async (field, code) => {
    try {
      const verificationCode = await Verification_Code.findOne({ where: { field } })
      let error
      if (!verificationCode) error = 'E-mail errado'
      if (verificationCode.tries >= 3) error = 'Acabou o número de tentativas'
      if (verificationCode.code !== code) error = 'Código de Verificação Inválido'
      const expiresAt = moment(verificationCode.expiresAt)
      if (moment().isAfter(expiresAt)) error = 'Código expirou'
      if (error) {
        Verification_Code.update({ tries: verificationCode.tries ? verificationCode.tries + 1 : 1 })
        throw Error(error)
      }
      return true
    } catch (error) {
      return { error }
    }
  },

  sendEmailCode: async (email) => {
    try {
      const code = generateCode()
      const response = await EmailService.send(email, SEND_GRID_TEMPLATES_IDS.CONFIRM_EMAIL_CODE, { code })
      if (response.error) throw response.error
      if (response) {
        const verificationCode = await Verification_Code.findOne({ where: { field: email } })
        if (verificationCode) {
          Verification_Code.update({
            code,
            expiresAt: moment().add(30, 'minutes')
          })
        } else {
          await Verification_Code.create({
            field: email,
            code,
            expiresAt: moment().add(30, 'minutes')
          })
        }
        return response
      }
      throw Error('Erro inesperado')
    } catch (error) {
      console.log('error in sendEmailCode');
      console.log(error);
      return { error }
    }
  }
}
