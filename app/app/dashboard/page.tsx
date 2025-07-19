"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import RecipeCard from "@/components/RecipeCard";
import RecipeFilters from "@/components/RecipeFilters";
import PageTransition from "@/components/PageTransition";
import { Recipe, recipeService } from "@/services/recipeService";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/");
      return;
    }
    loadRecipes();
  }, [router]);

  const loadRecipes = async () => {
    try {
      const data = await recipeService.getAllRecipes();
      setRecipes(data);
    } catch (error) {
      console.error("Failed to load recipes:", error);
      if (typeof error === "object" && error !== null && "message" in error && typeof (error as any).message === "string" && (error as any).message.includes("token")) {
        localStorage.removeItem("authToken");
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await recipeService.deleteRecipe(id);
      setRecipes(recipes.filter((recipe) => recipe.id !== id));
    } catch (error) {
      console.error("Failed to delete recipe:", error);
    }
  };

  const handleRename = async (id: string, newName: string) => {
    try {
      await recipeService.updateRecipeName(id, newName);
      setRecipes(recipes.map((recipe) => (recipe.id === id ? { ...recipe, title: newName } : recipe)));
    } catch (error) {
      console.error("Failed to rename recipe:", error);
    }
  };

  const sortedRecipes = [...recipes].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "createdAt":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "createdAt-desc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Recipes</h1>
              <p className="text-gray-600">
                {recipes.length === 0
                  ? "No recipes yet. Create your first recipe!"
                  : `${recipes.length} recipe${recipes.length !== 1 ? "s" : ""} in your collection`}
              </p>
            </div>
            {recipes.length > 0 && (
              <Link href="/recipe-generation">
                <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 mt-4 sm:mt-0">
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Recipe
                </Button>
              </Link>
            )}
          </div>

          {recipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-center">
                <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <Plus className="h-12 w-12 text-orange-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">No recipes yet</h2>
                <p className="text-gray-600 mb-8 max-w-md">
                  Start your culinary journey by generating your first AI-powered recipe. It only takes a few
                  ingredients!
                </p>
                <Link href="/recipe-generation">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Generate Your First Recipe
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <RecipeFilters sortBy={sortBy} onSortChange={setSortBy} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} onDelete={handleDelete} onRename={handleRename} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}