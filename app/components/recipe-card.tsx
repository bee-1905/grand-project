"use client"

import React from "react"
import { Clock, Users, ChefHat } from "lucide-react"
import type { Recipe } from "@/lib/types"

interface RecipeCardProps {
  recipe: Recipe
  onClick: () => void
  onRename: (id: string, newTitle: string) => void
  onDelete: (id: string) => void
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden border border-gray-200"
      onClick={onClick}
    >
      {/* Image placeholder */}
      <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
        <ChefHat className="w-16 h-16 text-white opacity-50" />
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {recipe.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {recipe.description}
        </p>
        
        {/* Recipe details */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.cookTime}m</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings}</span>
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex gap-2 flex-wrap">
          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
            {recipe.difficulty}
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {recipe.cuisine}
          </span>
        </div>
      </div>
    </div>
  )
}