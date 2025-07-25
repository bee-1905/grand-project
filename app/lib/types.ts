export interface Recipe {
  id: string
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  prepTime: number
  cookTime: number
  servings: number
  difficulty: "Easy" | "Medium" | "Hard"
  cuisine: string
  image: string
  createdAt: Date
  tags: string[]
}

export interface RecipeFormData {
  ingredients: string
  servings: number
  cookTime: number
  difficulty: "Easy" | "Medium" | "Hard"
  cuisine: string
}

export type SortOption = "date-desc" | "date-asc" | "name-asc" | "name-desc"
