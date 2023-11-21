class RolesServices {
  getAdmin = async (req, res) => {
    try {
      res.sendSuccess('If you are seeing this it is because you are a registered Admin role');
    } catch (error) {
      return res.sendServerError('getAdmin error processing request');
    }
  };
  getPremium = async (req, res) => {
    try {
      res.sendSuccess('If you are seeing this it is because you are a registered Premium role');
    } catch (error) {
      return res.sendServerError('getPremium error while processing request');
    }
  };
  getUser = async (req, res) => {
    try {
      res.sendSuccess('If you are seeing this it s because you are a registered role User');
    } catch (error) {
      return res.sendServerError('getUser error processing request');
    }
  };
}
module.exports = new RolesServices();
