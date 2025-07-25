const User = require('../models/User');
const DatabaseManager = require('../config/database');

class UserRepository {
  constructor() {
    this.dbManager = DatabaseManager.getInstance();
  }

  async createUser(data) {
    if (this.dbManager.isMongoAvailable()) {
      return this.createUserMongo(data);
    } else if (this.dbManager.isSupabaseAvailable()) {
      return this.createUserSupabase(data);
    } else {
      throw new Error('No database available');
    }
  }

  async findUserByEmail(email) {
    if (this.dbManager.isMongoAvailable()) {
      return this.findUserByEmailMongo(email);
    } else if (this.dbManager.isSupabaseAvailable()) {
      return this.findUserByEmailSupabase(email);
    } else {
      throw new Error('No database available');
    }
  }

  async findUserById(id) {
    if (this.dbManager.isMongoAvailable()) {
      return this.findUserByIdMongo(id);
    } else if (this.dbManager.isSupabaseAvailable()) {
      return this.findUserByIdSupabase(id);
    } else {
      throw new Error('No database available');
    }
  }

  async updateUser(id, updates) {
    if (this.dbManager.isMongoAvailable()) {
      return this.updateUserMongo(id, updates);
    } else if (this.dbManager.isSupabaseAvailable()) {
      return this.updateUserSupabase(id, updates);
    } else {
      throw new Error('No database available');
    }
  }

  // MongoDB implementations
  async createUserMongo(data) {
    const user = new User(data);
    const savedUser = await user.save();
    return savedUser.toJSON();
  }

  async findUserByEmailMongo(email) {
    const user = await User.findOne({ email });
    return user ? user.toJSON() : null;
  }

  async findUserByIdMongo(id) {
    const user = await User.findById(id);
    return user ? user.toJSON() : null;
  }

  async updateUserMongo(id, updates) {
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    return user ? user.toJSON() : null;
  }

  // Supabase implementations
  async createUserSupabase(data) {
    const supabase = this.dbManager.getSupabaseClient();
    
    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        email: data.email,
        is_verified: data.isVerified || false,
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return {
      id: user.id,
      email: user.email,
      isVerified: user.is_verified,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
    };
  }

  async findUserByEmailSupabase(email) {
    const supabase = this.dbManager.getSupabaseClient();
    
    const { data: user, error } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .single();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      isVerified: user.is_verified,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
    };
  }

  async findUserByIdSupabase(id) {
    const supabase = this.dbManager.getSupabaseClient();
    
    const { data: user, error } = await supabase
      .from('users')
      .select()
      .eq('id', id)
      .single();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      isVerified: user.is_verified,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
    };
  }

  async updateUserSupabase(id, updates) {
    const supabase = this.dbManager.getSupabaseClient();
    
    const supabaseUpdates = {};
    if (updates.email) supabaseUpdates.email = updates.email;
    if (updates.isVerified !== undefined) supabaseUpdates.is_verified = updates.isVerified;
    
    const { data: user, error } = await supabase
      .from('users')
      .update(supabaseUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      isVerified: user.is_verified,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
    };
  }
}

module.exports = UserRepository;