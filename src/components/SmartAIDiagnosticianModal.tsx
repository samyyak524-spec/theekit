import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { DiagnosticResult, ServiceCategory } from '../types/index.ts';

interface SmartAIDiagnosticianModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceCategory[];
  onBookRecommended: (categoryId: string, subServiceId?: string, notes?: string) => void;
}

const SAMPLE_PROMPTS = [
  {
    appliance: 'Air Conditioner',
    text: 'AC is running but blowing room-temperature air with an occasional buzzing sound from the outdoor unit.',
  },
  {
    appliance: 'Washing Machine',
    text: 'Front load washing machine vibrates violently and moves across the floor during high-speed spin cycle.',
  },
  {
    appliance: 'Refrigerator',
    text: 'Freezer is freezing ice normally but the lower refrigerator vegetable compartment is warm and food is spoiling.',
  },
  {
    appliance: 'Geyser Water Heater',
    text: 'The bathroom miniature circuit breaker (MCB) trips immediately whenever I switch on the 25L storage geyser.',
  },
];

export const SmartAIDiagnosticianModal: React.FC<SmartAIDiagnosticianModalProps> = ({
  isOpen,
  onClose,
  services,
  onBookRecommended,
}) => {
  const [appliance, setAppliance] = useState('Air Conditioner');
  const [brand, setBrand] = useState('');
  const [symptom, setSymptom] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  if (!isOpen) return null;

  const handleDiagnose = async (overrideAppliance?: string, overrideSymptom?: string) => {
    const targetApp = overrideAppliance || appliance;
    const targetSym = overrideSymptom || symptom;

    if (!targetSym.trim()) {
      setError('Please describe what issue or symptom your appliance is experiencing.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/gemini/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appliance: targetApp,
          symptom: targetSym,
          brand: brand.trim() || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get diagnosis');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Diagnosis service could not be reached. Please check details or select a service directly.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_PROMPTS[0]) => {
    setAppliance(sample.appliance);
    setSymptom(sample.text);
    handleDiagnose(sample.appliance, sample.text);
  };

  const resetDiagnosis = () => {
    setResult(null);
    setSymptom('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-linear-to-r from-[#1A3C8F] to-indigo-700 text-white p-4 sm:p-5 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base sm:text-lg text-white">TheEkit AI Smart Diagnostician</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider">
                  Gemini 3.8 Intelligence
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                Instant root-cause analysis, fair cost estimates & service matching for Nagpur homes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors touch-manipulation cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {!result ? (
            <div className="space-y-5">
              {/* Appliance select & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Appliance
                  </label>
                  <select
                    value={appliance}
                    onChange={(e) => setAppliance(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                  >
                    <option value="Air Conditioner">Air Conditioner (Split / Window)</option>
                    <option value="Washing Machine">Washing Machine (Front / Top Load)</option>
                    <option value="Refrigerator">Refrigerator (Single / Double Door)</option>
                    <option value="Geyser Water Heater">Geyser / Water Heater</option>
                    <option value="Electrical Fitting">Electrical Wiring / MCB / Switchboard</option>
                    <option value="Plumbing Fixture">Plumbing / Tap / Water Pump</option>
                    <option value="Microwave Oven">Microwave Oven</option>
                    <option value="RO Water Purifier">RO Water Purifier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Brand (Optional)
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Daikin, LG, Samsung, Voltas, Havells"
                    className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                  />
                </div>
              </div>

              {/* Symptom Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Describe what&apos;s happening (symptoms, strange sounds, error codes)
                </label>
                <textarea
                  rows={3}
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  placeholder="e.g. Not cooling, display shows error E4, water leaking underneath, making loud buzzing noise..."
                  className="w-full text-sm rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                />
              </div>

              {/* Sample Problem Quick Buttons */}
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-2">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Or tap a common Nagpur household issue:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SAMPLE_PROMPTS.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSample(sample)}
                      className="text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/70 hover:border-blue-200 text-xs text-slate-700 transition-all flex flex-col gap-1"
                    >
                      <span className="font-semibold text-[#1A3C8F]">{sample.appliance}</span>
                      <span className="line-clamp-2 text-slate-500 text-[11px]">{sample.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  onClick={() => handleDiagnose()}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-[#1A3C8F] to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Gemini AI is analyzing symptoms & Nagpur climatic factors...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Diagnose Issue & Calculate Estimated Quote</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Results View */
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Top Diagnosis Card */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1A3C8F] uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    AI Diagnosis Result
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      result.urgency === 'immediate' || result.urgency === 'high'
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : result.urgency === 'medium'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    Urgency: {result.urgency}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-800 leading-relaxed">
                  {result.diagnosis}
                </p>
                <div className="pt-1 flex items-center gap-4 text-xs font-semibold text-slate-700">
                  <span>
                    Estimated Repair & Parts Range: <strong className="text-[#1A3C8F]">{result.estimatedCostRange}</strong>
                  </span>
                </div>
              </div>

              {/* Likely Root Causes */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  Probable Root Causes
                </h4>
                <div className="space-y-1.5">
                  {result.likelyRootCauses?.map((cause, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-[#1A3C8F] font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{cause}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preventive Tips */}
              {result.preventiveTips && result.preventiveTips.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-emerald-500" />
                    Technician Care Tips (Nagpur Household Advice)
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-600 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                    {result.preventiveTips.map((tip, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={resetDiagnosis}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Diagnose Another</span>
                </button>

                <button
                  onClick={() => {
                    onBookRecommended(
                      result.recommendedCategoryId,
                      result.recommendedSubServiceId,
                      `Diagnosed with AI: ${result.symptom}`
                    );
                    onClose();
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book Nearest Nagpur Technician</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
