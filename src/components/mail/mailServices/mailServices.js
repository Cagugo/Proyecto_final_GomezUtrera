const MailManager = require('../../../utils/mailManager/mailManager');

class SendMailServices {
  async sendMail(payload, res) {
    try {
      const data = await MailManager.sendEmail(payload);
      return res.sendSuccess({
        payload: {
          message: 'Mail sent correctly',
          data,
        },
      });
    } catch (error) {
      return res.sendServerError('Error sending Mail');
    }
  }
}
module.exports = new SendMailServices();
