import type { Recipe, RecipeFormData } from "@/lib/types"
import api from "@/lib/api"

export const recipeService = {
  getAllRecipes: async (): Promise<Recipe[]> => {
    try {
      const response = await api.get('/recipes')
      return response.data.map((recipe: any) => ({
        ...recipe,
        createdAt: new Date(recipe.createdAt),
        updatedAt: new Date(recipe.updatedAt),
      }))
    } catch (error) {
      console.error('Failed to get recipes:', error)
      throw error
    }
  },

  getRecipeById: async (id: string): Promise<Recipe | null> => {
    try {
      const response = await api.get(`/recipes/${id}`)
      const recipe = response.data
      return {
        ...recipe,
        createdAt: new Date(recipe.createdAt),
        updatedAt: new Date(recipe.updatedAt),
      }
    } catch (error) {
      if ((error as any)?.response?.status === 404) {
        return null
      }
      console.error('Failed to get recipe:', error)
      throw error
    }
  },

  createRecipe: async (formData: RecipeFormData): Promise<Recipe> => {
    try {
      const response = await api.post('/recipes', formData)
      const recipe = response.data
      return {
        ...recipe,
        createdAt: new Date(recipe.createdAt),
        updatedAt: new Date(recipe.updatedAt),
      }
    } catch (error) {
      console.error('Failed to create recipe:', error)
      throw error
    }
  },

  updateRecipe: async (id: string, updates: Partial<Recipe>): Promise<Recipe | null> => {
    try {
      const response = await api.put(`/recipes/${id}`, updates)
      const recipe = response.data
      return {
        ...recipe,
        createdAt: new Date(recipe.createdAt),
        updatedAt: new Date(recipe.updatedAt),
      }
    } catch (error) {
      if ((error as any)?.response?.status === 404) {
        return null
      }
      console.error('Failed to update recipe:', error)
      throw error
    }
  },

  deleteRecipe: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/recipes/${id}`)
      return true
    } catch (error) {
      if ((error as any)?.response?.status === 404) {
        return false
      }
      console.error('Failed to delete recipe:', error)
      throw error
    }
  },

  searchRecipes: async (query: string): Promise<Recipe[]> => {
    try {
      const response = await api.get(`/recipes/search?q=${encodeURIComponent(query)}`)
      return response.data.map((recipe: any) => ({
        ...recipe,
        createdAt: new Date(recipe.createdAt),
        updatedAt: new Date(recipe.updatedAt),
      }))
    } catch (error) {
      console.error('Failed to search recipes:', error)
      throw error
    }
  },
}
