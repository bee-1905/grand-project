const { verifyAuthToken } = require('../utils/jwt');
const UserRepository = require('../repositories/UserRepository');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({ error: 'Token missing' });
    }

    // Verify the JWT token
    const payload = verifyAuthToken(token);
    
    // Verify user still exists in database
    const userRepository = new UserRepository();
    const user = await userRepository.findUserById(payload.userId);
    
    if (!user || !user.isVerified) {
      return res.status(401).json({ error: 'User not found or not verified' });
    }

    // Add user info to request
    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { authMiddleware };