import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  UserCheck, 
  Briefcase, 
  Shield 
} from 'lucide-react';
import { UserRole, Technician, TechnicianApplication } from '../../types/index.ts';

interface MobileLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole, phone: string, userData?: any) => void;
  technicians: Technician[];
  applications: TechnicianApplication[];
}

export const MobileLoginModal: React.FC<MobileLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  technicians,
  applications,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const cleanPhone = phone.replace(/\D/g, '').slice(-10);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setOtpCode('4400'); // Auto-filled demo OTP for Nagpur pincode
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setError('Please enter the OTP sent to your phone.');
      return;
    }

    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);

      if (selectedRole === 'technician') {
        // Check if technician exists or is approved
        const matchedTech = technicians.find((t) => t.phone.replace(/\D/g, '').includes(cleanPhone));
        const matchedApp = applications.find((a) => a.phone.replace(/\D/g, '').includes(cleanPhone));

        if (matchedTech) {
          onLoginSuccess('technician', cleanPhone, matchedTech);
          onClose();
        } else if (matchedApp) {
          if (matchedApp.status === 'approved') {
            onLoginSuccess('technician', cleanPhone, matchedApp);
            onClose();
          } else {
            setError(`Your application #${matchedApp.id} is currently ${matchedApp.status.toUpperCase()}. It is awaiting admin approval.`);
          }
        } else {
          // New technician phone
          onLoginSuccess('technician', cleanPhone);
          onClose();
        }
      } else if (selectedRole === 'admin') {
        onLoginSuccess('admin', cleanPhone);
        onClose();
      } else {
        // Customer
        onLoginSuccess('customer', cleanPhone);
        onClose();
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-linear-to-r from-[#1A3C8F] to-indigo-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close login modal"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 block mb-1">
            One-Click Mobile OTP
          </span>
          <h2 className="text-xl font-extrabold text-white">
            Log in to TheEkit
          </h2>
          <p className="text-xs text-blue-100 mt-0.5">
            Instant passwordless login for Nagpur Customers, Technicians, and Admins.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
              {error.includes('awaiting admin approval') && (
                <button
                  type="button"
                  onClick={() => {
                    onLoginSuccess('admin', cleanPhone);
                    onClose();
                  }}
                  className="w-full py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>Log in as Admin to Approve Application Now</span>
                </button>
              )}
            </div>
          )}

          {!otpSent ? (
            /* STEP 1: SELECT ROLE & ENTER PHONE */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Your Account Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('customer')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedRole === 'customer'
                        ? 'border-[#1A3C8F] bg-blue-50/80 ring-2 ring-blue-500/20 text-[#1A3C8F] font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                    <span className="text-xs block">Customer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('technician')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedRole === 'technician'
                        ? 'border-[#F97316] bg-orange-50/80 ring-2 ring-orange-500/20 text-[#F97316] font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 mx-auto mb-1 text-[#F97316]" />
                    <span className="text-xs block">Technician</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedRole === 'admin'
                        ? 'border-purple-600 bg-purple-50/80 ring-2 ring-purple-500/20 text-purple-700 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Shield className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                    <span className="text-xs block">Admin</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  10-Digit Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-xs font-bold text-slate-400">+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter mobile (e.g. 8007700446)"
                    className="w-full pl-12 pr-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                  />
                </div>
              </div>

              {/* Quick Sample Numbers */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <span>Quick Fill:</span>
                <button
                  type="button"
                  onClick={() => { setPhone('8007700446'); setSelectedRole('customer'); }}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  8007700446 (Helpline/Cust)
                </button>
                <button
                  type="button"
                  onClick={() => { setPhone('9822345671'); setSelectedRole('technician'); }}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  9822345671 (Certified Tech)
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#1A3C8F] hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? 'Sending OTP to Mobile...' : 'Send OTP Verification Code'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* STEP 2: VERIFY OTP */
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">OTP sent to:</span>
                  <strong className="text-slate-900">+91 {cleanPhone}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-500 mt-1">
                  <span>Role:</span>
                  <span className="font-bold text-[#1A3C8F] uppercase">{selectedRole}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Enter 4-Digit OTP Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-mono font-bold py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                />
                <p className="text-[11px] text-emerald-600 font-semibold mt-1 text-center">
                  ✓ Demo OTP &apos;4400&apos; pre-filled for instant verification
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Change Number
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {loading ? 'Verifying...' : 'Verify OTP & Log In'}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
