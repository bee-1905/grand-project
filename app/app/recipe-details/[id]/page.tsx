"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Clock, ChefHat, Save, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageTransition from "@/components/PageTransition";
import { Recipe, recipeService } from "@/services/recipeService";

export default function RecipeDetails() {
  const router = useRouter();
  const params = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadRecipe(params.id as string);
    }
  }, [params.id]);

  const loadRecipe = async (id: string) => {
    try {
      const data = await recipeService.getRecipeById(id);
      setRecipe(data);
    } catch (error) {
      console.error("Failed to load recipe:", error);
      if (typeof error === "object" && error !== null && "message" in error && typeof (error as any).message === "string" && (error as any).message.includes("token")) {
        localStorage.removeItem("authToken");
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!recipe) return;
    setSaving(true);
    try {
      // Recipe is already saved when generated; redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save recipe:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe not found</h1>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="relative h-64 sm:h-80">
              <Image src="/placeholder.svg" alt={recipe.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                <div className="p-6 text-white">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">{recipe.title}</h1>
                  <p className="text-lg opacity-90">{recipe.instructions.slice(0, 100)}...</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="text-xl font-semibold">{new Date(recipe.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Updated</p>
                  <p className="text-xl font-semibold">{new Date(recipe.updatedAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <ChefHat className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cuisine</p>
                  <p className="text-xl font-semibold">{recipe.cuisine}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-8">
            <Badge variant="secondary" className="text-sm">
              {recipe.cuisine}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
                <CardDescription>Everything you need for this recipe</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">
                        {ingredient.name} - {ingredient.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
                <CardDescription>Step-by-step cooking guide</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {recipe.instructions.split("\n").map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4 flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 pt-1">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Cooking Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-800">
                  <strong>Pro Tip:</strong> For best results, make sure all ingredients are at room temperature before
                  starting. This ensures even cooking and better flavor integration.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}