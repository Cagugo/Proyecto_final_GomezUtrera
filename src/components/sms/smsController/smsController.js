const sendSmsServices = require('../smsServices/smsServices');
class SendSmsController {
  sendSms = async (req, res) => {
    const payload = req.body;
    return await sendSmsServices.sendSms(payload, res);
  };
}
module.exports = new SendSmsController();
