# Recipe Generator Backend

A Node.js backend for a recipe generator app using Express, MongoDB Atlas, Supabase for authentication, and n8n for recipe generation.

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   - Create a `.env` file based on the provided example.
   - Add your MongoDB Atlas URI, Supabase URL and anon key, n8n workflow URL and API key, and a JWT secret.

3. **Run the Server**:
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- **POST /api/auth/magic-link**: Send a magic link to the provided email.
- **POST /api/auth/verify-token**: Verify the magic link token and receive a JWT.

### Recipes (Authenticated)
- **POST /api/recipes/generate**: Generate and save a new recipe.
- **GET /api/recipes**: Get all recipes for the authenticated user.
- **GET /api/recipes/:id**: Get a specific recipe by ID.
- **PUT /api/recipes/:id**: Update a specific recipe.
- **DELETE /api/recipes/:id**: Delete a specific recipe.

## Notes
- Authentication uses Supabase's magic link feature.
- Recipe generation is currently a dummy implementation simulating an n8n workflow.
- MongoDB Atlas stores user recipes.
- Ensure the frontend handles the magic link redirect and sends the token for verification.
- All recipe endpoints require a valid JWT in the Authorization header (Bearer token).