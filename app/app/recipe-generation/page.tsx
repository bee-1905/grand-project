"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ChefHat, Clock, Users, Utensils, Loader2 } from "lucide-react"
import type { RecipeFormData } from "@/lib/types"
import { recipeService } from "@/services/recipe-service"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageTransition } from "@/components/page-transition"

export default function RecipeGenerationPage() {
  const [formData, setFormData] = useState<RecipeFormData>({
    ingredients: "",
    servings: 4,
    cookTime: 30,
    difficulty: "Medium",
    cuisine: "Italian",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
      return
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.ingredients.trim()) return

    setIsGenerating(true)

    try {
      const recipe = await recipeService.createRecipe(formData)
      router.push(`/recipe-details/${recipe.id}`)
    } catch (error) {
      console.error("Failed to generate recipe:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleInputChange = (field: keyof RecipeFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-full mb-4">
              <ChefHat className="h-8 w-8 text-orange-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Generate Your Recipe</h1>
            <p className="text-gray-600">Tell us what you have and we'll create something amazing!</p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Ingredients */}
              <div className="space-y-2">
                <Label htmlFor="ingredients" className="text-lg font-semibold flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-orange-500" />
                  Ingredients
                </Label>
                <Input
                  id="ingredients"
                  placeholder="e.g., chicken, tomatoes, basil, garlic..."
                  value={formData.ingredients}
                  onChange={(e) => handleInputChange("ingredients", e.target.value)}
                  className="h-12 text-base"
                  required
                />
                <p className="text-sm text-gray-500">List the ingredients you have available, separated by commas</p>
              </div>

              {/* Servings and Cook Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="servings" className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Servings
                  </Label>
                  <Input
                    id="servings"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.servings}
                    onChange={(e) => handleInputChange("servings", Number.parseInt(e.target.value) || 1)}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cookTime" className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-500" />
                    Cook Time (minutes)
                  </Label>
                  <Input
                    id="cookTime"
                    type="number"
                    min="5"
                    max="300"
                    value={formData.cookTime}
                    onChange={(e) => handleInputChange("cookTime", Number.parseInt(e.target.value) || 30)}
                    className="h-12 text-base"
                  />
                </div>
              </div>

              {/* Difficulty and Cuisine */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-lg font-semibold">Difficulty Level</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value: "Easy" | "Medium" | "Hard") => handleInputChange("difficulty", value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-lg font-semibold">Cuisine Style</Label>
                  <Select value={formData.cuisine} onValueChange={(value) => handleInputChange("cuisine", value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Italian">Italian</SelectItem>
                      <SelectItem value="Mexican">Mexican</SelectItem>
                      <SelectItem value="Asian">Asian</SelectItem>
                      <SelectItem value="American">American</SelectItem>
                      <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                      <SelectItem value="Indian">Indian</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="Thai">Thai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Generate Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="pt-4"
              >
                <Button
                  type="submit"
                  size="lg"
                  disabled={isGenerating || !formData.ingredients.trim()}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Your Recipe...
                    </>
                  ) : (
                    <>
                      <ChefHat className="mr-2 h-5 w-5" />
                      Generate Recipe
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>

          {/* Back to Dashboard */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8"
          >
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
