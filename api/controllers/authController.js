const AuthService = require('../services/authService');

class AuthController {
  async sendMagicLink(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: 'Email is required' });
      const result = await AuthService.sendMagicLink(email);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async verifyToken(req, res) {
    try {
      const { token } = req.body;
      if (!token) return res.status(400).json({ error: 'Token is required' });
      const result = await AuthService.verifyToken(token);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();