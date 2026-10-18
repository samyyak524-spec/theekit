import React from 'react';
import { 
  Award, 
  Star, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  Phone, 
  Clock,
  Briefcase
} from 'lucide-react';
import { Technician, Review } from '../../types/index.ts';

interface PublicTechnicianProfileProps {
  technician: Technician;
  reviews: Review[];
  onBack: () => void;
  onBookThisTechnician: () => void;
}

export const PublicTechnicianProfile: React.FC<PublicTechnicianProfileProps> = ({
  technician,
  reviews,
  onBack,
  onBookThisTechnician,
}) => {
  const techReviews = reviews.filter((r) => r.technicianId === technician.id && r.status === 'visible');

  return (
    <div className="py-8 bg-[#F8FAFC] min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back Link */}
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        {/* Official Certificate Card */}
        <div className="bg-linear-to-tr from-slate-900 via-[#1A3C8F] to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-blue-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <img
                src={technician.photoUrl}
                alt={technician.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-lg shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-300/30">
                    NAGPUR CERTIFIED PARTNER
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
                <h1 className="text-2xl font-extrabold text-white">{technician.name}</h1>
                <p className="text-xs text-blue-200 mt-0.5 max-w-md">{technician.bio}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0">
              <div className="flex items-center justify-center gap-1 text-amber-300 font-extrabold text-xl">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>{technician.rating}</span>
              </div>
              <div className="text-[11px] text-blue-200 mt-0.5">
                {technician.reviewsCount} Customer Reviews
              </div>
              <div className="text-[10px] text-slate-300 mt-1 font-mono">
                {technician.certificationNumber}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs text-blue-200">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Experience</span>
              <strong className="text-white text-sm">{technician.experienceYears} Years</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Jobs Completed</span>
              <strong className="text-white text-sm">{technician.completedJobsCount}+ in Nagpur</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Certified Date</span>
              <strong className="text-white text-sm">{technician.certifiedDate}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Guarantee</span>
              <strong className="text-emerald-300 text-sm">30-Day Free Revisit</strong>
            </div>
          </div>
        </div>

        {/* Coverage & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F97316]" />
              <span>Nagpur Service Localities Covered</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {technician.localities.map((loc) => (
                <span
                  key={loc}
                  className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  📍 {loc}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#1A3C8F]" />
              <span>Certified Appliance Specialties</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {technician.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#1A3C8F] uppercase tracking-wide"
                >
                  {cat.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">Verified Customer Reviews</h3>
              <p className="text-xs text-slate-500">Real feedback from Nagpur households</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{technician.rating} / 5.0</span>
            </div>
          </div>

          {techReviews.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No public reviews submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {techReviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{rev.customerName}</span>
                    <div className="flex items-center text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-blue-600 font-semibold block">{rev.serviceName}</span>
                  <p className="text-slate-600 leading-relaxed">&quot;{rev.comment}&quot;</p>
                  <span className="text-[10px] text-slate-400 block pt-1">{rev.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
