"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, LogOut } from "lucide-react"
import type { Recipe } from "@/lib/types"
import { recipeService } from "@/services/recipe-service"
import { authService } from "@/services/auth-service"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RecipeCard } from "@/components/recipe-card"

export default function DashboardPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
      return
    }
  }, [isAuthenticated, router])

  // Load recipes when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadRecipes()
    }
  }, [isAuthenticated])

  // Filter recipes based on search
  useEffect(() => {
    if (!searchQuery) {
      setFilteredRecipes(recipes)
    } else {
      const filtered = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredRecipes(filtered)
    }
  }, [recipes, searchQuery])

  const loadRecipes = async () => {
    try {
      setError(null)
      const data = await recipeService.getAllRecipes()
      setRecipes(data)
    } catch (error) {
      console.error("Failed to load recipes:", error)
      setError("Failed to load recipes. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      logout()
      router.push('/')
    }
  }

  const handleRecipeClick = (recipeId: string) => {
    router.push(`/recipe-details/${recipeId}`)
  }

  const handleRename = async (id: string, newTitle: string) => {
    try {
      await recipeService.updateRecipe(id, { title: newTitle })
      setRecipes(prev => prev.map(recipe => 
        recipe.id === id ? { ...recipe, title: newTitle } : recipe
      ))
    } catch (error) {
      console.error("Failed to rename recipe:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await recipeService.deleteRecipe(id)
      setRecipes(prev => prev.filter(recipe => recipe.id !== id))
    } catch (error) {
      console.error("Failed to delete recipe:", error)
    }
  }

  const handleGenerateRecipe = () => {
    router.push("/recipe-generation")
  }

  // Loading state
  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={loadRecipes} className="bg-orange-500 hover:bg-orange-600">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Recipes</h1>
            <p className="text-gray-600">
              Welcome back, {user?.email}! You have {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} in your collection.
            </p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Button
              onClick={handleGenerateRecipe}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Generate Recipe
            </Button>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gray-300 hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Search */}
        {recipes.length > 0 && (
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Content */}
        {recipes.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-lg p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Recipes Yet</h2>
              <p className="text-gray-600 mb-8">Start your culinary journey by generating your first recipe!</p>
              <Button
                onClick={handleGenerateRecipe}
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Generate Recipe
              </Button>
            </div>
          </div>
        ) : filteredRecipes.length === 0 ? (
          /* No Search Results */
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No recipes found matching your search.</p>
          </div>
        ) : (
          /* Recipe Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => handleRecipeClick(recipe.id)}
                onRename={handleRename}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}