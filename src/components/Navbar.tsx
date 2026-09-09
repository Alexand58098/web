import React from 'react';
import { ChefHat, BookOpen, Refrigerator, Wrench, Bookmark, ShoppingBag, Plus } from 'lucide-react';

interface NavbarProps {
  activeTab: 'recipes' | 'pantry' | 'tools' | 'cookbook';
  setActiveTab: (tab: 'recipes' | 'pantry' | 'tools' | 'cookbook') => void;
  savedCount: number;
  shoppingListCount: number;
  openShoppingList: () => void;
  openAddRecipe: () => void;
  useMetric: boolean;
  setUseMetric: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  shoppingListCount,
  openShoppingList,
  openAddRecipe,
  useMetric,
  setUseMetric,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            id="brand-logo-btn"
            onClick={() => setActiveTab('recipes')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-700 text-amber-50 flex items-center justify-center shadow-md shadow-amber-900/10 group-hover:bg-amber-800 transition-colors">
              <ChefHat className="w-6 h-6 text-amber-100" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-1.5">
                Cucina
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block mb-1"></span>
              </span>
              <p className="text-[11px] font-medium uppercase tracking-widest text-stone-500">
                Culinary Studio &amp; Cook Guide
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1.5 rounded-xl border border-stone-200/70">
            <button
              id="nav-recipes-btn"
              onClick={() => setActiveTab('recipes')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'recipes'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>Recipes</span>
            </button>

            <button
              id="nav-pantry-btn"
              onClick={() => setActiveTab('pantry')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'pantry'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Refrigerator className="w-4 h-4 text-emerald-700" />
              <span>Pantry Matcher</span>
            </button>

            <button
              id="nav-tools-btn"
              onClick={() => setActiveTab('tools')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'tools'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Wrench className="w-4 h-4 text-blue-700" />
              <span>Kitchen Guide</span>
            </button>

            <button
              id="nav-cookbook-btn"
              onClick={() => setActiveTab('cookbook')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'cookbook'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Bookmark className="w-4 h-4 text-amber-600" />
              <span>My Cookbook</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-amber-100 text-amber-800">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Metric/Imperial toggle */}
            <button
              id="unit-toggle-btn"
              onClick={() => setUseMetric(!useMetric)}
              title={useMetric ? "Switch to Imperial (oz, cups, °F)" : "Switch to Metric (g, ml, °C)"}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs"
            >
              {useMetric ? 'Metric (g, °C)' : 'US (oz, °F)'}
            </button>

            {/* Add Custom Recipe */}
            <button
              id="create-recipe-btn"
              onClick={openAddRecipe}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Recipe</span>
            </button>

            {/* Shopping List Button */}
            <button
              id="open-shopping-list-btn"
              onClick={openShoppingList}
              className="relative p-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 hover:text-amber-800 hover:border-amber-300 transition-all shadow-2xs"
              title="View Shopping Grocery List"
            >
              <ShoppingBag className="w-5 h-5" />
              {shoppingListCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {shoppingListCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Sub Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-stone-200 text-xs">
          <button
            onClick={() => setActiveTab('recipes')}
            className={`flex flex-col items-center gap-1 py-1 px-2 ${activeTab === 'recipes' ? 'text-amber-800 font-bold' : 'text-stone-500'}`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Recipes</span>
          </button>
          <button
            onClick={() => setActiveTab('pantry')}
            className={`flex flex-col items-center gap-1 py-1 px-2 ${activeTab === 'pantry' ? 'text-emerald-800 font-bold' : 'text-stone-500'}`}
          >
            <Refrigerator className="w-4 h-4" />
            <span>Pantry</span>
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`flex flex-col items-center gap-1 py-1 px-2 ${activeTab === 'tools' ? 'text-blue-800 font-bold' : 'text-stone-500'}`}
          >
            <Wrench className="w-4 h-4" />
            <span>Guide</span>
          </button>
          <button
            onClick={() => setActiveTab('cookbook')}
            className={`flex flex-col items-center gap-1 py-1 px-2 ${activeTab === 'cookbook' ? 'text-amber-800 font-bold' : 'text-stone-500'}`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved ({savedCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
