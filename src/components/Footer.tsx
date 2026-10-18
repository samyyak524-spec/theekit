import React from 'react';
import { Wrench, Phone, MapPin, Mail, ShieldCheck, Clock, Award, Heart } from 'lucide-react';

interface FooterProps {
  onTabChange: (tab: string) => void;
  onOpenAIDiagnostics: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange, onOpenAIDiagnostics }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-[#1A3C8F] to-blue-600 flex items-center justify-center text-white shadow-md">
                <Wrench className="w-5 h-5 text-amber-400" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">TheEkit</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nagpur&apos;s premier on-demand home appliance repair, fitting, and maintenance platform.
              Every technician is certified, background-checked, and equipped with genuine spare parts.
            </p>
              <div className="flex flex-col gap-2 pt-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-[#F97316] shrink-0" />
                  <span>Flat No. 402, Kaushalya Apartment, Dighori, Nagpur, MH 440034</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4 text-[#22C55E] shrink-0" />
                  <a href="tel:8007700446" className="hover:underline font-semibold">+91 8007700446</a>
                </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@theekit.in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Nagpur Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onTabChange('home')} className="hover:text-amber-400 transition-colors">
                  AC Repair & Jet Foam Servicing
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('home')} className="hover:text-amber-400 transition-colors">
                  Washing Machine Drum & Motor Repair
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('home')} className="hover:text-amber-400 transition-colors">
                  Refrigerator Gas Refill & Cooling
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('home')} className="hover:text-amber-400 transition-colors">
                  Electrical Fittings, Fans & MCBs
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('home')} className="hover:text-amber-400 transition-colors">
                  Plumbing, Taps & Flush Tanks
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('home')} className="hover:text-amber-400 transition-colors">
                  Geyser & Instant Water Heater Repair
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Explore & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenAIDiagnostics} className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-blue-300 font-semibold">
                  <span>✨ TheEkit AI Issue Diagnostician</span>
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('how-it-works')} className="hover:text-amber-400 transition-colors">
                  How TheEkit Works
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('tech-apply')} className="hover:text-amber-400 transition-colors text-[#F97316] font-medium">
                  Join Nagpur Technician Network
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('customer-bookings')} className="hover:text-amber-400 transition-colors">
                  Track Existing Booking
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('contact')} className="hover:text-amber-400 transition-colors">
                  Customer Grievance & Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Guarantee Highlights */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              TheEkit Promise
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white">30-Day Service Warranty</div>
                  <div className="text-slate-400 text-[11px]">Free revisit if the same issue recurs within 30 days.</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white">45-Min Emergency Dispatch</div>
                  <div className="text-slate-400 text-[11px]">Nearest verified technician in your Nagpur ward.</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <Award className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white">Government ID Certified</div>
                  <div className="text-slate-400 text-[11px]">Police & Aadhaar background verified pros.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} TheEkit Technologies Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>for Nagpur, Maharashtra</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
