"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChefHat, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageTransition from "@/components/PageTransition";
import { RecipeFormData, recipeService } from "@/services/recipeService";

export default function RecipeGeneration() {
  const router = useRouter();
  const [formData, setFormData] = useState<RecipeFormData>({
    ingredients: "",
    cuisine: "International",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ingredients.trim()) return;

    setLoading(true);
    try {
      const recipe = await recipeService.generateRecipe(formData);
      router.push(`/recipe-details/${recipe.id}`);
    } catch (error) {
      console.error("Failed to generate recipe:", error);
      if (typeof error === "object" && error !== null && "message" in error && typeof (error as { message: unknown }).message === "string" && (error as { message: string }).message.includes("token")) {
        localStorage.removeItem("authToken");
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof RecipeFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4">
              <ChefHat className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate New Recipe</h1>
            <p className="text-gray-600">
              Tell us what ingredients you have and we'll create a delicious recipe for you!
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recipe Details</CardTitle>
              <CardDescription>Fill in the information below to generate your personalized recipe</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
                    Ingredients *
                  </label>
                  <Textarea
                    id="ingredients"
                    placeholder="Enter your ingredients separated by commas (e.g., chicken breast, broccoli, garlic, olive oil)"
                    value={formData.ingredients}
                    onChange={(e) => handleInputChange("ingredients", e.target.value)}
                    className="min-h-[100px]"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">List all the ingredients you have available</p>
                </div>

                <div>
                  <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-2">
                    Cuisine
                  </label>
                  <Input
                    id="cuisine"
                    placeholder="Enter cuisine type (e.g., Italian, Mexican, Indian)"
                    value={formData.cuisine}
                    onChange={(e) => handleInputChange("cuisine", e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  disabled={loading || !formData.ingredients.trim()}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Recipe...
                    </>
                  ) : (
                    <>
                      <ChefHat className="mr-2 h-4 w-4" />
                      Generate Recipe
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Our AI will analyze your ingredients and create a unique recipe just for you. This usually takes a few
              seconds.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}