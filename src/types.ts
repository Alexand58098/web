export type MealCategory =
  | 'all'
  | 'mains'
  | 'quick'
  | 'pasta'
  | 'healthy'
  | 'desserts'
  | 'soups'
  | 'breakfast';

export type DietaryTag =
  | 'Vegetarian'
  | 'Vegan'
  | 'Gluten-Free'
  | 'Dairy-Free'
  | 'High-Protein'
  | 'Low-Carb'
  | 'One-Pot'
  | 'Comfort Food'
  | 'Healthy'
  | 'Quick & Easy';

export type IngredientCategory =
  | 'Produce'
  | 'Meat & Seafood'
  | 'Dairy & Eggs'
  | 'Pantry & Grains'
  | 'Spices & Herbs'
  | 'Baking & Sweeteners';

export interface Ingredient {
  id: string;
  name: string;
  baseAmount: number; // Base quantity for base servings
  unit: string;
  metricAmount?: number;
  metricUnit?: string;
  imperialAmount?: number;
  imperialUnit?: string;
  category: IngredientCategory;
  notes?: string;
}

export interface InstructionStep {
  stepNumber: number;
  title: string;
  instruction: string;
  timerSeconds?: number;
  timerLabel?: string;
  tip?: string;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: MealCategory;
  prepTime: number; // minutes
  cookTime: number; // minutes
  totalTime: number; // minutes
  servings: number; // default baseline (usually 4)
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  tags: DietaryTag[];
  caloriesPerServing: number;
  macros: {
    protein: number; // grams
    carbs: number; // grams
    fat: number; // grams
  };
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  chefAdvice: string;
  wineOrDrinkPairing?: string;
  isCustom?: boolean;
  createdAt?: string;
}

export interface ShoppingItem {
  id: string;
  recipeId?: string;
  recipeTitle?: string;
  name: string;
  amount: string;
  category: IngredientCategory;
  checked: boolean;
}

export interface CookLog {
  recipeId: string;
  date: string;
  rating?: number;
  notes?: string;
}
