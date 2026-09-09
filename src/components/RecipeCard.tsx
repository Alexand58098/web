import React from 'react';
import { Clock, Users, Star, Flame, Bookmark, ChefHat } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onStartCookMode: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isSaved,
  onToggleSave,
  onSelectRecipe,
  onStartCookMode,
}) => {
  return (
    <div 
      id={`recipe-card-${recipe.id}`}
      className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col hover:-translate-y-1"
    >
      {/* Image Banner */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="pointer-events-auto px-2.5 py-1 text-xs font-semibold rounded-full bg-stone-900/80 text-stone-50 backdrop-blur-md border border-white/20 capitalize">
            {recipe.difficulty}
          </span>

          {/* Bookmark Action */}
          <button
            id={`bookmark-btn-${recipe.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(recipe.id);
            }}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all ${
              isSaved
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white/85 text-stone-700 hover:bg-white hover:text-amber-700'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save Recipe'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bottom Floating Stats */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{recipe.totalTime} mins</span>
          </div>

          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>{recipe.caloriesPerServing} kcal</span>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {recipe.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-600"
              >
                {tag}
              </span>
            ))}
            {recipe.category !== 'all' && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/50 capitalize">
                {recipe.category}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelectRecipe(recipe)}
            className="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1 cursor-pointer"
          >
            {recipe.title}
          </h3>

          {/* Subtitle / Description */}
          <p className="mt-1 text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {recipe.subtitle || recipe.description}
          </p>
        </div>

        {/* Footer Meta & Actions */}
        <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between gap-2">
          {/* Ratings & Servings */}
          <div className="flex items-center gap-3 text-xs text-stone-600">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span className="font-semibold text-stone-900">{recipe.rating}</span>
              <span className="text-stone-400 text-[10px]">({recipe.reviewsCount})</span>
            </div>
            <div className="flex items-center gap-1 text-stone-500">
              <Users className="w-3.5 h-3.5" />
              <span>{recipe.servings}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              id={`cook-mode-btn-${recipe.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onStartCookMode(recipe);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-700 text-white hover:bg-amber-800 transition-colors shadow-2xs"
              title="Step-by-step interactive cooking mode"
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Cook</span>
            </button>
            <button
              id={`view-recipe-btn-${recipe.id}`}
              onClick={() => onSelectRecipe(recipe)}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
