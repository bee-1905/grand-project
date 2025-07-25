# Recipe Generator API

A Node.js Express API that supports both MongoDB Atlas and Supabase as database backends.

## Features

- **Dual Database Support**: Works with MongoDB Atlas, Supabase, or both
- **Magic Link Authentication**: Passwordless email-based authentication
- **Recipe CRUD Operations**: Full recipe management with user isolation
- **Search Functionality**: Full-text search across recipes
- **Email Integration**: Magic link delivery via SMTP

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables** (see `.env` file):
   ```bash
   # Required
   JWT_SECRET=your_jwt_secret_key_here
   FRONTEND_URL=http://localhost:3000
   EMAIL_HOST=smtp.gmail.com
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # Database (at least one required)
   MONGODB_URI=mongodb+srv://...
   # OR/AND
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_KEY=your_service_key
   ```

3. **Setup database** (choose one or both):

   **For MongoDB Atlas**:
   - No additional setup needed, schemas are created automatically

   **For Supabase**:
   - Run the SQL commands in `supabase_schema.sql` in your Supabase SQL Editor

4. **Start the server**:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Database Support

The API automatically detects which databases are available based on environment variables:

- **MongoDB Only**: Set `MONGODB_URI`
- **Supabase Only**: Set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`
- **Both**: Set all environment variables (MongoDB will be primary)

## API Endpoints

### Authentication
- `POST /api/auth/send-magic-link` - Send magic link to email
- `GET /api/auth/verify/:token` - Verify magic link and get auth token
- `POST /api/auth/logout` - Logout user

### Recipes (Authentication Required)
- `GET /api/recipes` - Get all user recipes
- `POST /api/recipes` - Create new recipe
- `GET /api/recipes/:id` - Get specific recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe
- `GET /api/recipes/search?q=query` - Search recipes

## Email Configuration

For Gmail SMTP:
1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password as `EMAIL_PASS`

## Development

```bash
# Watch mode
npm run dev

# Start production server
npm start
```

## Project Structure

```
src/
├── config/
│   └── database.js        # Database connection manager
├── models/
│   ├── User.js           # MongoDB user schema
│   └── Recipe.js         # MongoDB recipe schema
├── repositories/
│   ├── UserRepository.js  # User data operations
│   └── RecipeRepository.js # Recipe data operations
├── routes/
│   ├── auth.js           # Authentication routes
│   └── recipes.js        # Recipe routes
├── middleware/
│   └── auth.js           # JWT authentication middleware
├── services/
│   └── email.js          # Email service
├── utils/
│   └── jwt.js            # JWT utilities
└── server.js             # Main server file
```

## Health Check

Visit `http://localhost:5000/health` to check server status and database connection.