/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  Flame,
  Clock,
  ChefHat,
  Heart,
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  X,
  ArrowRight,
} from 'lucide-react';
import { Recipe, MealCategory, DietaryTag, ShoppingItem, CookLog, IngredientCategory } from './types';
import { INITIAL_RECIPES } from './data/recipes';
import { Navbar } from './components/Navbar';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { CookModeModal } from './components/CookModeModal';
import { PantryMatcher } from './components/PantryMatcher';
import { KitchenToolsGuide } from './components/KitchenToolsGuide';
import { ShoppingListModal } from './components/ShoppingListModal';
import { AddRecipeModal } from './components/AddRecipeModal';
import { CookbookView } from './components/CookbookView';

export default function App() {
  // Persistence state
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const stored = localStorage.getItem('cucina_custom_recipes');
      if (stored) {
        const parsed = JSON.parse(stored);
        return [...INITIAL_RECIPES, ...parsed];
      }
    } catch {
      // fallback
    }
    return INITIAL_RECIPES;
  });

  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('cucina_saved_recipes');
      return stored ? JSON.parse(stored) : ['salmon-tuscan', 'pasta-carbonara'];
    } catch {
      return ['salmon-tuscan', 'pasta-carbonara'];
    }
  });

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    try {
      const stored = localStorage.getItem('cucina_shopping_list');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [cookLogs, setCookLogs] = useState<CookLog[]>(() => {
    try {
      const stored = localStorage.getItem('cucina_cook_logs');
      return stored
        ? JSON.parse(stored)
        : [
            {
              recipeId: 'pasta-carbonara',
              date: new Date(Date.now() - 86400000 * 2).toISOString(),
              rating: 5,
              notes: 'Followed the off-heat mantecatura rule: zero curdling, super silky gloss!',
            },
          ];
    } catch {
      return [];
    }
  });

  const [useMetric, setUseMetric] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('cucina_use_metric');
      return stored !== null ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'recipes' | 'pantry' | 'tools' | 'cookbook'>('recipes');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [cookModeRecipe, setCookModeRecipe] = useState<Recipe | null>(null);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>('all');
  const [selectedDietaryTag, setSelectedDietaryTag] = useState<string>('all');
  const [maxTotalTime, setMaxTotalTime] = useState<number>(120);
  const [sortBy, setSortBy] = useState<'rating' | 'time' | 'calories'>('rating');

  // Sync to localStorage
  useEffect(() => {
    try {
      const customOnly = recipes.filter((r) => r.isCustom);
      localStorage.setItem('cucina_custom_recipes', JSON.stringify(customOnly));
    } catch {}
  }, [recipes]);

  useEffect(() => {
    try {
      localStorage.setItem('cucina_saved_recipes', JSON.stringify(savedRecipeIds));
    } catch {}
  }, [savedRecipeIds]);

  useEffect(() => {
    try {
      localStorage.setItem('cucina_shopping_list', JSON.stringify(shoppingList));
    } catch {}
  }, [shoppingList]);

  useEffect(() => {
    try {
      localStorage.setItem('cucina_cook_logs', JSON.stringify(cookLogs));
    } catch {}
  }, [cookLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('cucina_use_metric', JSON.stringify(useMetric));
    } catch {}
  }, [useMetric]);

  // Handlers
  const handleToggleSave = (id: string) => {
    setSavedRecipeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddIngredientsToShoppingList = (
    newItems: Array<{ name: string; amount: string; category: string }>,
    recipeTitle: string
  ) => {
    const itemsToAdd: ShoppingItem[] = newItems.map((item, idx) => ({
      id: `shop-${Date.now()}-${idx}`,
      recipeTitle,
      name: item.name,
      amount: item.amount,
      category: (item.category as IngredientCategory) || 'Produce',
      checked: false,
    }));
    setShoppingList((prev) => [...prev, ...itemsToAdd]);
  };

  const handleToggleShoppingItem = (id: string) => {
    setShoppingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleDeleteShoppingItem = (id: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCheckedShopping = () => {
    setShoppingList((prev) => prev.filter((item) => !item.checked));
  };

  const handleClearAllShopping = () => {
    setShoppingList([]);
  };

  const handleAddCustomShoppingItem = (name: string, amount: string, category: IngredientCategory) => {
    const newItem: ShoppingItem = {
      id: `shop-custom-${Date.now()}`,
      name,
      amount,
      category,
      checked: false,
    };
    setShoppingList((prev) => [...prev, newItem]);
  };

  const handleAddCustomRecipe = (recipe: Recipe) => {
    setRecipes((prev) => [recipe, ...prev]);
    setSelectedRecipe(recipe);
  };

  const handleCompleteCook = (log: CookLog) => {
    setCookLogs((prev) => [log, ...prev]);
  };

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return recipes
      .filter((r) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = r.title.toLowerCase().includes(q);
          const matchSub = r.subtitle.toLowerCase().includes(q);
          const matchTag = r.tags.some((t) => t.toLowerCase().includes(q));
          const matchIng = r.ingredients.some((i) => i.name.toLowerCase().includes(q));
          if (!matchTitle && !matchSub && !matchTag && !matchIng) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && r.category !== selectedCategory) {
          return false;
        }

        // Dietary Tag filter
        if (selectedDietaryTag !== 'all' && !r.tags.includes(selectedDietaryTag as DietaryTag)) {
          return false;
        }

        // Max cook time
        if (r.totalTime > maxTotalTime) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'time') return a.totalTime - b.totalTime;
        if (sortBy === 'calories') return a.caloriesPerServing - b.caloriesPerServing;
        return 0;
      });
  }, [recipes, searchQuery, selectedCategory, selectedDietaryTag, maxTotalTime, sortBy]);

  // Featured Recipe of the Day
  const featuredRecipe = recipes[0];

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedRecipeIds.length}
        shoppingListCount={shoppingList.filter((i) => !i.checked).length}
        openShoppingList={() => setIsShoppingListOpen(true)}
        openAddRecipe={() => setIsAddRecipeOpen(true)}
        useMetric={useMetric}
        setUseMetric={setUseMetric}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* TAB 1: RECIPES CATALOG */}
        {activeTab === 'recipes' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Editorial Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white shadow-xl">
              {/* Background ambient lighting */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
                style={{ backgroundImage: `url(${featuredRecipe?.imageUrl})` }}
              />
              <div className="absolute inset-0 bg-linear-to-r from-stone-950 via-stone-950/80 to-transparent" />

              <div className="relative p-6 sm:p-12 lg:p-14 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Editor's Featured Centerpiece</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
                  {featuredRecipe?.title}
                </h1>

                <p className="text-stone-300 text-sm sm:text-base leading-relaxed line-clamp-2">
                  {featuredRecipe?.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300 pt-2">
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {featuredRecipe?.totalTime} mins total
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    {featuredRecipe?.caloriesPerServing} kcal
                  </span>
                  <span className="capitalize bg-amber-600/40 text-amber-200 px-3 py-1 rounded-full border border-amber-500/30 font-semibold">
                    {featuredRecipe?.difficulty}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 pt-3">
                  <button
                    id="hero-cook-mode-btn"
                    onClick={() => setCookModeRecipe(featuredRecipe)}
                    className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm shadow-md flex items-center gap-2 transition-all hover:shadow-lg"
                  >
                    <ChefHat className="w-4 h-4" />
                    <span>Start Cooking Now</span>
                  </button>
                  <button
                    id="hero-recipe-detail-btn"
                    onClick={() => setSelectedRecipe(featuredRecipe)}
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md transition-colors"
                  >
                    View Ingredients &amp; Guide
                  </button>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    id="recipe-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by dish, ingredient (e.g. salmon, garlic, pasta), or dietary style..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 shrink-0">
                  <SlidersHorizontal className="w-4 h-4 text-stone-400" />
                  <span>Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs font-medium focus:outline-none"
                  >
                    <option value="rating">Highest Rated ★</option>
                    <option value="time">Fastest Cooking Time</option>
                    <option value="calories">Lowest Calories</option>
                  </select>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {(
                  [
                    { id: 'all', label: 'All Recipes' },
                    { id: 'quick', label: 'Quick (<30m)' },
                    { id: 'mains', label: 'Mains & Meats' },
                    { id: 'pasta', label: 'Pasta & Italian' },
                    { id: 'healthy', label: 'Healthy Bowls' },
                    { id: 'breakfast', label: 'Breakfast' },
                    { id: 'soups', label: 'Soups & Bisques' },
                    { id: 'desserts', label: 'Baking & Sweets' },
                  ] as Array<{ id: MealCategory; label: string }>
                ).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-amber-700 text-white font-semibold shadow-2xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Dietary Tags Secondary Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-stone-400 font-semibold uppercase text-[10px] tracking-wider mr-1">
                    Diet:
                  </span>
                  {['all', 'Vegetarian', 'Gluten-Free', 'High-Protein', 'One-Pot', 'Vegan'].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedDietaryTag(tag)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                          selectedDietaryTag === tag
                            ? 'bg-stone-900 text-white font-semibold'
                            : 'bg-stone-50 border border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {tag === 'all' ? 'Any Diet' : tag}
                      </button>
                    )
                  )}
                </div>

                {/* Reset Filters */}
                {(searchQuery || selectedCategory !== 'all' || selectedDietaryTag !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedDietaryTag('all');
                    }}
                    className="text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-1 text-[11px]"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset filters</span>
                  </button>
                )}
              </div>
            </div>

            {/* Recipes Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
                  {selectedCategory === 'all' ? 'All Culinary Creations' : `Curated ${selectedCategory}`}
                  <span className="ml-2 text-sm text-stone-400 font-sans font-normal">
                    ({filteredRecipes.length} dishes found)
                  </span>
                </h2>
              </div>

              {filteredRecipes.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/80 p-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    No recipes match your search
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
                    Try adjusting your search terms, removing dietary filters, or browse our full collection.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedDietaryTag('all');
                    }}
                    className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isSaved={savedRecipeIds.includes(recipe.id)}
                      onToggleSave={handleToggleSave}
                      onSelectRecipe={setSelectedRecipe}
                      onStartCookMode={setCookModeRecipe}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PANTRY MATCHER */}
        {activeTab === 'pantry' && (
          <PantryMatcher
            recipes={recipes}
            onSelectRecipe={setSelectedRecipe}
            onStartCookMode={setCookModeRecipe}
            onAddIngredientsToShoppingList={handleAddIngredientsToShoppingList}
          />
        )}

        {/* TAB 3: KITCHEN TOOLS & GUIDE */}
        {activeTab === 'tools' && <KitchenToolsGuide />}

        {/* TAB 4: MY COOKBOOK */}
        {activeTab === 'cookbook' && (
          <CookbookView
            recipes={recipes}
            savedRecipeIds={savedRecipeIds}
            cookLogs={cookLogs}
            onToggleSave={handleToggleSave}
            onSelectRecipe={setSelectedRecipe}
            onStartCookMode={setCookModeRecipe}
            openAddRecipe={() => setIsAddRecipeOpen(true)}
            onExploreRecipes={() => setActiveTab('recipes')}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-stone-200/80 bg-white/70 py-12 text-stone-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-700 text-amber-50 flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif font-bold text-stone-900 text-sm">Cucina Studio</span>
              <p className="text-[11px] text-stone-400">Crafted for home cooks &amp; culinary enthusiasts</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-stone-500 font-medium">
            <button onClick={() => setActiveTab('recipes')} className="hover:text-stone-900">
              Recipe Catalog
            </button>
            <button onClick={() => setActiveTab('pantry')} className="hover:text-stone-900">
              Pantry Matcher
            </button>
            <button onClick={() => setActiveTab('tools')} className="hover:text-stone-900">
              Kitchen Guide &amp; SOS
            </button>
            <button onClick={() => setIsShoppingListOpen(true)} className="hover:text-stone-900">
              Grocery List ({shoppingList.length})
            </button>
          </div>

          <p className="text-stone-400 text-[11px]">
            © {new Date().getFullYear()} Cucina Culinary Companion. Bon Appétit.
          </p>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        isSaved={selectedRecipe ? savedRecipeIds.includes(selectedRecipe.id) : false}
        onToggleSave={handleToggleSave}
        onStartCookMode={(recipe) => {
          setSelectedRecipe(null);
          setCookModeRecipe(recipe);
        }}
        onAddIngredientsToShoppingList={handleAddIngredientsToShoppingList}
        useMetric={useMetric}
        setUseMetric={setUseMetric}
      />

      {/* 2. Interactive Kitchen Cook Mode */}
      <CookModeModal
        recipe={cookModeRecipe}
        onClose={() => setCookModeRecipe(null)}
        onCompleteCook={handleCompleteCook}
        useMetric={useMetric}
      />

      {/* 3. Grocery Shopping List Drawer/Modal */}
      <ShoppingListModal
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
        items={shoppingList}
        onToggleItem={handleToggleShoppingItem}
        onDeleteItem={handleDeleteShoppingItem}
        onClearChecked={handleClearCheckedShopping}
        onClearAll={handleClearAllShopping}
        onAddItem={handleAddCustomShoppingItem}
      />

      {/* 4. Add Custom Recipe Modal */}
      <AddRecipeModal
        isOpen={isAddRecipeOpen}
        onClose={() => setIsAddRecipeOpen(false)}
        onAddRecipe={handleAddCustomRecipe}
      />
    </div>
  );
}
