const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

class AuthService {
  async sendMagicLink(email) {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'http://localhost:3000/auth/callback',
        },
      });
      if (error) throw new Error(error.message);
      return { message: 'Magic link sent successfully' };
    } catch (error) {
      throw new Error(`Failed to send magic link: ${error.message}`);
    }
  }

  async verifyToken(token) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({ token, type: 'magiclink' });
      if (error) throw new Error(error.message);
      const jwtToken = jwt.sign({ userId: data.user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      return { token: jwtToken, user: data.user };
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }
}

module.exports = new AuthService();