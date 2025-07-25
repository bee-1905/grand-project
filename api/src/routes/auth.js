const express = require('express');
const UserRepository = require('../repositories/UserRepository');
const { generateMagicLinkToken, generateAuthToken, verifyMagicLinkToken } = require('../utils/jwt');
const emailService = require('../services/email');

const router = express.Router();
const userRepository = new UserRepository();

// Send magic link
router.post('/send-magic-link', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Generate magic link token
    const token = generateMagicLinkToken(email.toLowerCase().trim());

    // Send email
    try {
      await emailService.sendMagicLink(email.toLowerCase().trim(), token);
      res.json({ success: true, message: 'Magic link sent successfully' });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      
      // For development/testing, return the token directly when email fails
      if (process.env.NODE_ENV !== 'production') {
        res.json({ 
          success: true, 
          message: 'Email service unavailable - development mode',
          devToken: token,
          devUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/verify?token=${token}`
        });
      } else {
        throw emailError;
      }
    }
  } catch (error) {
    console.error('Send magic link error:', error);
    res.status(500).json({ error: 'Failed to send magic link' });
  }
});

// Verify magic link and authenticate user
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Verify magic link token
    const payload = verifyMagicLinkToken(token);
    const email = payload.email;

    // Find or create user
    let user = await userRepository.findUserByEmail(email);
    
    if (!user) {
      user = await userRepository.createUser({ email, isVerified: true });
    } else if (!user.isVerified) {
      user = await userRepository.updateUser(user.id, { isVerified: true });
    }

    if (!user) {
      return res.status(500).json({ error: 'Failed to create or update user' });
    }

    // Generate auth token
    const authToken = generateAuthToken(user.id, user.email);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        isVerified: user.isVerified,
      },
      token: authToken,
    });
  } catch (error) {
    console.error('Verify magic link error:', error);
    res.status(400).json({ error: 'Invalid or expired magic link' });
  }
});

// Logout (client-side token removal, but we can log it)
router.post('/logout', (req, res) => {
  // In a more complex system, you might invalidate the token server-side
  // For now, we'll just respond with success as the client will remove the token
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;