const sendGrid = require('@sendgrid/mail')

sendGrid.setApiKey(process.env.SEND_GRID_KEY)

module.exports = {
  send: async (to, templateId, dynamic_template_data = null, from = 'Breno GO<breno.oliveira.ufv@gmail.com>') => {
    try {
      if (process.env.STAGE !== 'dev') {
        throw Error('Este ambiente não pode enviar e-mails')
      }
      const sentEmail = await sendGrid.send({
        to,
        from,
        templateId,
        dynamic_template_data
      })

      console.log('sentEmail:')
      console.log(sentEmail)
      return sentEmail
    } catch (error) {
      console.log('error in EmailService method send')
      console.log(error)
      return { error }
    }
  }
}
