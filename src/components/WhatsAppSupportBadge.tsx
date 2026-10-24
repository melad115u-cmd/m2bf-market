import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, QrCode, X, PhoneCall, ExternalLink, ShieldCheck } from 'lucide-react';

export const WhatsAppSupportBadge: React.FC = () => {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  // If whatsappNumber is empty or deleted by admin in settings, completely hide!
  const rawNumber = settings.whatsappNumber ? settings.whatsappNumber.trim() : '';
  if (!rawNumber) return null;

  // Format Egyptian WhatsApp phone number
  const cleanPhone = rawNumber.replace(/\D/g, '');
  const waPhone = cleanPhone.startsWith('0') 
    ? `20${cleanPhone.slice(1)}` 
    : cleanPhone.startsWith('20') 
      ? cleanPhone 
      : `20${cleanPhone}`;

  const waLink = `https://wa.me/${waPhone}?text=${encodeURIComponent(`مرحباً خدمة عملاء ${settings.storeName}، أود الاستفسار عن المنتجات والطلبيات`)}`;
  // High quality dynamic QR code URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(waLink)}&color=064e3b&bgcolor=ffffff`;

  return (
    <>
      {/* Floating Quick WhatsApp Action Button */}
      <aside aria-label="خدمة العملاء واتساب" className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white p-3 md:px-4 md:py-3 rounded-2xl shadow-2xl hover:shadow-emerald-600/40 transition-all transform hover:scale-105 cursor-pointer border-2 border-emerald-400/40"
          title="خدمة العملاء والباركود عبر واتساب"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
          </div>
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-black">خدمة العملاء واتساب</span>
            <span className="text-[10px] text-emerald-100 font-mono">امسح الباركود للتواصل</span>
          </div>
          <QrCode className="w-4 h-4 text-emerald-200 hidden md:block" />
        </button>
      </aside>

      {/* WhatsApp Modal with QR Barcode */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-gray-200 text-right flex flex-col animate-in zoom-in-95">
            {/* Header */}
            <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-black">واتساب خدمة العملاء المعتمد</h4>
                  <p className="text-[11px] text-emerald-100 font-mono">{rawNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Code Body */}
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-emerald-50 rounded-2xl border-2 border-dashed border-emerald-400 flex flex-col items-center shadow-inner">
                <img
                  src={qrCodeUrl}
                  alt="WhatsApp Customer Service QR Code"
                  className="w-44 h-44 rounded-xl object-contain shadow-sm bg-white p-1"
                />
                <span className="text-[11px] font-bold text-emerald-800 mt-2 flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5" />
                  امسح الباركود بكاميرا الهاتف للمحادثة الفورية
                </span>
              </div>

              <div className="space-y-1 text-xs text-gray-600">
                <p className="font-bold text-gray-900">
                  متواجدون على مدار 24 ساعة للرد على استفساراتكم
                </p>
                <p className="text-[11px] text-gray-500">
                  تأكيد الحجوزات • متابعة شحنات التقسيط • الدعم الفني
                </p>
              </div>

              {/* Direct Link Action */}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>فتح المحادثة مباشرة في واتساب</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>حساب موثق رسمي لدى {settings.storeName}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
