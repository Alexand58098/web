import React, { useState, useMemo } from 'react';
import {
  Refrigerator,
  Plus,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  ChefHat,
  Search,
} from 'lucide-react';
import { Recipe } from '../types';

interface PantryMatcherProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onStartCookMode: (recipe: Recipe) => void;
  onAddIngredientsToShoppingList: (ingredients: Array<{ name: string; amount: string; category: string }>, recipeTitle: string) => void;
}

const COMMON_PANTRY_ITEMS = [
  'Garlic',
  'Olive Oil',
  'Butter',
  'Eggs',
  'Spaghetti',
  'Parmesan',
  'Tomatoes',
  'Chicken',
  'Salmon',
  'Heavy Cream',
  'Lemons',
  'Spinach',
  'Rice',
  'Mushrooms',
  'Onion',
  'Shallots',
  'Flour',
  'Sugar',
  'Apples',
  'Quinoa',
  'Capers',
  'Fresh Herbs',
];

export const PantryMatcher: React.FC<PantryMatcherProps> = ({
  recipes,
  onSelectRecipe,
  onStartCookMode,
  onAddIngredientsToShoppingList,
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([
    'Garlic',
    'Olive Oil',
    'Eggs',
    'Butter',
  ]);
  const [customInput, setCustomInput] = useState('');

  const toggleItem = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i.toLowerCase() !== item.toLowerCase()));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customInput.trim();
    if (clean && !selectedItems.some((i) => i.toLowerCase() === clean.toLowerCase())) {
      setSelectedItems([...selectedItems, clean]);
      setCustomInput('');
    }
  };

  const clearAll = () => {
    setSelectedItems([]);
  };

  // Recipe match ranking
  const matchedRecipes = useMemo(() => {
    if (selectedItems.length === 0) {
      return recipes.map((r) => ({
        recipe: r,
        matchCount: 0,
        totalIngredients: r.ingredients.length,
        matchPercentage: 0,
        missing: r.ingredients.map((i) => i.name),
      }));
    }

    const lowerSelected = selectedItems.map((s) => s.toLowerCase());

    return recipes
      .map((recipe) => {
        let matchCount = 0;
        const missing: string[] = [];

        recipe.ingredients.forEach((ing) => {
          const ingNameLower = ing.name.toLowerCase();
          const hasMatch = lowerSelected.some(
            (sel) => ingNameLower.includes(sel) || sel.includes(ingNameLower.split(' ')[0])
          );
          if (hasMatch) {
            matchCount++;
          } else {
            missing.push(ing.name);
          }
        });

        const total = recipe.ingredients.length;
        const matchPercentage = Math.round((matchCount / total) * 100);

        return {
          recipe,
          matchCount,
          totalIngredients: total,
          matchPercentage,
          missing,
        };
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [recipes, selectedItems]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-emerald-950 via-stone-900 to-stone-900 p-6 sm:p-10 border border-emerald-900/30 text-white shadow-lg">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <Refrigerator className="w-3.5 h-3.5" />
            <span>Smart Pantry &amp; Fridge Matcher</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
            What's in your kitchen today?
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Select what you have in your fridge or cupboards. We'll instantly calculate which gourmet recipes you can cook right now with zero food waste.
          </p>
        </div>
      </div>

      {/* Ingredient Selector Box */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
              <span>Your Selected Ingredients</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                {selectedItems.length}
              </span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Click staples below to toggle or type any item in your fridge
            </p>
          </div>

          {selectedItems.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-stone-500 hover:text-rose-600 font-medium self-start sm:self-auto"
            >
              Clear all selections
            </button>
          )}
        </div>

        {/* Custom Input Form */}
        <form onSubmit={handleAddCustom} className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Type any ingredient (e.g., mushrooms, thyme)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>

        {/* Selected Chips */}
        {selectedItems.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
            {selectedItems.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold shadow-2xs"
              >
                <span>{item}</span>
                <button
                  onClick={() => toggleItem(item)}
                  className="p-0.5 rounded-full hover:bg-emerald-200 text-emerald-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Quick Common Items Suggestions */}
        <div>
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-2.5">
            Quick Add Pantry Staples:
          </span>
          <div className="flex flex-wrap gap-2">
            {COMMON_PANTRY_ITEMS.map((item) => {
              const isSelected = selectedItems.some((s) => s.toLowerCase() === item.toLowerCase());
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleItem(item)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {isSelected ? `✓ ${item}` : `+ ${item}`}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Matched Recipes Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-stone-900">
            Matched Recipes ({matchedRecipes.length})
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            Sorted by highest pantry ingredient availability
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {matchedRecipes.map(({ recipe, matchCount, totalIngredients, matchPercentage, missing }) => {
            const isFullMatch = matchPercentage >= 80;
            const isPartial = matchPercentage >= 40 && matchPercentage < 80;

            return (
              <div
                key={recipe.id}
                className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="p-5 flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0 bg-stone-100"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    {/* Badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          isFullMatch
                            ? 'bg-emerald-100 text-emerald-800'
                            : isPartial
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {isFullMatch ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{matchPercentage}% Match</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            <span>{matchPercentage}% Match</span>
                          </>
                        )}
                      </span>
                      <span className="text-xs text-stone-400 font-medium">
                        {matchCount} of {totalIngredients} ingredients
                      </span>
                    </div>

                    <h3 
                      onClick={() => onSelectRecipe(recipe)}
                      className="font-serif text-base sm:text-lg font-bold text-stone-900 hover:text-amber-800 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {recipe.title}
                    </h3>

                    <p className="text-xs text-stone-500 line-clamp-1">
                      {recipe.totalTime} mins • {recipe.difficulty} • {recipe.caloriesPerServing} kcal
                    </p>

                    {/* Missing items callout */}
                    {missing.length > 0 && (
                      <div className="text-[11px] text-stone-500 line-clamp-1 pt-1">
                        <span className="text-rose-700 font-medium">Missing: </span>
                        <span>{missing.slice(0, 3).join(', ')}</span>
                        {missing.length > 3 && ` +${missing.length - 3} more`}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card footer actions */}
                <div className="px-5 py-3 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
                  {missing.length > 0 ? (
                    <button
                      onClick={() => {
                        const itemsToAdd = missing.map((m) => ({
                          name: m,
                          amount: 'As needed',
                          category: 'Pantry & Grains',
                        }));
                        onAddIngredientsToShoppingList(itemsToAdd, recipe.title);
                      }}
                      className="text-stone-600 hover:text-amber-800 font-medium flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-700" />
                      <span>Add missing to grocery list</span>
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Ready to cook now!
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onStartCookMode(recipe)}
                      className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-semibold flex items-center gap-1 shadow-2xs"
                    >
                      <ChefHat className="w-3.5 h-3.5" />
                      <span>Cook</span>
                    </button>
                    <button
                      onClick={() => onSelectRecipe(recipe)}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 font-medium"
                    >
                      Recipe
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
