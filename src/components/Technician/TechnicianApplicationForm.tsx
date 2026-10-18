import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Wrench, 
  FileText, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { NAGPUR_LOCALITIES } from '../../utils/matching.ts';
import { ServiceCategory } from '../../types/index.ts';

interface TechnicianApplicationFormProps {
  services: ServiceCategory[];
  onSubmitSuccess: (applicationId: string) => void;
  onViewStatus: () => void;
}

export const TechnicianApplicationForm: React.FC<TechnicianApplicationFormProps> = ({
  services,
  onSubmitSuccess,
  onViewStatus,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [locality, setLocality] = useState('Dharampeth');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['ac-repair']);
  const [experienceYears, setExperienceYears] = useState(5);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleCategory = (catId: string) => {
    if (selectedCategories.includes(catId)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== catId));
      }
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError('Please agree to TheEkit background verification terms.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        locality,
        categories: selectedCategories,
        experienceYears: Number(experienceYears),
        aadhaarNumber: aadhaarNumber.trim(),
        photoUrl,
        aadhaarPhotoUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=300&q=80',
      };

      const res = await fetch('/api/technicians/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Application submission failed');
      }

      const data = await res.json();
      onSubmitSuccess(data.id);
    } catch (err) {
      console.error(err);
      setError('Failed to submit application. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-slate-900 via-[#1A3C8F] to-slate-900 text-white p-6 sm:p-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                Nagpur Partner Onboarding
              </span>
              <button
                onClick={onViewStatus}
                className="text-xs text-blue-200 hover:text-white underline font-semibold"
              >
                Already applied? Track Status
              </button>
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              Join TheEkit as a Certified Technician
            </h1>
            <p className="text-xs text-blue-100 mt-1">
              Earn ₹35,000 to ₹70,000+ monthly with guaranteed doorstep repair requests across Nagpur.
            </p>

            {/* Stepper */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs mt-6">
              {[
                { num: 1, label: 'Personal' },
                { num: 2, label: 'Skills' },
                { num: 3, label: 'Documents' },
                { num: 4, label: 'Submit' },
              ].map((s) => (
                <div key={s.num} className="space-y-1">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      step >= s.num ? 'bg-[#F97316]' : 'bg-slate-700'
                    }`}
                  />
                  <span
                    className={`text-[10px] sm:text-[11px] font-semibold block ${
                      step >= s.num ? 'text-white' : 'text-slate-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: PERSONAL INFO */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Enter your details or:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setName('Sachin K. Wankhede');
                      setPhone('8007700446');
                      setEmail('sachin.tech@theekit.in');
                      setLocality('Dighori');
                      setAadhaarNumber('8412-9901-8007');
                      setExperienceYears(6);
                      setSelectedCategories(['ac-repair', 'refrigerator', 'electrical-fitting']);
                    }}
                    className="text-[11px] font-bold text-[#F97316] bg-orange-50 hover:bg-orange-100 border border-orange-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    ⚡ Auto-Fill Demo (Dighori • 8007700446)
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Legal Name (as on Aadhaar Card)
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Nilesh Rameshwar Deshmukh"
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Mobile Number (WhatsApp Enabled)
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98220 00000"
                      className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nilesh@gmail.com"
                      className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Base Nagpur Locality (Primary Service Ward)
                  </label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                  >
                    {Object.keys(NAGPUR_LOCALITIES).map((loc) => (
                      <option key={loc} value={loc}>
                        {loc} (Zone: {NAGPUR_LOCALITIES[loc].zone} Nagpur, Pincode: {NAGPUR_LOCALITIES[loc].pincode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* STEP 2: SKILLS & CATEGORIES */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Years of Field Experience in Nagpur
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(parseInt(e.target.value, 10) || 1)}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Service Categories You Master (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {services.map((svc) => {
                      const isSelected = selectedCategories.includes(svc.id);
                      return (
                        <button
                          key={svc.id}
                          type="button"
                          onClick={() => toggleCategory(svc.id)}
                          className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[#1A3C8F] bg-blue-50/80 font-bold text-[#1A3C8F] ring-1 ring-[#1A3C8F]'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-xs">{svc.name}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#1A3C8F]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: DOCUMENT UPLOAD & PROOF */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    12-Digit Aadhaar Card Number
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={14}
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    placeholder="XXXX-XXXX-XXXX"
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F] font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Your identity is verified by TheEkit Admin & background check partners in Nagpur.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Profile Photo (Displayed to Nagpur Customers)
                  </label>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <img
                      src={photoUrl}
                      alt="Preview"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xs"
                    />
                    <div className="text-xs">
                      <div className="font-semibold text-slate-800">Clear frontal photo with formal shirt/t-shirt</div>
                      <div className="text-[11px] text-slate-400">Photo will be printed on your digital TheEkit Badge.</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Aadhaar ID Proof Copy
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <span className="text-xs font-bold text-slate-700 block">
                      Aadhaar Card Front & Back Attached
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                      ✓ Document ready for AI & Admin review
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & DECLARATION */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Applicant Name:</span>
                    <strong className="text-slate-900">{name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Contact:</span>
                    <span>{phone} • {email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Nagpur Locality:</span>
                    <strong>{locality}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Experience:</span>
                    <span>{experienceYears} Years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Categories:</span>
                    <span className="text-[#1A3C8F] font-bold">
                      {selectedCategories.join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Aadhaar:</span>
                    <span className="font-mono">{aadhaarNumber}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#1A3C8F] shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-0.5 rounded-sm border-slate-300 text-[#1A3C8F] focus:ring-[#1A3C8F]"
                      />
                      <span>
                        I declare that all technical certifications, Aadhaar details, and residential information provided for Nagpur are authentic. I agree to adhere to TheEkit quality standards, transparent pricing, and 30-day warranty commitments.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Form Nav Buttons */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-200">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((step - 1) as 1 | 2 | 3 | 4)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              ) : <div />}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1 && (!name.trim() || !phone.trim() || !email.trim())) {
                      setError('Please enter your name, phone, and email.');
                      return;
                    }
                    if (step === 3 && !aadhaarNumber.trim()) {
                      setError('Please enter your Aadhaar number for ID verification.');
                      return;
                    }
                    setError(null);
                    setStep((step + 1) as 1 | 2 | 3 | 4);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#1A3C8F] hover:bg-blue-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? 'Submitting Application...' : 'Submit Application'}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
