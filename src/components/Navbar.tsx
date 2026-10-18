import React, { useState } from 'react';
import { 
  Wrench, 
  MapPin, 
  Sparkles, 
  UserCheck, 
  ShieldCheck, 
  Briefcase, 
  Menu, 
  X, 
  ChevronDown,
  Bell,
  CalendarCheck,
  Phone,
  Search,
  LogIn,
  LogOut,
  User
} from 'lucide-react';
import { UserRole } from '../types/index.ts';
import { NAGPUR_LOCALITIES } from '../utils/matching.ts';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  selectedLocality: string;
  onLocalityChange: (locality: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenAIDiagnostics: () => void;
  activeBookingsCount: number;
  onOpenTrackByMobile: () => void;
  onOpenMobileLogin: () => void;
  loggedInPhone: string | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  selectedLocality,
  onLocalityChange,
  activeTab,
  onTabChange,
  onOpenAIDiagnostics,
  activeBookingsCount,
  onOpenTrackByMobile,
  onOpenMobileLogin,
  loggedInPhone,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localityDropdownOpen, setLocalityDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner with Nagpur city branding, Helpline, and quick role switcher */}
      <div className="bg-[#1A3C8F] text-white text-xs px-3 sm:px-4 py-1.5 flex items-center justify-between gap-2 overflow-hidden">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-amber-400 text-slate-900 tracking-wide uppercase shrink-0">
            Nagpur
          </span>
          <span className="hidden lg:inline text-blue-100 text-[11px]">
            Flat No. 402, Kaushalya Apt, Dighori • Helpline:
          </span>
          <a
            href="tel:8007700446"
            className="flex items-center gap-1 font-bold text-amber-300 hover:text-white transition-colors text-[11px] sm:text-xs truncate"
          >
            <Phone className="w-3 h-3 text-amber-300 shrink-0" />
            <span>+91 8007700446</span>
          </a>
        </div>

        {/* Role Switcher & Login Status */}
        <div className="flex items-center gap-2 shrink-0">
          {loggedInPhone && (
            <div className="hidden sm:flex items-center gap-1.5 bg-blue-900/80 px-2 py-0.5 rounded-lg border border-blue-400/30 text-[11px]">
              <span className="text-emerald-400 font-bold">●</span>
              <span className="font-mono text-blue-100">+91 {loggedInPhone}</span>
              <button
                onClick={onLogout}
                title="Log out"
                className="ml-1 text-slate-300 hover:text-white cursor-pointer"
              >
                <LogOut className="w-3 h-3 inline" />
              </button>
            </div>
          )}

          {/* Desktop Role Switcher Buttons */}
          <div className="hidden md:flex items-center gap-1 bg-blue-950/60 p-0.5 rounded-lg border border-blue-400/30">
            <span className="text-[10px] text-blue-200 px-1 font-medium">Mode:</span>
            <button
              onClick={() => onRoleChange('customer')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                currentRole === 'customer'
                  ? 'bg-white text-[#1A3C8F] shadow-xs'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              Customer
            </button>
            <button
              onClick={() => onRoleChange('technician')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                currentRole === 'technician'
                  ? 'bg-[#F97316] text-white shadow-xs'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              <Briefcase className="w-3 h-3" />
              Technician
            </button>
            <button
              onClick={() => onRoleChange('admin')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                currentRole === 'admin'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              Admin
            </button>
          </div>

          {/* Mobile Role Switcher Dropdown */}
          <div className="md:hidden flex items-center gap-1 bg-blue-950/70 px-2 py-0.5 rounded-lg border border-blue-400/30 text-[10px]">
            <span className="text-blue-200">Mode:</span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-transparent text-amber-300 font-bold focus:outline-hidden cursor-pointer"
              aria-label="Switch User Mode"
            >
              <option value="customer" className="text-slate-900 bg-white">Customer</option>
              <option value="technician" className="text-slate-900 bg-white">Technician</option>
              <option value="admin" className="text-slate-900 bg-white">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Locality */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button
            onClick={() => onTabChange('home')}
            className="flex items-center gap-2 group text-left cursor-pointer shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-linear-to-tr from-[#1A3C8F] to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#1A3C8F]">TheEkit</span>
                <span className="text-[9px] sm:text-[10px] font-bold px-1 py-0.2 bg-orange-100 text-[#F97316] rounded-sm">NGP</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:block">
                Nagpur Home Appliance Care
              </p>
            </div>
          </button>

          {/* Nagpur Locality Picker Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setLocalityDropdownOpen(!localityDropdownOpen)}
              className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-[11px] sm:text-xs font-semibold transition-colors border border-slate-200 cursor-pointer"
              aria-label="Select Nagpur Locality"
            >
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F97316] shrink-0" />
              <span className="max-w-[75px] sm:max-w-[110px] truncate">{selectedLocality}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {localityDropdownOpen && (
              <div className="absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Nagpur Localities (18+ Wards)
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {Object.keys(NAGPUR_LOCALITIES).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        onLocalityChange(loc);
                        setLocalityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-blue-50 transition-colors cursor-pointer ${
                        selectedLocality === loc
                          ? 'bg-blue-50/80 text-[#1A3C8F] font-bold'
                          : 'text-slate-700'
                      }`}
                    >
                      <span>{loc}</span>
                      <span className="text-[10px] text-slate-400">
                        {NAGPUR_LOCALITIES[loc].pincode}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Navigation Links (Public / Customer) */}
        {currentRole === 'customer' && (
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => onTabChange('home')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'home'
                  ? 'text-[#1A3C8F] font-semibold bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => onTabChange('how-it-works')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'how-it-works'
                  ? 'text-[#1A3C8F] font-semibold bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => onTabChange('customer-bookings')}
              className={`px-3 py-1.5 rounded-md transition-colors relative flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'customer-bookings'
                  ? 'text-[#1A3C8F] font-semibold bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-blue-600" />
              <span>My Bookings</span>
              {activeBookingsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#F97316] text-white text-[11px] font-bold flex items-center justify-center">
                  {activeBookingsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onTabChange('tech-apply')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'tech-apply'
                  ? 'text-[#1A3C8F] font-semibold bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Join as Technician
            </button>
            <button
              onClick={() => onTabChange('contact')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'contact'
                  ? 'text-[#1A3C8F] font-semibold bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nagpur Help & Support
            </button>
          </nav>
        )}

        {/* Technician Navigation View */}
        {currentRole === 'technician' && (
          <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
            <button
              onClick={() => onTabChange('technician-dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'technician-dashboard'
                  ? 'bg-orange-50 text-[#F97316] font-semibold border border-orange-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Technician Portal
            </button>
            <button
              onClick={() => onTabChange('technician-earnings')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'technician-earnings'
                  ? 'bg-orange-50 text-[#F97316] font-semibold border border-orange-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Earnings
            </button>
            <button
              onClick={() => onTabChange('technician-public-profile')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'technician-public-profile'
                  ? 'bg-orange-50 text-[#F97316] font-semibold border border-orange-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Public Profile & Badge
            </button>
          </nav>
        )}

        {/* Admin Navigation View */}
        {currentRole === 'admin' && (
          <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
            <button
              onClick={() => onTabChange('admin-dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'admin-dashboard'
                  ? 'bg-purple-50 text-purple-700 font-semibold border border-purple-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin Dashboard
            </button>
            <button
              onClick={() => onTabChange('admin-technicians')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'admin-technicians'
                  ? 'bg-purple-50 text-purple-700 font-semibold border border-purple-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Verify Technicians & Applications
            </button>
            <button
              onClick={() => onTabChange('admin-bookings')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'admin-bookings'
                  ? 'bg-purple-50 text-purple-700 font-semibold border border-purple-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Bookings
            </button>
          </nav>
        )}

        {/* Right Actions: Track by Mobile No. + AI Diagnostic */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* TRACK BY MOBILE NUMBER BUTTON (Hidden on mobile phone, available in bottom nav) */}
          <button
            onClick={onOpenTrackByMobile}
            className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-colors cursor-pointer shadow-2xs"
            title="Track booking or technician status by phone number"
          >
            <Search className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Track by Mobile</span>
          </button>

          {/* AI DIAGNOSTICS (Hidden on mobile phone, available in bottom nav) */}
          <button
            onClick={onOpenAIDiagnostics}
            className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
            title="Diagnose appliance symptom with Gemini AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>AI Diagnostics</span>
          </button>

          {/* Mobile Menu Button - Always visible & clean on mobile screens */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 touch-manipulation cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          <div className="text-xs font-semibold text-slate-400 px-2 py-1">NAVIGATION</div>
          {currentRole === 'customer' && (
            <>
              <button
                onClick={() => { onTabChange('home'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
              >
                Services
              </button>
              <button
                onClick={() => { onTabChange('customer-bookings'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-50 font-medium flex items-center justify-between"
              >
                <span>My Bookings</span>
                {activeBookingsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#F97316] text-white text-xs">
                    {activeBookingsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => { onOpenTrackByMobile(); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-blue-700 rounded-lg hover:bg-blue-50 font-bold flex items-center gap-1.5"
              >
                <Search className="w-4 h-4 text-[#F97316]" />
                <span>Track Booking by Mobile No.</span>
              </button>
              <button
                onClick={() => { onTabChange('how-it-works'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
              >
                How It Works
              </button>
              <button
                onClick={() => { onTabChange('tech-apply'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
              >
                Join as Technician
              </button>
              <button
                onClick={() => { onTabChange('contact'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
              >
                Help & Contact (8007700446)
              </button>
            </>
          )}

          {currentRole === 'technician' && (
            <>
              <button
                onClick={() => { onTabChange('technician-dashboard'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
              >
                Technician Dashboard
              </button>
              <button
                onClick={() => { onTabChange('technician-earnings'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
              >
                Earnings & Payouts
              </button>
              <button
                onClick={() => { onTabChange('technician-public-profile'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
              >
                Public Profile
              </button>
            </>
          )}

          {currentRole === 'admin' && (
            <>
              <button
                onClick={() => { onTabChange('admin-dashboard'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
              >
                Admin Overview
              </button>
              <button
                onClick={() => { onTabChange('admin-technicians'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
              >
                Technician Applications & Certification
              </button>
              <button
                onClick={() => { onTabChange('admin-bookings'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
              >
                Bookings Management
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
