import React from 'react';
import { 
  Wind, 
  Disc, 
  Snowflake, 
  Zap, 
  Wrench, 
  Flame, 
  Microwave, 
  Droplets,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Star,
  Users
} from 'lucide-react';
import { ServiceCategory } from '../../types/index.ts';

interface ServicesSectionProps {
  services: ServiceCategory[];
  onSelectService: (service: ServiceCategory) => void;
  onBookDirect: (service: ServiceCategory) => void;
}

// Icon helper map
const renderCategoryIcon = (iconName: string) => {
  const props = { className: 'w-6 h-6' };
  switch (iconName) {
    case 'Wind': return <Wind {...props} className="w-6 h-6 text-blue-600" />;
    case 'Disc': return <Disc {...props} className="w-6 h-6 text-indigo-600" />;
    case 'Snowflake': return <Snowflake {...props} className="w-6 h-6 text-cyan-600" />;
    case 'Zap': return <Zap {...props} className="w-6 h-6 text-amber-500" />;
    case 'Wrench': return <Wrench {...props} className="w-6 h-6 text-slate-700" />;
    case 'Flame': return <Flame {...props} className="w-6 h-6 text-orange-500" />;
    case 'Microwave': return <Microwave {...props} className="w-6 h-6 text-purple-600" />;
    case 'Droplets': return <Droplets {...props} className="w-6 h-6 text-teal-600" />;
    default: return <Wrench {...props} className="w-6 h-6 text-blue-600" />;
  }
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectService,
  onBookDirect,
}) => {
  return (
    <div className="py-12 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#F97316] mb-1">
              Nagpur Doorstep Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
              Home Appliance Repair & Fitting Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select your appliance to view transparent upfront pricing, inclusions, and book nearest Nagpur technicians.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Standardized Nagpur Rate Card</span>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400/60 p-5 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Header Icon + Starting Price */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {renderCategoryIcon(service.iconName)}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Starts at</span>
                    <span className="text-lg font-extrabold text-[#1A3C8F]">₹{service.startingPrice}</span>
                  </div>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1A3C8F] transition-colors mb-1">
                  {service.name}
                </h3>
                <p className="text-[11px] font-medium text-[#F97316] mb-2">
                  {service.tagline}
                </p>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Subservice pills preview */}
                <div className="space-y-1.5 mb-5">
                  {service.subServices.slice(0, 2).map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between text-[11px] py-1 px-2 rounded-md bg-slate-50 text-slate-700">
                      <span className="truncate pr-2 font-medium">{sub.name}</span>
                      <span className="font-bold text-slate-900 shrink-0">₹{sub.price}</span>
                    </div>
                  ))}
                  {service.subServices.length > 2 && (
                    <div className="text-[10px] text-blue-600 font-semibold text-right pt-0.5">
                      +{service.subServices.length - 2} more services available
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onSelectService(service)}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => onBookDirect(service)}
                  className="py-2 px-3.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                >
                  <span>Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Why Nagpur Chooses TheEkit Section */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A3C8F]">
              The TheEkit Advantage
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              Why Nagpur Trusts TheEkit for Appliance Care
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Unlike unverified roadside mechanics, every TheEkit technician undergoes rigorous skills certification and background checks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Digital Certification Badge
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every technician holds an official digital TheEkit credential with unique ID, verified Aadhaar, and background clearance.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-semibold text-blue-700 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Zero Hidden Fees</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#F97316] text-white flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Hyper-Local Nagpur Matching
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our system matches you with technicians located in your specific locality (Dharampeth, Ramdaspeth, Sadar, Besa, etc.) for fastest arrival.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-semibold text-[#F97316] flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Average 45-min arrival time</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3">
                  <Star className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  30-Day Guarantee & Genuine Spares
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  If the same fault recurs within 30 days, we revisit and repair at zero charge. Only OEM manufacturer capacitors, sensors, and parts used.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>90-Day Parts Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
