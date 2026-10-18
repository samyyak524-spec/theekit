import React, { useState } from 'react';
import { 
  X, 
  Check, 
  XCircle, 
  Clock, 
  HelpCircle, 
  ShieldCheck, 
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ServiceCategory, SubService } from '../../types/index.ts';

interface ServiceDetailModalProps {
  service: ServiceCategory | null;
  onClose: () => void;
  onSelectSubServiceToBook: (service: ServiceCategory, subService: SubService) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onSelectSubServiceToBook,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-3xl w-full max-h-[92vh] sm:max-h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Banner Header */}
        <div className="bg-linear-to-r from-[#1A3C8F] to-blue-700 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer touch-manipulation"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
            TheEkit Nagpur Standardized Rate Card
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {service.name}
          </h2>
          <p className="text-xs text-blue-100 max-w-xl mt-1 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1">
          {/* Sub-services Selection List */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center justify-between">
              <span>Choose Required Service / Package</span>
              <span className="text-xs text-slate-400 font-normal">All prices in INR (₹)</span>
            </h3>

            <div className="space-y-3">
              {service.subServices.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 text-sm">{sub.name}</h4>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {sub.durationMinutes} mins
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                      {sub.description}
                    </p>

                    {/* Inclusions pill preview */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      {sub.inclusions.slice(0, 2).map((inc, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                          <Check className="w-3 h-3 text-emerald-600" />
                          {inc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between shrink-0 gap-2">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">Flat Price</span>
                      <span className="text-lg font-extrabold text-[#1A3C8F]">₹{sub.price}</span>
                    </div>
                    <button
                      onClick={() => {
                        onSelectSubServiceToBook(service, sub);
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Book Slot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Standard Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                What&apos;s Always Included
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Full electrical and mechanical diagnostics</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Safety test & cleanup of service work area</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>30-Day unconditional service re-visit guarantee</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Digital GST invoice with itemized spares</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-slate-400" />
                Important Exclusions
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>Cost of replacement hardware / OEM spare parts</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>Civil masonry or major wall core cutting</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>Transportation beyond Nagpur municipal corporation boundaries</span>
                </li>
              </ul>
            </div>
          </div>

          {/* FAQs Accordion */}
          {service.faqs && service.faqs.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                Frequently Asked Questions (Nagpur)
              </h4>
              <div className="space-y-2">
                {service.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-white"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full p-3 text-left text-xs font-bold text-slate-800 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <span>{faq.question}</span>
                      {openFaqIndex === idx ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {openFaqIndex === idx && (
                      <div className="p-3 pt-0 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
