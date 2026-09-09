import React, { useState } from 'react';
import {
  Wrench,
  Thermometer,
  Scale,
  Sparkles,
  Flame,
  HelpCircle,
  Scissors,
  Check,
  RotateCcw,
} from 'lucide-react';

export const KitchenToolsGuide: React.FC = () => {
  // Measurement converter state
  const [ingredientType, setIngredientType] = useState<'flour' | 'sugar' | 'butter' | 'liquid' | 'oats'>('flour');
  const [cupsValue, setCupsValue] = useState<number>(1);
  const [tempF, setTempF] = useState<number>(350);

  // Ingredient densities in grams per US cup
  const densities: Record<string, { label: string; gramsPerCup: number; notes: string }> = {
    flour: { label: 'All-Purpose Flour (sifted)', gramsPerCup: 120, notes: 'Spoon into cup and level with a knife.' },
    sugar: { label: 'Granulated White Sugar', gramsPerCup: 200, notes: 'Standard granulated crystals.' },
    butter: { label: 'Butter', gramsPerCup: 227, notes: '1 cup = 2 US sticks = 16 tablespoons.' },
    liquid: { label: 'Water / Milk / Liquids', gramsPerCup: 240, notes: '1 cup = 240 ml = 8 fluid ounces.' },
    oats: { label: 'Rolled Oats', gramsPerCup: 90, notes: 'Old-fashioned whole rolled oats.' },
  };

  const calculatedGrams = Math.round(cupsValue * densities[ingredientType].gramsPerCup * 10) / 10;
  const calculatedOunces = Math.round((calculatedGrams / 28.3495) * 10) / 10;
  const calculatedTbsp = Math.round(cupsValue * 16 * 10) / 10;

  // Temperature calculations
  const calculatedC = Math.round(((tempF - 32) * 5) / 9);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-blue-950 via-stone-900 to-stone-900 p-6 sm:p-10 border border-blue-900/30 text-white shadow-lg">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
            <Wrench className="w-3.5 h-3.5" />
            <span>Chef's Companion &amp; Kitchen Guide</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
            Culinary Reference &amp; Conversion Tools
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Essential kitchen conversions, internal meat temperature targets, and the legendary flavor balancing SOS matrix used in professional kitchens.
          </p>
        </div>
      </div>

      {/* Grid: Tools & Conversions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Baking & Weight Converter */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Ingredient Weight &amp; Volume Converter
              </h2>
              <p className="text-xs text-stone-500">
                1 cup of flour does not weigh the same as 1 cup of sugar!
              </p>
            </div>
          </div>

          {/* Ingredient selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-600 block">
              Select Ingredient:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(densities) as Array<keyof typeof densities>).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setIngredientType(key as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                    ingredientType === key
                      ? 'bg-blue-50 border-blue-400 text-blue-900'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {densities[key].label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Cup input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-stone-700">
              <span>Amount in Cups:</span>
              <span className="font-mono text-blue-800 font-bold text-sm">{cupsValue} Cup(s)</span>
            </div>
            <input
              type="range"
              min="0.25"
              max="5"
              step="0.25"
              value={cupsValue}
              onChange={(e) => setCupsValue(parseFloat(e.target.value))}
              className="w-full accent-blue-700 cursor-pointer"
            />
            <div className="flex gap-2 text-xs">
              {[0.25, 0.5, 1, 2, 3].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setCupsValue(val)}
                  className={`px-2 py-1 rounded-md text-[11px] border font-medium ${
                    cupsValue === val
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                  }`}
                >
                  {val === 0.25 ? '¼' : val === 0.5 ? '½' : val} cup
                </button>
              ))}
            </div>
          </div>

          {/* Result Cards */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 text-center">
              <span className="text-[10px] uppercase font-bold text-blue-900 tracking-wider block">Grams</span>
              <span className="text-xl font-mono font-bold text-blue-950">{calculatedGrams}g</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-100/80 border border-stone-200 text-center">
              <span className="text-[10px] uppercase font-bold text-stone-600 tracking-wider block">Ounces</span>
              <span className="text-xl font-mono font-bold text-stone-900">{calculatedOunces}oz</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-100/80 border border-stone-200 text-center">
              <span className="text-[10px] uppercase font-bold text-stone-600 tracking-wider block">Tablespoons</span>
              <span className="text-xl font-mono font-bold text-stone-900">{calculatedTbsp} tbsp</span>
            </div>
          </div>

          <p className="text-xs text-stone-400 italic">
            * {densities[ingredientType].notes}
          </p>
        </div>

        {/* Temperature Converter */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-700">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Oven Temperature Converter
              </h2>
              <p className="text-xs text-stone-500">
                Instantly convert Fahrenheit to Celsius &amp; Gas Marks
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold text-stone-700">
              <span>Slider (°F):</span>
              <span className="font-mono text-orange-800 font-bold text-sm">{tempF}°F</span>
            </div>
            <input
              type="range"
              min="200"
              max="500"
              step="5"
              value={tempF}
              onChange={(e) => setTempF(parseInt(e.target.value))}
              className="w-full accent-orange-600 cursor-pointer"
            />
          </div>

          {/* Quick Oven Temperature Presets */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-stone-500 block">Common Baking Temperatures:</span>
            <div className="flex flex-wrap gap-2">
              {[300, 325, 350, 375, 400, 425, 450].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTempF(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                    tempF === t
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {t}°F
                </button>
              ))}
            </div>
          </div>

          {/* Conversion Displays */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-center">
              <span className="text-xs uppercase font-bold text-orange-900 tracking-wider block">Fahrenheit</span>
              <span className="text-3xl font-mono font-bold text-orange-950 mt-1 block">{tempF}°F</span>
            </div>
            <div className="p-4 rounded-xl bg-stone-900 text-white text-center">
              <span className="text-xs uppercase font-bold text-stone-400 tracking-wider block">Celsius (Fan)</span>
              <span className="text-3xl font-mono font-bold text-emerald-400 mt-1 block">{calculatedC}°C</span>
            </div>
          </div>
        </div>
      </div>

      {/* Internal Meat & Poultry Doneness Temperature Guide */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Chef's Internal Meat Temperature Chart
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Use a digital instant-read thermometer inserted into the thickest part. Remove from heat 3-5°F early to allow carryover resting.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Beef & Steak */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 space-y-3">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
              Beef &amp; Lamb
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between border-b border-stone-200/60 pb-1">
                <span className="text-stone-600">Rare (warm red)</span>
                <strong className="text-stone-900 font-mono">120-125°F (50°C)</strong>
              </li>
              <li className="flex justify-between border-b border-stone-200/60 pb-1">
                <span className="text-stone-600">Medium-Rare (pink)</span>
                <strong className="text-amber-800 font-mono font-bold">130-135°F (57°C)</strong>
              </li>
              <li className="flex justify-between border-b border-stone-200/60 pb-1">
                <span className="text-stone-600">Medium</span>
                <strong className="text-stone-900 font-mono">140-145°F (62°C)</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-stone-600">Well Done</span>
                <strong className="text-stone-900 font-mono">160°F+ (71°C)</strong>
              </li>
            </ul>
          </div>

          {/* Poultry & Chicken */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 space-y-3">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
              Poultry &amp; Chicken
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between border-b border-stone-200/60 pb-1">
                <span className="text-stone-600">Chicken Breast</span>
                <strong className="text-stone-900 font-mono font-bold">165°F (74°C)</strong>
              </li>
              <li className="flex justify-between border-b border-stone-200/60 pb-1">
                <span className="text-stone-600">Thighs &amp; Wings</span>
                <strong className="text-stone-900 font-mono">175°F (79°C)</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-stone-600">Ground Turkey</span>
                <strong className="text-stone-900 font-mono">165°F (74°C)</strong>
              </li>
            </ul>
          </div>

          {/* Pork */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 space-y-3">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600 inline-block" />
              Pork &amp; Ham
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between border-b border-stone-200/60 pb-1">
                <span className="text-stone-600">Chops &amp; Loin (Juicy)</span>
                <strong className="text-amber-800 font-mono font-bold">145°F (63°C)</strong>
              </li>
              <li className="flex justify-between border-b border-stone-200/60 pb-1">
                <span className="text-stone-600">Ground Pork</span>
                <strong className="text-stone-900 font-mono">160°F (71°C)</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-stone-600">Braised Shoulder</span>
                <strong className="text-stone-900 font-mono">200°F (93°C)</strong>
              </li>
            </ul>
          </div>

          {/* Seafood & Fish */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 space-y-3">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              Fish &amp; Salmon
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between border-b border-stone-200/60 pb-1">
                <span className="text-stone-600">Salmon (Silky Med)</span>
                <strong className="text-blue-800 font-mono font-bold">125°F (52°C)</strong>
              </li>
              <li className="flex justify-between border-b border-stone-200/60 pb-1">
                <span className="text-stone-600">White Flaky Fish</span>
                <strong className="text-stone-900 font-mono">140°F (60°C)</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-stone-600">Shrimp &amp; Scallops</span>
                <strong className="text-stone-900 font-mono">120°F (opaque)</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Flavor Balancing Wheel / Kitchen SOS */}
      <div className="bg-[#FAF7F2] rounded-2xl border border-amber-200/80 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-amber-200/70">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Kitchen SOS: The Culinary Flavor Balancing Matrix
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              When a dish tastes "off", professional chefs adjust these 5 fundamental taste levers before serving:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1.5 shadow-2xs">
            <strong className="text-rose-800 font-bold text-sm block">Too Salty?</strong>
            <p className="text-stone-600 leading-relaxed">
              Add an <strong>acid</strong> (lemon juice, vinegar) or a <strong>fat</strong> (cream, butter, unsalted broth), or dilute with unsalted starchy potatoes or rice.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1.5 shadow-2xs">
            <strong className="text-amber-800 font-bold text-sm block">Too Sour / Acidic?</strong>
            <p className="text-stone-600 leading-relaxed">
              Counter with <strong>sweetness</strong> (pinch of sugar, honey, maple syrup) or a rich <strong>fat</strong> like butter or crème fraîche.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1.5 shadow-2xs">
            <strong className="text-blue-800 font-bold text-sm block">Too Sweet?</strong>
            <p className="text-stone-600 leading-relaxed">
              Add a splash of <strong>acid</strong> (fresh lime juice, white wine vinegar) or a pinch of flaky sea salt, or bitter herbs (tarragon, parsley).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1.5 shadow-2xs">
            <strong className="text-emerald-800 font-bold text-sm block">Too Bland or Dull?</strong>
            <p className="text-stone-600 leading-relaxed">
              Check <strong>salt</strong> first! If salt is fine, the dish almost always lacks <strong>acid</strong> (lemon zest or wine) or <strong>umami</strong> (Parmesan, soy sauce, tomato paste).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1.5 shadow-2xs">
            <strong className="text-orange-800 font-bold text-sm block">Too Spicy / Hot?</strong>
            <p className="text-stone-600 leading-relaxed">
              Capsaicin binds to fat. Counter with <strong>dairy</strong> (yogurt, sour cream, milk) or sweet honey, or serve over plain jasmine rice.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1.5 shadow-2xs">
            <strong className="text-purple-800 font-bold text-sm block">Too Rich / Heavy?</strong>
            <p className="text-stone-600 leading-relaxed">
              Cut through heavy rendered fats with bright <strong>citrus zest</strong>, chopped fresh tender herbs, or a dash of aged sherry vinegar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
