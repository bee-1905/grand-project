import { authService } from './authService';
export interface Recipe {
  id: string;
  title: string;
  ingredients: { name: string; quantity: string }[];
  instructions: string;
  cuisine: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeFormData {
  ingredients: string;
  cuisine: string;
}

export const recipeService = {
  async getAllRecipes(): Promise<Recipe[]> {
    const token = authService.getToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch recipes');
    }

    return response.json();
  },

  async getRecipeById(id: string): Promise<Recipe> {
    const token = authService.getToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Recipe not found');
    }

    return response.json();
  },

  async generateRecipe(formData: RecipeFormData): Promise<Recipe> {
    const token = authService.getToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        cuisine: formData.cuisine,
        ingredients: formData.ingredients.split(',').map((ing) => ing.trim()),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate recipe');
    }

    return response.json();
  },

  async deleteRecipe(id: string): Promise<void> {
    const token = authService.getToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete recipe');
    }
  },

  async updateRecipeName(id: string, newName: string): Promise<void> {
    const token = authService.getToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update recipe name');
    }
  },
};