const mongoose = require('mongoose');
const { createClient } = require('@supabase/supabase-js');

class DatabaseManager {
  constructor() {
    if (DatabaseManager.instance) {
      return DatabaseManager.instance;
    }
    
    this.config = this.detectAvailableDatabases();
    this.supabaseClient = null;
    this.mongooseConnected = false;
    
    DatabaseManager.instance = this;
  }

  static getInstance() {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  detectAvailableDatabases() {
    const mongoUri = process.env.MONGODB_URI;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (mongoUri) {
      console.log('🍃 MongoDB Atlas detected');
      const config = {
        type: 'mongodb',
        mongodb: { uri: mongoUri }
      };
      
      if (supabaseUrl && supabaseAnonKey && supabaseServiceKey) {
        config.supabase = {
          url: supabaseUrl,
          anonKey: supabaseAnonKey,
          serviceKey: supabaseServiceKey,
        };
      }
      
      return config;
    }

    if (supabaseUrl && supabaseAnonKey && supabaseServiceKey) {
      console.log('⚡ Supabase detected');
      return {
        type: 'supabase',
        supabase: {
          url: supabaseUrl,
          anonKey: supabaseAnonKey,
          serviceKey: supabaseServiceKey,
        },
      };
    }

    console.warn('⚠️  No database configuration found');
    return { type: 'none' };
  }

  async connect() {
    if (this.config.type === 'none') {
      throw new Error('No database configuration found. Please set up MongoDB Atlas or Supabase.');
    }

    try {
      // Connect to MongoDB if available
      if (this.config.mongodb && !this.mongooseConnected) {
        await mongoose.connect(this.config.mongodb.uri);
        this.mongooseConnected = true;
        console.log('🍃 Connected to MongoDB Atlas');
      }

      // Initialize Supabase client if available  
      if (this.config.supabase && !this.supabaseClient) {
        this.supabaseClient = createClient(
          this.config.supabase.url,
          this.config.supabase.serviceKey
        );
        console.log('⚡ Connected to Supabase');
      }
    } catch (error) {
      console.error('❌ Database connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.mongooseConnected) {
      await mongoose.disconnect();
      this.mongooseConnected = false;
      console.log('🍃 Disconnected from MongoDB Atlas');
    }
    
    if (this.supabaseClient) {
      // Supabase doesn't need explicit disconnection
      this.supabaseClient = null;
      console.log('⚡ Disconnected from Supabase');
    }
  }

  getConfig() {
    return this.config;
  }

  getSupabaseClient() {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }
    return this.supabaseClient;
  }

  isMongoAvailable() {
    return !!this.config.mongodb && this.mongooseConnected;
  }

  isSupabaseAvailable() {
    return !!this.config.supabase && !!this.supabaseClient;
  }

  getPrimaryDatabase() {
    return this.config.type;
  }
}

module.exports = DatabaseManager;