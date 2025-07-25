const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const generateMagicLinkToken = (email) => {
  const payload = {
    email,
    type: 'magic-link',
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};

const generateAuthToken = (userId, email) => {
  const payload = {
    userId,
    email,
    type: 'auth',
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
};

const verifyMagicLinkToken = (token) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    
    if (payload.type !== 'magic-link') {
      throw new Error('Invalid token type');
    }
    
    return payload;
  } catch (error) {
    throw new Error('Invalid or expired magic link token');
  }
};

const verifyAuthToken = (token) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    
    if (payload.type !== 'auth') {
      throw new Error('Invalid token type');
    }
    
    return payload;
  } catch (error) {
    throw new Error('Invalid or expired auth token');
  }
};

module.exports = {
  generateMagicLinkToken,
  generateAuthToken,
  verifyMagicLinkToken,
  verifyAuthToken
};