const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    
    // Only initialize if email credentials are provided
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      this.isConfigured = true;
    } else {
      console.warn('⚠️  Email service not configured - EMAIL_USER and EMAIL_PASS not set');
    }
  }

  async sendMagicLink(email, token) {
    if (!this.isConfigured || !this.transporter) {
      console.warn('⚠️  Email service not configured - cannot send magic link');
      throw new Error('Email service not configured');
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const magicLinkUrl = `${frontendUrl}/auth/verify?token=${token}`;

    const mailOptions = {
      from: `"Recipe Generator" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Magic Link - Recipe Generator',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f97316; margin-bottom: 10px;">🍳 Recipe Generator</h1>
            <h2 style="color: #374151; margin-top: 0;">Your Magic Link is Ready!</h2>
          </div>
          
          <div style="background-color: #f9fafb; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Click the button below to access your Recipe Generator account. This link will expire in 15 minutes for security.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${magicLinkUrl}" 
                 style="background: linear-gradient(to right, #f97316, #dc2626); 
                        color: white; 
                        padding: 14px 28px; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        font-weight: 600; 
                        font-size: 16px;
                        display: inline-block;">
                Access Recipe Generator
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              If the button doesn't work, copy and paste this link into your browser:
              <br>
              <a href="${magicLinkUrl}" style="color: #f97316; word-break: break-all;">${magicLinkUrl}</a>
            </p>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p>If you didn't request this magic link, you can safely ignore this email.</p>
            <p>Happy cooking! 👨‍🍳👩‍🍳</p>
          </div>
        </div>
      `,
      text: `
        Recipe Generator - Magic Link
        
        Click this link to access your account: ${magicLinkUrl}
        
        This link will expire in 15 minutes for security.
        
        If you didn't request this magic link, you can safely ignore this email.
        
        Happy cooking!
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`📧 Magic link sent to ${email}`);
    } catch (error) {
      console.error('❌ Failed to send magic link email:', error);
      throw new Error('Failed to send magic link email');
    }
  }

  async verifyConnection() {
    if (!this.isConfigured || !this.transporter) {
      console.warn('⚠️  Email service not configured - skipping verification');
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('📧 Email service connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();