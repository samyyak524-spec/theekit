import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Booking Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
            Nagpur Support Center
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Contact TheEkit Support
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Have a question about an upcoming repair, need emergency technician dispatch, or want partner assistance?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details & Office */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="font-bold text-base text-slate-900 mb-1">Nagpur Head Office</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Central operations hub coordinating technician dispatches across all 18+ wards of Nagpur.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#F97316] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Registered Office Address</strong>
                  <span className="text-slate-600">
                    Flat No. 402, Kaushalya Apartment, Dighori, Nagpur, Maharashtra 440034
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Customer Helpline (Nagpur)</strong>
                  <a href="tel:8007700446" className="text-slate-600 font-semibold hover:underline">+91 8007700446</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Email Support</strong>
                  <span className="text-slate-600">support@theekit.in / grievance@theekit.in</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Operating Hours</strong>
                  <span className="text-slate-600">8:00 AM to 9:00 PM (Monday through Sunday)</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center gap-3 text-xs text-blue-900">
              <ShieldCheck className="w-5 h-5 text-[#1A3C8F] shrink-0" />
              <span>
                <strong>30-Day Service Warranty:</strong> Re-service is complimentary if any booked appliance experiences the same fault within 30 days.
              </span>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 mb-1">Send a Message</h3>
            <p className="text-xs text-slate-500 mb-6">Our Nagpur support desk replies in &lt; 30 minutes.</p>

            {submitted ? (
              <div className="p-6 text-center rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-950">Message Received!</h4>
                <p className="text-xs text-emerald-800">
                  A representative from our Nagpur support office will call you back shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 text-xs font-bold text-emerald-900 underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Anand Joshi"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98220 00000"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                  >
                    <option value="Booking Inquiry">Booking Inquiry</option>
                    <option value="Technician Feedback">Technician Feedback / Warranty Claim</option>
                    <option value="Partner Application">Technician Partner Question</option>
                    <option value="Emergency Breakdown">Emergency Appliance Breakdown</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Message</label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#1A3C8F] hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
