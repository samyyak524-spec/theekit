import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  AlertCircle, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { TechnicianApplication } from '../../types/index.ts';

interface ApplicationStatusViewProps {
  application: TechnicianApplication | null;
  onEnterDashboard: () => void;
  onReapply: () => void;
}

export const ApplicationStatusView: React.FC<ApplicationStatusViewProps> = ({
  application,
  onEnterDashboard,
  onReapply,
}) => {
  if (!application) {
    return (
      <div className="py-16 text-center max-w-md mx-auto px-4">
        <Clock className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800 text-base">No Application Found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          You haven&apos;t submitted a technician partner application yet.
        </p>
        <button
          onClick={onReapply}
          className="px-5 py-2.5 rounded-xl bg-[#F97316] text-white text-xs font-bold shadow-md"
        >
          Apply Now
        </button>
      </div>
    );
  }

  const isApproved = application.status === 'approved';
  const isRejected = application.status === 'rejected';

  return (
    <div className="py-12 bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A3C8F] bg-blue-50 px-2 py-0.5 rounded-md">
                Application #{application.id}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Technician Onboarding Status
              </h2>
              <p className="text-xs text-slate-500">
                Applied on {application.appliedDate} • {application.locality}, Nagpur
              </p>
            </div>

            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider self-start sm:self-auto ${
                isApproved
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : isRejected
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
              }`}
            >
              {application.status.replace('_', ' ')}
            </span>
          </div>

          {/* Stepper Status */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="space-y-1">
                <div className="h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold text-emerald-700">1. Submitted</span>
              </div>
              <div className="space-y-1">
                <div
                  className={`h-1.5 rounded-full ${
                    application.status !== 'submitted' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                  }`}
                />
                <span
                  className={`text-[11px] font-bold ${
                    application.status !== 'submitted' ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  2. Under Review & AI Audit
                </span>
              </div>
              <div className="space-y-1">
                <div
                  className={`h-1.5 rounded-full ${
                    isApproved
                      ? 'bg-emerald-500'
                      : isRejected
                      ? 'bg-red-500'
                      : 'bg-slate-200'
                  }`}
                />
                <span
                  className={`text-[11px] font-bold ${
                    isApproved
                      ? 'text-emerald-700'
                      : isRejected
                      ? 'text-red-700'
                      : 'text-slate-400'
                  }`}
                >
                  3. Certified Badge Issued
                </span>
              </div>
            </div>
          </div>

          {/* Admin Feedback Box */}
          {application.adminNotes && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1">
                TheEkit Nagpur Admin Notes:
              </span>
              <p className="text-slate-600 leading-relaxed">{application.adminNotes}</p>
            </div>
          )}

          {/* AI Audit Result Box (if evaluated) */}
          {application.aiAuditResult && (
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Gemini Quality & Vetting Score: {application.aiAuditResult.verificationScore}/100
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-200 text-indigo-900">
                  {application.aiAuditResult.certificationLevel} Tier
                </span>
              </div>
              <p className="text-indigo-900 leading-relaxed font-medium">
                {application.aiAuditResult.summary}
              </p>
            </div>
          )}

          {/* Approved View with Digital Certificate Badge */}
          {isApproved && (
            <div className="p-6 rounded-3xl bg-linear-to-tr from-slate-900 via-blue-950 to-slate-900 text-white border-2 border-amber-400/40 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
                    <Award className="w-7 h-7 text-amber-300" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase block">
                      OFFICIAL THEEKIT CREDENTIAL
                    </span>
                    <h3 className="text-lg font-bold text-white">{application.name}</h3>
                    <p className="text-[11px] text-blue-200">Nagpur Certified Service Technician</p>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                  VERIFIED ACTIVE
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs border-t border-white/10 pt-4 text-blue-200">
                <div>
                  <span className="text-[10px] text-slate-400 block">Assigned Ward:</span>
                  <strong className="text-white">{application.locality}, Nagpur</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Expertise:</span>
                  <strong className="text-white">{application.categories.join(', ')}</strong>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <button
                  onClick={onEnterDashboard}
                  className="w-full py-3 rounded-xl bg-linear-to-r from-[#F97316] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Launch Technician Job Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Rejected View */}
          {isRejected && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 space-y-3">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>Application did not meet qualification criteria</span>
              </div>
              <p>
                You may correct document discrepancies or update your trade experience and re-apply.
              </p>
              <button
                onClick={onReapply}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-Apply with Updated Details</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
