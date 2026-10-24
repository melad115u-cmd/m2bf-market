import React, { useState } from 'react';
import {
  Share2,
  X,
  Copy,
  Check,
  Send,
  MessageCircle,
  ExternalLink,
  Smartphone
} from 'lucide-react';
import { StoreSettings } from '../types';

interface Props {
  settings: StoreSettings;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareStoreModal: React.FC<Props> = ({ settings, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // The application share URL specified by the owner in settings, or fallback to window.location.href
  const shareUrl =
    (settings.appShareUrl && settings.appShareUrl.trim()) ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://nilemart.store');

  const shareTitle = `تسوق الآن من ${settings.storeName} - أقوى عروض التجارة والتقسيط في مصر`;
  const shareDescription = `اكتشف أحدث المنتجات والأجهزة مع خيارات التقسيط المريح وبوليصة شحن وتوصيل فوري لكافة المحافظات: ${shareUrl}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  // Social sharing links
  const socialNetworks = [
    {
      id: 'whatsapp',
      name: 'واتساب WhatsApp',
      color: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.07-.985-.05-.536-.183-1.229-.488-2.12-1.285-.892-.797-1.488-1.776-1.733-2.193-.245-.417-.026-.642.18-.847.185-.184.405-.473.608-.71.202-.236.269-.404.403-.674.135-.27.068-.506-.034-.71-.101-.203-.91-2.19-1.248-3.003-.329-.792-.663-.684-.91-.696l-.776-.013c-.27 0-.709.102-1.08.506-.372.405-1.42 1.389-1.42 3.387 0 1.998 1.454 3.929 1.657 4.2 1.701 2.378 3.947 3.633 6.012 4.382 1.764.639 2.457.514 3.337.382.88-.132 1.838-.752 2.097-1.48.258-.728.258-1.353.181-1.485-.077-.132-.284-.212-.596-.369z"/>
        </svg>
      ),
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle}\n${shareUrl}`)}`
    },
    {
      id: 'facebook',
      name: 'فيسبوك Facebook',
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      id: 'telegram',
      name: 'تليجرام Telegram',
      color: 'bg-sky-500 hover:bg-sky-600 text-white',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`
    },
    {
      id: 'messenger',
      name: 'ماسنجر Messenger',
      color: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.093.303 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.559-6.963 3.13 3.259 5.889-3.259-6.56 6.963z"/>
        </svg>
      ),
      url: `fb-messenger://share/?link=${encodeURIComponent(shareUrl)}`
    },
    {
      id: 'snapchat',
      name: 'سناب شات Snapchat',
      color: 'bg-amber-400 hover:bg-amber-500 text-slate-950 font-black',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.065 1.5c-4.464 0-7.393 3.226-7.393 6.903 0 1.636.561 3.255 1.455 4.316.326.388.586.745.586 1.137 0 .341-.225.564-.472.766-.632.518-1.579 1.099-2.738 1.782-.472.278-.752.686-.752 1.136 0 .809.919 1.442 2.651 1.722.37.06.697.108 1.002.158.077.294.183.67.332 1.042.27.674.832.969 1.52.798.819-.204 1.788-.737 2.652-.737.584 0 1.066.236 1.488.558.487.371 1.055.679 1.83.679.79 0 1.348-.299 1.831-.679.421-.322.903-.558 1.487-.558.864 0 1.833.533 2.652.737.688.171 1.25-.124 1.52-.798.149-.372.255-.748.332-1.042.305-.05.632-.098 1.002-.158 1.732-.28 2.651-.913 2.651-1.722 0-.45-.28-.858-.752-1.136-1.159-.683-2.106-1.264-2.738-1.782-.247-.202-.472-.425-.472-.766 0-.392.26-.749.586-1.137.894-1.061 1.455-2.68 1.455-4.316 0-3.677-2.929-6.903-7.393-6.903z"/>
        </svg>
      ),
      url: `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(shareUrl)}`
    },
    {
      id: 'instagram',
      name: 'إنستجرام Instagram',
      color: 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 text-white',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      url: `https://www.instagram.com/` // Opens Instagram, with copied link hint
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-right text-white my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500/20 to-slate-900 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">مشاركة متجر {settings.storeName}</h3>
              <p className="text-xs text-amber-300">انشر رابط المتجر على جميع منصات التواصل الاجتماعي</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Link Preview & 1-Click Copy */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-gray-400 text-[11px]">
              <span>رابط المتجر المعتمد للنشر:</span>
              <span className="text-[10px] text-amber-400 font-mono">محدد من الإعدادات</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-mono text-xs select-all outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-3.5 py-2 rounded-lg text-xs flex items-center gap-1 shrink-0 transition-colors cursor-pointer shadow-md"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-900" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>نسخ</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Social Media Share Buttons Grid as explicitly requested */}
          <div>
            <label className="block text-gray-300 font-bold mb-2.5">
              اختر منصة التواصل للنشر المباشر بنقرة واحدة:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {socialNetworks.map(net => (
                <a
                  key={net.id}
                  href={net.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (net.id === 'instagram') {
                      handleCopyLink();
                    }
                  }}
                  className={`p-3 rounded-xl font-bold flex items-center gap-2.5 transition-all shadow-md cursor-pointer ${net.color}`}
                >
                  <span className="shrink-0">{net.icon}</span>
                  <span className="truncate">{net.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Native Web Share Option */}
          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
            <button
              onClick={handleNativeShare}
              className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-gray-200 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs"
            >
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>مشاركة سريعة عبر تطبيقات هاتفك (النظام)</span>
            </button>
          )}

          {/* Close */}
          <div className="pt-1">
            <button
              onClick={onClose}
              className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-gray-300 font-bold rounded-xl transition-colors text-xs"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
