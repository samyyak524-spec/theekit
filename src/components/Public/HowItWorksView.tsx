import React from 'react';
import { 
  Search, 
  Calendar, 
  Wrench, 
  CheckCircle2, 
  FileCheck, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

interface HowItWorksViewProps {
  onBookNow: () => void;
  onJoinAsTech: () => void;
  onOpenAIDiagnostics: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({
  onBookNow,
  onJoinAsTech,
  onOpenAIDiagnostics,
}) => {
  return (
    <div className="py-12 bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
            Transparent & Simple
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">
            How TheEkit Works in Nagpur
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            From smart AI diagnosis to doorstep repair by certified technicians, experience hassle-free home appliance servicing.
          </p>
        </div>

        {/* 3 Step Flow for Customers */}
        <div>
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-[#1A3C8F]">
              For Homeowners & Customers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1A3C8F] flex items-center justify-center font-extrabold text-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">
                  Select Service or Ask AI
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Browse categorized appliance services with upfront pricing, or use our Gemini AI diagnostician to identify symptoms.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Cost Estimates</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F97316] flex items-center justify-center font-extrabold text-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">
                  Book Date & Nagpur Locality
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Choose your preferred morning or evening time slot and address in Dharampeth, Ramdaspeth, Sitabuldi, or any of 18+ wards.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-[#F97316] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Choose Convenient Slot</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold text-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">
                  Certified Pro Arrives
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A verified technician equipped with OEM tools inspects, fixes, and tests your appliance with a 30-day service warranty.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>30-Day Guarantee</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-6">
            <button
              onClick={onBookNow}
              className="px-6 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Services & Book Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Step Flow for Technicians */}
        <div className="pt-8 border-t border-slate-200">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              For Technicians & Service Professionals
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Join Nagpur&apos;s fastest growing verified partner network
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm mb-3">
                A
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Apply Online</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit your skills, Aadhaar ID, and trade experience in our 4-step digital onboarding form.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm mb-3">
                B
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Verification & Badge</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Admins verify your credentials and issue an official digital TheEkit Certification Badge.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm mb-3">
                C
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Receive Nagpur Jobs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accept real-time job dispatches in your locality, complete repairs, and withdraw weekly payouts.
              </p>
            </div>
          </div>

          <div className="text-center pt-6">
            <button
              onClick={onJoinAsTech}
              className="px-6 py-3 rounded-xl bg-[#1A3C8F] hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Apply to Join as Nagpur Technician</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
