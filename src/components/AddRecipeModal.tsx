import React, { useState } from 'react';
import { X, Plus, Trash2, ChefHat, Sparkles } from 'lucide-react';
import { Recipe, MealCategory, DietaryTag, IngredientCategory } from '../types';

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecipe: (recipe: Recipe) => void;
}

export const AddRecipeModal: React.FC<AddRecipeModalProps> = ({
  isOpen,
  onClose,
  onAddRecipe,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MealCategory>('mains');
  const [prepTime, setPrepTime] = useState<number>(15);
  const [cookTime, setCookTime] = useState<number>(20);
  const [servings, setServings] = useState<number>(4);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Advanced'>('Easy');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80');
  const [chefAdvice, setChefAdvice] = useState('');

  // Ingredients state
  const [ingredients, setIngredients] = useState<Array<{ name: string; amount: number; unit: string; category: IngredientCategory }>>([
    { name: 'Olive Oil', amount: 2, unit: 'tbsp', category: 'Pantry & Grains' },
    { name: 'Garlic cloves', amount: 3, unit: 'cloves', category: 'Produce' },
  ]);

  // Instructions state
  const [instructions, setInstructions] = useState<Array<{ title: string; instruction: string; timerMinutes?: number; tip?: string }>>([
    { title: 'Prep the ingredients', instruction: 'Chop aromatics and season main ingredients with sea salt and pepper.' },
    { title: 'Cook and sear', instruction: 'Heat pan over medium-high heat and cook until golden brown.', timerMinutes: 5 },
  ]);

  const addIngredientField = () => {
    setIngredients([...ingredients, { name: '', amount: 1, unit: 'piece', category: 'Produce' }]);
  };

  const removeIngredientField = (idx: number) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const addInstructionField = () => {
    setInstructions([...instructions, { title: `Step ${instructions.length + 1}`, instruction: '' }]);
  };

  const removeInstructionField = (idx: number) => {
    setInstructions(instructions.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRecipe: Recipe = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || 'A homemade culinary masterpiece',
      description: description.trim() || subtitle.trim(),
      category,
      prepTime,
      cookTime,
      totalTime: prepTime + cookTime,
      servings,
      difficulty,
      rating: 5.0,
      reviewsCount: 1,
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
      tags: ['Comfort Food'],
      caloriesPerServing: 450,
      macros: { protein: 25, carbs: 40, fat: 18 },
      chefAdvice: chefAdvice.trim() || 'Always taste your food as you cook and season with sea salt at each stage.',
      ingredients: ingredients
        .filter((ing) => ing.name.trim().length > 0)
        .map((ing, i) => ({
          id: `custom-ing-${i}`,
          name: ing.name.trim(),
          baseAmount: ing.amount || 1,
          unit: ing.unit || 'unit',
          category: ing.category,
        })),
      instructions: instructions
        .filter((inst) => inst.instruction.trim().length > 0)
        .map((inst, i) => ({
          stepNumber: i + 1,
          title: inst.title.trim() || `Step ${i + 1}`,
          instruction: inst.instruction.trim(),
          timerSeconds: inst.timerMinutes ? inst.timerMinutes * 60 : undefined,
          tip: inst.tip?.trim() || undefined,
        })),
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    onAddRecipe(newRecipe);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        id="add-recipe-dialog"
        className="w-full max-w-3xl bg-[#FCFAF7] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#FCFAF7] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-stone-900 text-white">
              <ChefHat className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Add Custom Family Recipe
              </h2>
              <p className="text-xs text-stone-500">
                Create and save your private culinary creations to your cookbook
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-stone-200 bg-stone-100 text-stone-700 hover:bg-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-6 text-xs sm:text-sm">
          {/* Basics */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 border-b border-stone-200 pb-1">
              Recipe Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Recipe Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Grandma's Braised Beef Short Ribs"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Slow-simmered in red wine and fresh rosemary"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MealCategory)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-800"
                >
                  <option value="mains">Mains</option>
                  <option value="pasta">Pasta</option>
                  <option value="quick">Quick (&lt;30m)</option>
                  <option value="healthy">Healthy</option>
                  <option value="soups">Soups</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="desserts">Desserts</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-800"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Prep (Mins)</label>
                <input
                  type="number"
                  min="1"
                  value={prepTime}
                  onChange={(e) => setPrepTime(parseInt(e.target.value) || 10)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Cook (Mins)</label>
                <input
                  type="number"
                  min="1"
                  value={cookTime}
                  onChange={(e) => setCookTime(parseInt(e.target.value) || 15)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-700">Cover Photo URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs"
              />
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Ingredients ({ingredients.length})
              </h3>
              <button
                type="button"
                onClick={addIngredientField}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ingredient</span>
              </button>
            </div>

            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="number"
                    step="any"
                    value={ing.amount}
                    onChange={(e) => {
                      const copy = [...ingredients];
                      copy[idx].amount = parseFloat(e.target.value) || 1;
                      setIngredients(copy);
                    }}
                    placeholder="Qty"
                    className="w-16 px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 text-xs"
                  />
                  <input
                    type="text"
                    value={ing.unit}
                    onChange={(e) => {
                      const copy = [...ingredients];
                      copy[idx].unit = e.target.value;
                      setIngredients(copy);
                    }}
                    placeholder="Unit (e.g. tbsp, g)"
                    className="w-24 px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 text-xs"
                  />
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => {
                      const copy = [...ingredients];
                      copy[idx].name = e.target.value;
                      setIngredients(copy);
                    }}
                    placeholder="Ingredient name"
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredientField(idx)}
                    className="p-1 text-stone-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Cooking Steps ({instructions.length})
              </h3>
              <button
                type="button"
                onClick={addInstructionField}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-3">
              {instructions.map((inst, idx) => (
                <div key={idx} className="p-3 bg-white border border-stone-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-amber-800">Step {idx + 1}</span>
                    <input
                      type="text"
                      value={inst.title}
                      onChange={(e) => {
                        const copy = [...instructions];
                        copy[idx].title = e.target.value;
                        setInstructions(copy);
                      }}
                      placeholder="Step Title (e.g. Sear protein)"
                      className="flex-1 px-2 py-1 rounded bg-stone-50 border border-stone-200 text-xs"
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-stone-500">Timer:</span>
                      <input
                        type="number"
                        value={inst.timerMinutes || ''}
                        onChange={(e) => {
                          const copy = [...instructions];
                          copy[idx].timerMinutes = parseInt(e.target.value) || undefined;
                          setInstructions(copy);
                        }}
                        placeholder="min"
                        className="w-14 px-1.5 py-1 rounded bg-stone-50 border border-stone-200 text-xs text-center"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeInstructionField(idx)}
                      className="p-1 text-stone-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={inst.instruction}
                    onChange={(e) => {
                      const copy = [...instructions];
                      copy[idx].instruction = e.target.value;
                      setInstructions(copy);
                    }}
                    placeholder="Describe what to do in this step..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Chef's Advice */}
          <div className="space-y-1">
            <label className="font-semibold text-stone-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Chef's Secret / Pro Tip</span>
            </label>
            <input
              type="text"
              value={chefAdvice}
              onChange={(e) => setChefAdvice(e.target.value)}
              placeholder="e.g. Always let steak rest for 5 minutes under foil before slicing."
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold shadow-md"
            >
              Save Recipe to Cookbook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
