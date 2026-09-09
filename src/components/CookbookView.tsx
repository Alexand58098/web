import React, { useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  ChefHat,
  Plus,
  Star,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Recipe, CookLog } from '../types';
import { RecipeCard } from './RecipeCard';

interface CookbookViewProps {
  recipes: Recipe[];
  savedRecipeIds: string[];
  cookLogs: CookLog[];
  onToggleSave: (id: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onStartCookMode: (recipe: Recipe) => void;
  openAddRecipe: () => void;
  onExploreRecipes: () => void;
}

export const CookbookView: React.FC<CookbookViewProps> = ({
  recipes,
  savedRecipeIds,
  cookLogs,
  onToggleSave,
  onSelectRecipe,
  onStartCookMode,
  openAddRecipe,
  onExploreRecipes,
}) => {
  const [activeTab, setActiveTab] = useState<'saved' | 'history' | 'custom'>('saved');

  const savedRecipes = recipes.filter((r) => savedRecipeIds.includes(r.id));
  const customRecipes = recipes.filter((r) => r.isCustom);

  // Group cook logs with recipe details
  const cookedHistory = cookLogs
    .map((log) => {
      const rec = recipes.find((r) => r.id === log.recipeId);
      return { log, recipe: rec };
    })
    .filter((item) => item.recipe !== undefined);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-amber-950 via-stone-900 to-stone-900 p-6 sm:p-10 border border-amber-900/30 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Personal Culinary Journal</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
              My Private Cookbook
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Your saved favorites, personal culinary experiments, and historical cooking journal.
            </p>
          </div>

          <button
            onClick={openAddRecipe}
            className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Recipe</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'saved'
              ? 'bg-amber-700 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Bookmarked ({savedRecipes.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'history'
              ? 'bg-amber-700 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Cooked Journal ({cookLogs.length})
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'custom'
              ? 'bg-amber-700 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          My Created Recipes ({customRecipes.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'saved' && (
        <div>
          {savedRecipes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/80 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto">
                <Bookmark className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                No recipes bookmarked yet
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
                Explore our curated culinary catalog and tap the bookmark icon on any recipe to save it here for easy access.
              </p>
              <button
                onClick={onExploreRecipes}
                className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                Browse Recipes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isSaved={true}
                  onToggleSave={onToggleSave}
                  onSelectRecipe={onSelectRecipe}
                  onStartCookMode={onStartCookMode}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          {cookedHistory.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/80 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
                <ChefHat className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                You haven't logged any cooked dishes yet
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
                Launch "Cook Mode" on any recipe, complete the steps, and log your tasting notes and ratings here!
              </p>
              <button
                onClick={onExploreRecipes}
                className="px-5 py-2.5 bg-amber-700 text-white rounded-xl text-xs font-semibold hover:bg-amber-800 transition-colors"
              >
                Start Cooking a Recipe
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cookedHistory.map(({ log, recipe }, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={recipe!.imageUrl}
                      alt={recipe!.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0"
                    />
                    <div>
                      <span className="text-[11px] text-stone-400 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(log.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <h4 className="font-serif text-base font-bold text-stone-900">
                        {recipe!.title}
                      </h4>
                      {log.notes && (
                        <p className="text-xs text-stone-600 italic mt-0.5">
                          "{log.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    {log.rating && (
                      <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                        <span className="font-bold text-xs text-amber-900">{log.rating}/5</span>
                      </div>
                    )}
                    <button
                      onClick={() => onStartCookMode(recipe!)}
                      className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                      <span>Cook Again</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'custom' && (
        <div>
          {customRecipes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/80 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                No custom recipes added yet
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
                Have a family secret marinara or a sourdough technique? Add it to your cookbook with custom timers and ingredients.
              </p>
              <button
                onClick={openAddRecipe}
                className="px-5 py-2.5 bg-amber-700 text-white rounded-xl text-xs font-semibold hover:bg-amber-800 transition-colors"
              >
                Create Your First Recipe
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {customRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isSaved={savedRecipeIds.includes(recipe.id)}
                  onToggleSave={onToggleSave}
                  onSelectRecipe={onSelectRecipe}
                  onStartCookMode={onStartCookMode}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
