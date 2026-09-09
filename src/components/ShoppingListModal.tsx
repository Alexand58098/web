import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Check,
  Plus,
  Trash2,
  Copy,
  Printer,
  Sparkles,
} from 'lucide-react';
import { ShoppingItem, IngredientCategory } from '../types';

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ShoppingItem[];
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onClearChecked: () => void;
  onClearAll: () => void;
  onAddItem: (name: string, amount: string, category: IngredientCategory) => void;
}

export const ShoppingListModal: React.FC<ShoppingListModalProps> = ({
  isOpen,
  onClose,
  items,
  onToggleItem,
  onDeleteItem,
  onClearChecked,
  onClearAll,
  onAddItem,
}) => {
  if (!isOpen) return null;

  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('1');
  const [newItemCategory, setNewItemCategory] = useState<IngredientCategory>('Produce');
  const [copied, setCopied] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem(newItemName.trim(), newItemAmount.trim() || '1', newItemCategory);
    setNewItemName('');
    setNewItemAmount('1');
  };

  const handleCopy = () => {
    if (items.length === 0) return;
    const text = items
      .map((i) => `[${i.checked ? 'X' : ' '}] ${i.amount} ${i.name} (${i.category})`)
      .join('\n');
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Group items by category
  const categories: IngredientCategory[] = [
    'Produce',
    'Meat & Seafood',
    'Dairy & Eggs',
    'Pantry & Grains',
    'Spices & Herbs',
    'Baking & Sweeteners',
  ];

  const grouped = categories.reduce((acc, cat) => {
    const list = items.filter((item) => item.category === cat);
    if (list.length > 0) acc[cat] = list;
    return acc;
  }, {} as Record<IngredientCategory, ShoppingItem[]>);

  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        id="shopping-list-dialog"
        className="w-full max-w-2xl bg-[#FCFAF7] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#FCFAF7] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>Grocery Shopping List</span>
                {items.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-950 font-bold">
                    {checkedCount}/{items.length} bought
                  </span>
                )}
              </h2>
              <p className="text-xs text-stone-500">
                Organized by supermarket aisle &amp; prep categories
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {items.length > 0 && (
              <>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 text-xs font-medium flex items-center gap-1.5"
                  title="Copy formatted list"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 text-xs font-medium"
                  title="Print list"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              id="close-shopping-list-btn"
              onClick={onClose}
              className="p-2 rounded-xl border border-stone-200 bg-stone-100 text-stone-700 hover:bg-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Add Custom Item Form */}
        <form onSubmit={handleAdd} className="p-4 bg-stone-100/70 border-b border-stone-200 flex flex-wrap gap-2 text-xs">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Add ingredient (e.g. Fresh rosemary)..."
            className="flex-1 min-w-[160px] px-3 py-2 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-900"
          />
          <input
            type="text"
            value={newItemAmount}
            onChange={(e) => setNewItemAmount(e.target.value)}
            placeholder="Amount"
            className="w-20 px-3 py-2 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-900"
          />
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value as IngredientCategory)}
            className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-700"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-semibold flex items-center gap-1 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        {/* Scrollable Items List */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-100/60 text-amber-800 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-800">Your shopping cart is empty</h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
                Browse any recipe and click "Add to Shopping List", or type items above to quickly build your grocery list.
              </p>
            </div>
          ) : (
            Object.keys(grouped).map((catName) => {
              const catItems = grouped[catName as IngredientCategory];
              return (
                <div key={catName} className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 pb-1 border-b border-stone-200">
                    {catName}
                  </h4>
                  <ul className="space-y-1.5">
                    {catItems.map((item) => (
                      <li
                        key={item.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                          item.checked
                            ? 'bg-stone-100/80 border-stone-200 text-stone-400'
                            : 'bg-white border-stone-200/90 text-stone-800 shadow-2xs hover:border-amber-300'
                        }`}
                      >
                        <div
                          onClick={() => onToggleItem(item.id)}
                          className="flex items-center gap-3 flex-1 cursor-pointer select-none"
                        >
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                              item.checked ? 'bg-amber-700 text-white' : 'border border-stone-300 bg-white'
                            }`}
                          >
                            {item.checked && <Check className="w-3 h-3 stroke-3" />}
                          </div>
                          <div className="text-xs sm:text-sm">
                            <span className={`font-semibold text-stone-900 ${item.checked ? 'line-through text-stone-400' : ''}`}>
                              {item.amount}
                            </span>{' '}
                            <span className={item.checked ? 'line-through' : ''}>{item.name}</span>
                            {item.recipeTitle && (
                              <span className="text-[10px] text-stone-400 ml-2 italic hidden sm:inline">
                                ({item.recipeTitle})
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="p-4 bg-stone-100/70 border-t border-stone-200 flex items-center justify-between text-xs">
            <div className="flex gap-2">
              {checkedCount > 0 && (
                <button
                  onClick={onClearChecked}
                  className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 hover:text-rose-600 hover:bg-stone-50 font-medium"
                >
                  Clear {checkedCount} Checked
                </button>
              )}
              <button
                onClick={onClearAll}
                className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 hover:text-rose-600 hover:bg-stone-50 font-medium"
              >
                Clear All
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold"
            >
              Done Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
