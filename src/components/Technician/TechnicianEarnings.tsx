import React, { useState } from 'react';
import { 
  IndianRupee, 
  ArrowLeft, 
  Download, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Send 
} from 'lucide-react';
import { Technician, Booking } from '../../types/index.ts';

interface TechnicianEarningsProps {
  technician: Technician;
  bookings: Booking[];
  onBack: () => void;
}

export const TechnicianEarnings: React.FC<TechnicianEarningsProps> = ({
  technician,
  bookings,
  onBack,
}) => {
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [bankAccount, setBankAccount] = useState('State Bank of India - Dharampeth (A/C: 38910293847)');
  const [ifsc, setIfsc] = useState('SBIN0001234');
  const [upiId, setUpiId] = useState(`${technician.name.toLowerCase().split(' ')[0]}@sbi`);
  const [payoutRequested, setPayoutRequested] = useState(false);

  // Filter completed jobs for earnings breakdown
  const completedJobs = bookings.filter(
    (b) => (b.technicianId === technician.id || b.technicianName?.includes(technician.name.split(' ')[0])) &&
           b.status === 'completed'
  );

  const pendingPayoutBalance = 8450; // Demo pending payout ready to withdraw

  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutRequested(true);
    setTimeout(() => {
      setPayoutModalOpen(false);
      setPayoutRequested(false);
      setPayoutSuccessMsg(`Payout request of ₹${pendingPayoutBalance} successfully submitted! Funds will settle to your bank account within 2 hours.`);
      setTimeout(() => setPayoutSuccessMsg(null), 6000);
    }, 1000);
  };

  return (
    <div className="py-8 bg-[#F8FAFC] min-h-[85vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <span className="text-xs text-slate-400 font-medium">Nagpur Partner Financials</span>
        </div>

        {payoutSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{payoutSuccessMsg}</span>
          </div>
        )}

        {/* Top Summary Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
              Earnings Summary
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              ₹{technician.totalEarnings.toLocaleString('en-IN')}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              85% direct technician share + tips across {technician.completedJobsCount} completed jobs in Nagpur.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Available Balance</span>
              <span className="text-xl font-extrabold text-emerald-700">₹{pendingPayoutBalance.toLocaleString('en-IN')}</span>
            </div>
            <button
              onClick={() => setPayoutModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Withdraw to Bank
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Completed Service Job Ledger</h3>
            <span className="text-xs text-slate-400">{completedJobs.length} records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Job ID</th>
                  <th className="px-5 py-3">Service & Sub-service</th>
                  <th className="px-5 py-3">Customer Locality</th>
                  <th className="px-5 py-3">Customer Total</th>
                  <th className="px-5 py-3">Your Payout (85%)</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {completedJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5 font-mono font-bold text-[#1A3C8F]">{job.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900">{job.subServiceName}</div>
                      <div className="text-[10px] text-slate-400">{job.date}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{job.address.locality}, Nagpur</td>
                    <td className="px-5 py-3.5 text-slate-600">₹{job.totalAmount}</td>
                    <td className="px-5 py-3.5 font-bold text-emerald-600 text-sm">₹{job.technicianPayout}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Settled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payout Modal */}
        {payoutModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900">Request Bank Payout</h3>
                <button
                  onClick={() => setPayoutModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleRequestPayout} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
                    Payout Amount (INR)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`₹${pendingPayoutBalance}`}
                    className="w-full font-bold text-base text-emerald-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
                    Bank Account Details
                  </label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 uppercase font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={payoutRequested}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {payoutRequested ? 'Processing Immediate NEFT/IMPS Transfer...' : 'Confirm Withdrawal Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
