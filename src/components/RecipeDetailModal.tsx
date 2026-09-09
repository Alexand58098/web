import React, { useState } from 'react';
import {
  X,
  Clock,
  Users,
  Flame,
  Star,
  ChefHat,
  Bookmark,
  Share2,
  Check,
  Plus,
  Minus,
  Sparkles,
  Wine,
  ShoppingBag,
  Printer,
  CheckCircle2,
  Timer as TimerIcon,
} from 'lucide-react';
import { Recipe, Ingredient } from '../types';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onStartCookMode: (recipe: Recipe) => void;
  onAddIngredientsToShoppingList: (ingredients: Array<{ name: string; amount: string; category: string }>, recipeTitle: string) => void;
  useMetric: boolean;
  setUseMetric: (val: boolean) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  isSaved,
  onToggleSave,
  onStartCookMode,
  onAddIngredientsToShoppingList,
  useMetric,
  setUseMetric,
}) => {
  if (!recipe) return null;

  const [currentServings, setCurrentServings] = useState<number>(recipe.servings || 4);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedToList, setAddedToList] = useState(false);

  // Scaled factor
  const scale = currentServings / (recipe.servings || 4);

  // Format scaled amount nicely (e.g. 0.5 -> 1/2 or decimal rounded)
  const formatAmount = (ing: Ingredient) => {
    if (useMetric && ing.metricAmount) {
      const scaled = ing.metricAmount * scale;
      return `${Math.round(scaled * 10) / 10} ${ing.metricUnit || 'g'}`;
    }
    if (!useMetric && ing.imperialAmount) {
      const scaled = ing.imperialAmount * scale;
      return `${Math.round(scaled * 100) / 100} ${ing.imperialUnit || 'oz'}`;
    }
    const scaled = ing.baseAmount * scale;
    // pretty fraction or number
    if (scaled === 0.25) return '1/4';
    if (scaled === 0.33) return '1/3';
    if (scaled === 0.5) return '1/2';
    if (scaled === 0.66 || scaled === 0.67) return '2/3';
    if (scaled === 0.75) return '3/4';
    return `${Math.round(scaled * 10) / 10} ${ing.unit}`;
  };

  const toggleCheck = (id: string) => {
    setCheckedIngredients((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddAllToShoppingList = () => {
    const items = recipe.ingredients.map((ing) => ({
      name: ing.name,
      amount: formatAmount(ing),
      category: ing.category,
    }));
    onAddIngredientsToShoppingList(items, recipe.title);
    setAddedToList(true);
    setTimeout(() => setAddedToList(false), 2500);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 md:p-8 animate-in fade-in duration-200">
      <div 
        id="recipe-detail-dialog"
        className="relative w-full max-w-4xl bg-[#FCFAF7] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="sticky top-0 z-20 bg-[#FCFAF7]/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 capitalize">
              {recipe.category}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              {recipe.difficulty} Level
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(recipe.id)}
              className={`p-2 rounded-xl border transition-all ${
                isSaved
                  ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
              title="Save Recipe"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-colors relative"
              title="Share Recipe"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-colors"
              title="Print Recipe"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              id="close-recipe-detail-btn"
              onClick={onClose}
              className="p-2 rounded-xl border border-stone-200 bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 divide-y divide-stone-200/80">
          {/* Hero Section */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Text Meta */}
              <div className="md:col-span-7 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-amber-700 text-sm font-medium mb-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span className="font-bold text-stone-900">{recipe.rating}</span>
                  <span className="text-stone-400">({recipe.reviewsCount} reviews)</span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight leading-tight">
                  {recipe.title}
                </h1>

                <p className="mt-2 text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
                  {recipe.subtitle || recipe.description}
                </p>

                {/* Key Metrics Strip */}
                <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 gap-3">
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 text-center">
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">Prep</span>
                    <span className="font-semibold text-stone-800 text-sm">{recipe.prepTime}m</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 text-center">
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">Cook</span>
                    <span className="font-semibold text-stone-800 text-sm">{recipe.cookTime}m</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 text-center">
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">Total</span>
                    <span className="font-semibold text-amber-700 text-sm">{recipe.totalTime}m</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 text-center">
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">Energy</span>
                    <span className="font-semibold text-stone-800 text-sm">{recipe.caloriesPerServing} kcal</span>
                  </div>
                </div>

                {/* CTA Cook Mode Button */}
                <div className="mt-6">
                  <button
                    id="start-guided-cook-btn"
                    onClick={() => {
                      onClose();
                      onStartCookMode(recipe);
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2.5 transition-all hover:shadow-lg group"
                  >
                    <ChefHat className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span>Start Guided Cook Mode</span>
                  </button>
                </div>
              </div>

              {/* Photo Banner */}
              <div className="md:col-span-5">
                <div className="relative aspect-4/3 sm:aspect-square rounded-2xl overflow-hidden shadow-md border border-stone-200/60 bg-stone-100">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Nutritional Macros Strip */}
          <div className="px-6 py-4 bg-stone-100/60 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-semibold text-stone-700">Macros per Serving:</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 font-medium text-stone-600">
              <span>Protein: <strong className="text-stone-900">{recipe.macros.protein}g</strong></span>
              <span>Carbohydrates: <strong className="text-stone-900">{recipe.macros.carbs}g</strong></span>
              <span>Fat: <strong className="text-stone-900">{recipe.macros.fat}g</strong></span>
            </div>
          </div>

          {/* Main Recipe Body: Ingredients & Instructions */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Ingredients Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex flex-col gap-3 pb-3 border-b border-stone-200">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-stone-900">Ingredients</h2>
                  {/* Unit switcher */}
                  <button
                    onClick={() => setUseMetric(!useMetric)}
                    className="text-xs px-2.5 py-1 rounded-md border border-stone-300 bg-white font-medium text-stone-600 hover:text-stone-900"
                  >
                    {useMetric ? 'Metric (g, ml)' : 'US (cups, oz)'}
                  </button>
                </div>

                {/* Servings Adjuster */}
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
                  <span className="text-xs font-medium text-stone-600 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-stone-400" />
                    Adjust Servings:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      id="decrement-servings-btn"
                      onClick={() => setCurrentServings(Math.max(1, currentServings - 1))}
                      className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors"
                      title="Decrease servings"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-stone-900 text-sm">
                      {currentServings}
                    </span>
                    <button
                      id="increment-servings-btn"
                      onClick={() => setCurrentServings(currentServings + 1)}
                      className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors"
                      title="Increase servings"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive Ingredient List */}
              <ul className="space-y-2.5">
                {recipe.ingredients.map((ing) => {
                  const isChecked = checkedIngredients[ing.id];
                  return (
                    <li
                      key={ing.id}
                      onClick={() => toggleCheck(ing.id)}
                      className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-stone-100/80 border-stone-200 text-stone-400'
                          : 'bg-white border-stone-200/90 text-stone-800 hover:border-amber-300'
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center transition-colors ${
                        isChecked ? 'bg-amber-700 text-white' : 'border border-stone-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-3" />}
                      </div>
                      <div className="flex-1 text-xs sm:text-sm">
                        <span className={`font-semibold text-stone-900 ${isChecked ? 'line-through text-stone-400' : ''}`}>
                          {formatAmount(ing)}
                        </span>{' '}
                        <span className={isChecked ? 'line-through' : ''}>{ing.name}</span>
                        {ing.notes && (
                          <p className="text-[11px] text-stone-400 mt-0.5 italic">{ing.notes}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Add to grocery list button */}
              <button
                id="add-all-grocery-btn"
                onClick={handleAddAllToShoppingList}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  addedToList
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300 shadow-2xs'
                }`}
              >
                {addedToList ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Ingredients Added to Grocery List!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-amber-700" />
                    <span>Add All Ingredients to Shopping List</span>
                  </>
                )}
              </button>

              {/* Sommelier & Beverage Pairing */}
              {recipe.wineOrDrinkPairing && (
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs">
                  <div className="flex items-center gap-2 text-amber-900 font-semibold mb-1">
                    <Wine className="w-4 h-4 text-amber-700" />
                    <span>Sommelier Pairing Suggestion</span>
                  </div>
                  <p className="text-amber-800 leading-relaxed">{recipe.wineOrDrinkPairing}</p>
                </div>
              )}
            </div>

            {/* Step-by-Step Instructions Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h2 className="font-serif text-xl font-bold text-stone-900">Preparation &amp; Steps</h2>
                <span className="text-xs text-stone-500 font-medium">
                  {recipe.instructions.length} Steps
                </span>
              </div>

              {/* Chef Advice Callout */}
              {recipe.chefAdvice && (
                <div className="p-4 rounded-xl bg-stone-900 text-stone-100 text-xs leading-relaxed flex gap-3 items-start shadow-xs">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300 block mb-1 font-semibold uppercase tracking-wider text-[11px]">
                      Chef's Golden Rule
                    </strong>
                    <p className="text-stone-300">{recipe.chefAdvice}</p>
                  </div>
                </div>
              )}

              {/* Steps List */}
              <div className="space-y-4">
                {recipe.instructions.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-4 rounded-xl bg-white border border-stone-200/90 shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/50">
                        Step {step.stepNumber}: {step.title}
                      </span>
                      {step.timerSeconds && (
                        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium bg-stone-100 px-2 py-0.5 rounded-md">
                          <TimerIcon className="w-3.5 h-3.5 text-amber-700" />
                          <span>{Math.round(step.timerSeconds / 60)} min timer in Cook Mode</span>
                        </div>
                      )}
                    </div>

                    <p className="text-stone-700 text-sm leading-relaxed">
                      {step.instruction}
                    </p>

                    {step.tip && (
                      <div className="pt-2 mt-2 border-t border-stone-100 flex items-start gap-2 text-xs text-stone-500">
                        <span className="font-semibold text-amber-700 shrink-0">Pro Tip:</span>
                        <p className="italic">{step.tip}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
