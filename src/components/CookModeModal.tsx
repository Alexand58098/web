import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Bell,
  Sparkles,
  Layers,
  Star,
  PartyPopper,
  Volume2,
  ChefHat,
  Timer as TimerIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Recipe, CookLog } from '../types';
import { playKitchenChime } from '../utils/sound';

interface CookModeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  onCompleteCook: (log: CookLog) => void;
  useMetric: boolean;
}

export const CookModeModal: React.FC<CookModeModalProps> = ({
  recipe,
  onClose,
  onCompleteCook,
  useMetric,
}) => {
  if (!recipe) return null;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [showIngredientsDrawer, setShowIngredientsDrawer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Rating & Review in Completion
  const [rating, setRating] = useState<number>(5);
  const [tastingNotes, setTastingNotes] = useState<string>('');

  const currentStep = recipe.instructions[currentStepIndex];
  const totalSteps = recipe.instructions.length;

  // Active Timer state
  const [timerDuration, setTimerDuration] = useState<number>(currentStep?.timerSeconds || 0);
  const [timerRemaining, setTimerRemaining] = useState<number>(currentStep?.timerSeconds || 0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // When step changes, set initial timer
  useEffect(() => {
    const step = recipe.instructions[currentStepIndex];
    if (step?.timerSeconds) {
      setTimerDuration(step.timerSeconds);
      setTimerRemaining(step.timerSeconds);
      setTimerRunning(false);
    } else {
      setTimerDuration(0);
      setTimerRemaining(0);
      setTimerRunning(false);
    }
  }, [currentStepIndex, recipe]);

  // Timer countdown loop
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setTimerRunning(false);
            playKitchenChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  const toggleTimer = () => {
    if (timerRemaining === 0) {
      setTimerRemaining(timerDuration || 180);
    }
    setTimerRunning(!timerRunning);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerRemaining(timerDuration || 180);
  };

  const addExtraMinutes = (mins: number) => {
    setTimerRemaining((prev) => prev + mins * 60);
    setTimerDuration((prev) => prev + mins * 60);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleStepComplete = (idx: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleNextStep = () => {
    setCompletedSteps((prev) => ({ ...prev, [currentStepIndex]: true }));
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Finished all steps!
      triggerCelebration();
    }
  };

  const triggerCelebration = () => {
    setIsFinished(true);
    playKitchenChime();
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#b45309', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
      });
    } catch {
      // safe fallback
    }
  };

  const handleSaveCookLog = () => {
    onCompleteCook({
      recipeId: recipe.id,
      date: new Date().toISOString(),
      rating,
      notes: tastingNotes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1917] text-stone-100 flex flex-col justify-between overflow-hidden select-none">
      {/* Top Bar: Progress and Exit */}
      <header className="px-4 sm:px-8 py-4 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-600/30 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
              Kitchen Cook Mode
            </span>
            <h2 className="text-sm sm:text-base font-semibold text-stone-200 line-clamp-1">
              {recipe.title}
            </h2>
          </div>
        </div>

        {/* Step Indicator and Quick Ingredients Drawer Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setShowIngredientsDrawer(!showIngredientsDrawer)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              showIngredientsDrawer
                ? 'bg-amber-600 text-white border-amber-500'
                : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Ingredients ({recipe.ingredients.length})</span>
          </button>

          <button
            id="close-cook-mode-btn"
            onClick={onClose}
            className="p-2 rounded-lg bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-colors"
            title="Exit Cook Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Visual Step Progress Bar */}
      <div className="w-full bg-stone-800 h-1.5">
        <div
          className="bg-linear-to-r from-amber-600 to-amber-400 h-1.5 transition-all duration-300"
          style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Main Content Viewport */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center relative overflow-y-auto">
        {!isFinished ? (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            {/* Step header */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-400 bg-amber-950/70 px-3 py-1 rounded-md border border-amber-800/60">
                Step {currentStepIndex + 1} of {totalSteps}
              </span>

              <button
                onClick={() => handleToggleStepComplete(currentStepIndex)}
                className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border ${
                  completedSteps[currentStepIndex]
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                    : 'bg-stone-800/80 text-stone-400 border-stone-700 hover:text-stone-200'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>{completedSteps[currentStepIndex] ? 'Done' : 'Mark done'}</span>
              </button>
            </div>

            {/* Step Title & Instruction */}
            <div className="space-y-4">
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight leading-snug">
                {currentStep.title}
              </h1>

              <div className="bg-stone-900/80 rounded-2xl p-6 sm:p-8 border border-stone-800 shadow-xl">
                <p className="text-stone-200 text-lg sm:text-2xl sm:leading-relaxed font-normal">
                  {currentStep.instruction}
                </p>
              </div>
            </div>

            {/* Chef's Pro Tip */}
            {currentStep.tip && (
              <div className="p-4 sm:p-5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm leading-relaxed">
                  <strong className="text-amber-400 font-semibold block mb-0.5">Chef's Secret:</strong>
                  {currentStep.tip}
                </div>
              </div>
            )}

            {/* Kitchen Timer Module (if step has timer or manual start) */}
            <div className="bg-stone-900 rounded-2xl p-5 sm:p-6 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${timerRunning ? 'bg-amber-600/30 text-amber-400 animate-pulse' : 'bg-stone-800 text-stone-400'}`}>
                  <TimerIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    Step Kitchen Timer {currentStep.timerLabel ? `(${currentStep.timerLabel})` : ''}
                  </span>
                  <div className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-white flex items-center gap-2">
                    <span>{formatTimer(timerRemaining)}</span>
                    {timerRemaining === 0 && (
                      <span className="text-xs font-sans text-emerald-400 uppercase tracking-widest bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        Done!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
                <button
                  id="toggle-kitchen-timer-btn"
                  onClick={toggleTimer}
                  className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    timerRunning
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-amber-600 hover:bg-amber-500 text-stone-950'
                  }`}
                >
                  {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{timerRunning ? 'Pause' : 'Start Timer'}</span>
                </button>

                <button
                  onClick={resetTimer}
                  className="p-2.5 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700 transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => addExtraMinutes(1)}
                  className="px-3 py-2 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700 text-xs font-semibold"
                  title="Add 1 minute"
                >
                  +1m
                </button>

                <button
                  onClick={() => addExtraMinutes(5)}
                  className="px-3 py-2 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700 text-xs font-semibold"
                  title="Add 5 minutes"
                >
                  +5m
                </button>

                <button
                  onClick={playKitchenChime}
                  className="p-2.5 rounded-xl bg-stone-800 text-stone-400 hover:text-amber-400 hover:bg-stone-700 transition-colors"
                  title="Test Bell Chime"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Dish Completed Celebration Screen */
          <div className="max-w-xl mx-auto w-full text-center space-y-6 py-8 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-2xl">
              <PartyPopper className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Culinary Triumph
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Bon Appétit! Dish Completed!
              </h1>
              <p className="text-stone-400 text-sm">
                You successfully mastered {recipe.title}. How did it turn out?
              </p>
            </div>

            {/* Star Rating Input */}
            <div className="bg-stone-900 rounded-2xl p-6 border border-stone-800 space-y-4">
              <span className="text-xs font-semibold text-stone-300 block">Rate Your Creation:</span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-600'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Tasting notes */}
              <div className="text-left space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-stone-400">
                  Chef's Tasting Notes (Optional):
                </label>
                <textarea
                  value={tastingNotes}
                  onChange={(e) => setTastingNotes(e.target.value)}
                  placeholder="e.g. Perfectly seared! Needed a little extra lemon zest..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                id="save-cook-log-btn"
                onClick={handleSaveCookLog}
                className="px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm shadow-lg transition-colors"
              >
                Save to My Cooked Journal
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-sm transition-colors"
              >
                Back to Recipes
              </button>
            </div>
          </div>
        )}

        {/* Sliding Ingredients Drawer */}
        {showIngredientsDrawer && (
          <div className="absolute right-4 top-4 bottom-4 w-80 max-w-[90vw] bg-stone-900/95 backdrop-blur-xl border border-stone-700/80 rounded-2xl shadow-2xl p-5 overflow-y-auto z-20 flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
                <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-500" />
                  <span>Recipe Ingredients</span>
                </h3>
                <button
                  onClick={() => setShowIngredientsDrawer(false)}
                  className="p-1 rounded-md text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <ul className="space-y-3 text-xs">
                {recipe.ingredients.map((ing) => (
                  <li key={ing.id} className="flex items-baseline justify-between gap-2 border-b border-stone-800/50 pb-2">
                    <span className="text-stone-200">{ing.name}</span>
                    <span className="font-mono text-amber-400 shrink-0 font-semibold">
                      {useMetric && ing.metricAmount
                        ? `${ing.metricAmount} ${ing.metricUnit}`
                        : `${ing.baseAmount} ${ing.unit}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setShowIngredientsDrawer(false)}
              className="mt-4 w-full py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold"
            >
              Close Drawer
            </button>
          </div>
        )}
      </div>

      {/* Bottom Step Navigation Bar */}
      {!isFinished && (
        <footer className="px-4 sm:px-8 py-4 bg-stone-900 border-t border-stone-800 flex items-center justify-between">
          <button
            id="prev-step-btn"
            onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              currentStepIndex === 0
                ? 'opacity-40 cursor-not-allowed bg-stone-800 text-stone-500'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <span className="text-xs text-stone-400 font-medium hidden sm:inline">
            Step {currentStepIndex + 1} of {totalSteps}
          </span>

          <button
            id="next-step-btn"
            onClick={handleNextStep}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-sm font-bold shadow-md transition-all hover:shadow-lg"
          >
            <span>{currentStepIndex === totalSteps - 1 ? 'Finish Dish!' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </footer>
      )}
    </div>
  );
};
