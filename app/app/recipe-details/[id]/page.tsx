"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter, useParams } from "next/navigation"
import { Clock, Users, ChefHat, Save, ArrowLeft, Star } from "lucide-react"
import Image from "next/image"
import type { Recipe } from "@/lib/types"
import { recipeService } from "@/services/recipe-service"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { PageTransition } from "@/components/page-transition"

export default function RecipeDetailsPage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const { isAuthenticated } = useAuth()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
      return
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && id) {
      loadRecipe()
    }
  }, [id, isAuthenticated])

  const loadRecipe = async () => {
    try {
      const data = await recipeService.getRecipeById(id)
      setRecipe(data)
    } catch (error) {
      console.error("Failed to load recipe:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!recipe) return

    setIsSaving(true)
    try {
      // Update recipe via API instead of saveRecipe
      await recipeService.updateRecipe(recipe.id, recipe)
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to save recipe:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Don't render if not authenticated
  if (!isAuthenticated || isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </PageTransition>
    )
  }

  if (!recipe) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe Not Found</h1>
            <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="relative h-96 overflow-hidden">
          <Image src={recipe.image || "/placeholder.svg"} alt={recipe.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Navigation */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="bg-white/90 hover:bg-white backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Recipe
                </>
              )}
            </Button>
          </div>

          {/* Recipe Title */}
          <div className="absolute bottom-8 left-8 right-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{recipe.title}</h1>
              <p className="text-xl text-white/90 mb-4">{recipe.description}</p>

              {/* Recipe Meta */}
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{recipe.prepTime + recipe.cookTime} min total</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{recipe.servings} servings</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5" />
                  <span>{recipe.difficulty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  <span>{recipe.cuisine}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Ingredients */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  Ingredients
                </h2>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{ingredient}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                Instructions
              </h2>

              <div className="space-y-6">
                {recipe.instructions.map((instruction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{instruction}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recipe Tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-12 pt-8 border-t border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
