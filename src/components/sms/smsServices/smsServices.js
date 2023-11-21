const SmsManager = require('../../../utils/smsManager/smsManager');
class SendSmsServices {
  async sendSms(payload, res) {
    try {
      const data = await SmsManager.sendSms(payload);
      return res.sendSuccess({
        payload: {
          message: 'SMS sent successfully',
          data,
        },
      });
    } catch (error) {
      return res.sendServerError('Error sending SMS');
    }
  }
}
module.exports = new SendSmsServices();
