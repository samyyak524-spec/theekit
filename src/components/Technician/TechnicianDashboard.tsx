import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Power, 
  Star, 
  IndianRupee, 
  Briefcase, 
  Clock, 
  MapPin, 
  Phone, 
  Navigation, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  XCircle,
  HelpCircle,
  Camera
} from 'lucide-react';
import { Technician, Booking } from '../../types/index.ts';

interface TechnicianDashboardProps {
  technician: Technician;
  bookings: Booking[];
  onRefreshBookings: () => void;
  onViewEarnings: () => void;
  onViewPublicProfile: () => void;
}

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({
  technician,
  bookings,
  onRefreshBookings,
  onViewEarnings,
  onViewPublicProfile,
}) => {
  const [isAvailable, setIsAvailable] = useState(technician.isAvailable);
  const [incomingJob, setIncomingJob] = useState<{
    id: string;
    serviceName: string;
    locality: string;
    pincode: string;
    time: string;
    amount: number;
    timer: number;
  } | null>(null);
  const [acceptedJobBanner, setAcceptedJobBanner] = useState<string | null>(null);

  // AI Field Assistant states
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [aiAppliance, setAiAppliance] = useState('Air Conditioner');
  const [aiIssue, setAiIssue] = useState('');
  const [aiModel, setAiModel] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGuidance, setAiGuidance] = useState<{
    stepByStepChecklist: string[];
    safetyPrecautions: string[];
    multimeterExpectedValues: string;
  } | null>(null);

  // Toggle availability
  const handleToggleAvailability = async () => {
    const nextVal = !isAvailable;
    setIsAvailable(nextVal);
    try {
      await fetch(`/api/technicians/${technician.id}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: nextVal }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Job Status Action (Start Job, Mark Completed)
  const handleUpdateJobStatus = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        onRefreshBookings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Simulate an incoming job request dispatch when available
  useEffect(() => {
    if (!isAvailable) {
      setIncomingJob(null);
      return;
    }

    // Trigger an incoming dispatch simulation after 3 seconds if no active incoming
    const timer = setTimeout(() => {
      setIncomingJob({
        id: `JOB-${Math.floor(1000 + Math.random() * 9000)}`,
        serviceName: 'AC Deep Foam Jet Cleaning & Gas Check',
        locality: 'Dharampeth',
        pincode: '440010',
        time: 'Tomorrow, 10:30 AM',
        amount: 499,
        timer: 45,
      });
    }, 4000);

    return () => clearTimeout(timer);
  }, [isAvailable]);

  // Countdown for incoming job
  useEffect(() => {
    if (!incomingJob) return;
    if (incomingJob.timer <= 0) {
      setIncomingJob(null);
      return;
    }
    const interval = setInterval(() => {
      setIncomingJob((prev) => (prev ? { ...prev, timer: prev.timer - 1 } : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [incomingJob]);

  // Query AI Technician Assistant
  const handleQueryAiAssistant = async () => {
    if (!aiIssue.trim()) return;
    setAiLoading(true);
    setAiGuidance(null);

    try {
      const res = await fetch('/api/gemini/tech-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appliance: aiAppliance,
          issue: aiIssue,
          modelOrError: aiModel.trim() || undefined,
        }),
      });
      const data = await res.json();
      setAiGuidance(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  // Filter assigned jobs for this technician
  const assignedJobs = bookings.filter(
    (b) => b.technicianId === technician.id || b.technicianName?.includes(technician.name.split(' ')[0])
  );
  const activeJobs = assignedJobs.filter((b) => b.status !== 'completed' && b.status !== 'cancelled');
  const completedJobs = assignedJobs.filter((b) => b.status === 'completed');

  return (
    <div className="py-8 bg-[#F8FAFC] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Control Bar with Digital Certificate Badge & Availability Toggle */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={technician.photoUrl}
                alt={technician.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#1A3C8F] shadow-sm"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  isAvailable ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900">{technician.name}</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#1A3C8F]">
                  Certified Pro
                </span>
              </div>
              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                <span>Badge: <strong className="font-mono text-slate-700">{technician.certificationNumber}</strong></span>
                <span>•</span>
                <span>Serving {technician.localities.slice(0, 3).join(', ')}, Nagpur</span>
              </div>
            </div>
          </div>

          {/* Right Actions: Availability Toggle & View Profile */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleToggleAvailability}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                isAvailable
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
              }`}
            >
              <Power className={`w-4 h-4 ${isAvailable ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>Status: {isAvailable ? 'ONLINE (Accepting Nagpur Jobs)' : 'OFFLINE (Paused)'}</span>
            </button>

            <button
              onClick={onViewPublicProfile}
              className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Public Profile & Badge
            </button>
          </div>
        </div>

        {/* INCOMING JOB DISPATCH MODAL (WITH 45S COUNTDOWN TIMER) */}
        {incomingJob && (
          <div className="p-5 rounded-3xl bg-linear-to-r from-orange-600 to-amber-600 text-white shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30">
                  <Clock className="w-6 h-6 text-white animate-spin" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-950/40 text-amber-300">
                      NEW REAL-TIME JOB REQUEST
                    </span>
                    <span className="text-xs font-mono font-bold text-white bg-black/30 px-2 py-0.5 rounded-sm">
                      {incomingJob.timer}s remaining
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {incomingJob.serviceName}
                  </h3>
                  <p className="text-xs text-orange-100">
                    Location: <strong>{incomingJob.locality}, Nagpur ({incomingJob.pincode})</strong> • Scheduled: {incomingJob.time}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIncomingJob(null)}
                  className="px-4 py-2.5 rounded-xl bg-black/20 hover:bg-black/30 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Decline
                </button>
                <button
                  onClick={() => {
                    const jobTitle = incomingJob.serviceName;
                    setAcceptedJobBanner(`Job ${incomingJob.id} accepted (${jobTitle})! Added to your Active Jobs queue.`);
                    setIncomingJob(null);
                    onRefreshBookings();
                    setTimeout(() => setAcceptedJobBanner(null), 6000);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-white text-orange-700 hover:bg-orange-50 font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  Accept Job (₹{incomingJob.amount})
                </button>
              </div>
            </div>
          </div>
        )}

        {acceptedJobBanner && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{acceptedJobBanner}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Active Jobs</span>
              <Briefcase className="w-4 h-4 text-[#1A3C8F]" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{activeJobs.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Assigned in Nagpur</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Earnings</span>
              <IndianRupee className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">₹{technician.totalEarnings.toLocaleString('en-IN')}</div>
            <button
              onClick={onViewEarnings}
              className="text-[11px] text-[#F97316] font-semibold hover:underline mt-0.5 block"
            >
              View ledger & payout →
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Customer Rating</span>
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 flex items-center gap-1">
              <span>{technician.rating}</span>
              <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">{technician.reviewsCount} verified reviews</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Completed Jobs</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{technician.completedJobsCount}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">100% On-Time Record</div>
          </div>
        </div>

        {/* AI Field Assistant Quick Bar */}
        <div className="bg-linear-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 text-white shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>TheEkit AI On-Site Repair Assistant</span>
                  <span className="text-[9px] font-extrabold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-sm uppercase">
                    GEMINI FLASH
                  </span>
                </h3>
                <p className="text-xs text-blue-200">
                  Stuck on a model or error code? Get multimeter resistance checks and component test steps.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAiAssistant(!showAiAssistant)}
              className="px-4 py-2 rounded-xl bg-white text-blue-900 font-bold text-xs hover:bg-blue-50 transition-colors shrink-0"
            >
              {showAiAssistant ? 'Hide Assistant' : 'Open Diagnostic Checklist'}
            </button>
          </div>

          {showAiAssistant && (
            <div className="mt-5 pt-5 border-t border-white/10 space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-blue-200 mb-1">Appliance</label>
                  <select
                    value={aiAppliance}
                    onChange={(e) => setAiAppliance(e.target.value)}
                    className="w-full text-xs rounded-xl bg-white/10 border border-white/20 p-2.5 text-white focus:outline-hidden"
                  >
                    <option value="Air Conditioner" className="text-slate-900">Air Conditioner</option>
                    <option value="Washing Machine" className="text-slate-900">Washing Machine</option>
                    <option value="Refrigerator" className="text-slate-900">Refrigerator</option>
                    <option value="Geyser Water Heater" className="text-slate-900">Geyser Water Heater</option>
                    <option value="Microwave Oven" className="text-slate-900">Microwave Oven</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-blue-200 mb-1">Model / Error Code</label>
                  <input
                    type="text"
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    placeholder="e.g. Daikin E4 or LG Front Load dE"
                    className="w-full text-xs rounded-xl bg-white/10 border border-white/20 p-2.5 text-white placeholder-blue-300 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-blue-200 mb-1">Observed Fault</label>
                  <input
                    type="text"
                    value={aiIssue}
                    onChange={(e) => setAiIssue(e.target.value)}
                    placeholder="e.g. Compressor trips after 3 mins"
                    className="w-full text-xs rounded-xl bg-white/10 border border-white/20 p-2.5 text-white placeholder-blue-300 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                onClick={handleQueryAiAssistant}
                disabled={aiLoading}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {aiLoading ? 'Querying Gemini...' : 'Get Step-by-Step Diagnostic Checkpoints'}
              </button>

              {aiGuidance && (
                <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-xs space-y-3">
                  <div>
                    <span className="font-bold text-amber-300 uppercase tracking-wider text-[10px] block mb-1">
                      Sequential Troubleshooting Checklist:
                    </span>
                    <ol className="list-decimal pl-4 space-y-1 text-slate-200 text-[11px]">
                      {aiGuidance.stepByStepChecklist.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <span className="font-bold text-amber-300 uppercase tracking-wider text-[10px] block mb-1">
                      Multimeter Resistance / Voltage Specs:
                    </span>
                    <p className="text-blue-100 text-[11px] bg-white/5 p-2 rounded-lg font-mono">
                      {aiGuidance.multimeterExpectedValues}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Assigned Jobs Workflow Section */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center justify-between">
            <span>Your Assigned Nagpur Jobs ({activeJobs.length} Active)</span>
            <span className="text-xs text-slate-400 font-normal">Updated live</span>
          </h2>

          {activeJobs.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">All caught up!</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Keep your status set to ONLINE to receive incoming bookings in Nagpur.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1A3C8F] font-mono">{job.id}</span>
                        <span className="text-[10px] font-semibold text-slate-400">•</span>
                        <span className="text-xs text-slate-500 font-medium">
                          Scheduled: {job.date} ({job.timeSlot})
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{job.subServiceName}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full uppercase bg-blue-100 text-[#1A3C8F]">
                        {job.status.replace('_', ' ')}
                      </span>
                      <span className="text-sm font-extrabold text-emerald-600">
                        Payout: ₹{job.technicianPayout}
                      </span>
                    </div>
                  </div>

                  {/* Customer details & Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Customer Contact</span>
                      <div className="font-bold text-slate-900 mt-0.5">{job.customerName}</div>
                      <div className="flex items-center gap-1.5 text-blue-600 mt-1">
                        <Phone className="w-3.5 h-3.5" />
                        <a href={`tel:${job.customerPhone}`} className="hover:underline font-semibold">
                          {job.customerPhone}
                        </a>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Nagpur Service Location</span>
                      <div className="font-semibold text-slate-800 mt-0.5 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#F97316] shrink-0 mt-0.5" />
                        <span>
                          {job.address.houseNo}, {job.address.street}, {job.address.locality} ({job.address.pincode})
                        </span>
                      </div>
                      {job.notes && (
                        <div className="text-[11px] text-slate-500 italic mt-1">
                          Customer note: &quot;{job.notes}&quot;
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Appliance Model & Photo (for Technician Verification) */}
                  {(job.applianceModelNo || job.appliancePhotoUrl) && (
                    <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                          <Camera className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider block">
                            Appliance Specs (Check Genuine Spares Stock)
                          </span>
                          <div className="text-xs font-bold text-slate-900 mt-0.5">
                            {job.applianceBrand ? `${job.applianceBrand} ` : ''}
                            {job.applianceModelNo ? `(Model No: ${job.applianceModelNo})` : ''}
                          </div>
                        </div>
                      </div>

                      {job.appliancePhotoUrl && (
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-amber-200 shadow-2xs">
                          <img
                            src={job.appliancePhotoUrl}
                            alt="Customer Appliance"
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <span className="text-[10px] font-bold text-emerald-700 block">Customer Photo Attached</span>
                            <a
                              href={job.appliancePhotoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-blue-600 hover:underline font-semibold block"
                            >
                              View full resolution
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Technician Execution Buttons */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(`${job.address.houseNo}, ${job.address.street}, ${job.address.locality}, Nagpur`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5 text-blue-600" />
                      <span>Directions (Google Maps)</span>
                    </a>

                    <div className="flex items-center gap-2">
                      {job.status === 'assigned' && (
                        <button
                          onClick={() => handleUpdateJobStatus(job.id, 'en_route')}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        >
                          Mark En Route (Leaving Now)
                        </button>
                      )}

                      {job.status === 'en_route' && (
                        <button
                          onClick={() => handleUpdateJobStatus(job.id, 'in_progress')}
                          className="px-4 py-2 rounded-xl bg-[#1A3C8F] hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        >
                          Arrived & Start Job
                        </button>
                      )}

                      {job.status === 'in_progress' && (
                        <button
                          onClick={() => handleUpdateJobStatus(job.id, 'completed')}
                          className="px-5 py-2.5 rounded-xl bg-[#22C55E] hover:bg-emerald-600 text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Complete Job & Collect ₹{job.totalAmount}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
