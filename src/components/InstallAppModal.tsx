import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Download,
  X,
  Smartphone,
  Monitor,
  CheckCircle2,
  Share2,
  PlusSquare,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import { StoreSettings } from '../types';

interface Props {
  settings: StoreSettings;
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<Props> = ({ settings, isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-right text-white my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500/20 to-slate-900 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.storeLogoUrl ? (
              <img
                src={settings.storeLogoUrl}
                alt={settings.storeName}
                className="w-12 h-12 object-contain rounded-xl bg-white/10 p-1 border border-amber-400/40"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg">
                {settings.storeLogoText || 'نيل'}
              </div>
            )}
            <div>
              <h3 className="font-black text-base text-white">تثبيت تطبيق {settings.storeName}</h3>
              <p className="text-xs text-amber-300">على الموبايل أو الكمبيوتر بكل سهولة وبدون اهتزاز</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>سرعة فائقة وتصفح سلس</span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>متوافق تماماً بدون أي اهتزاز</span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
              <span>تسوق آمن ومتابعة طلبك</span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-400 shrink-0" />
              <span>حجم خفيف جداً على جهازك</span>
            </div>
          </div>

          {isInstalled ? (
            <div className="bg-emerald-950/70 border border-emerald-500/80 p-4 rounded-xl text-center space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="font-black text-emerald-300 text-sm">التطبيق مثبت بالفعل على جهازك!</p>
              <p className="text-gray-300 text-[11px]">يمكنك فتحه مباشرة من الشاشة الرئيسية في أي وقت.</p>
            </div>
          ) : isIOS ? (
            /* iOS Safari Instructions */
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Smartphone className="w-4 h-4" />
                <span>طريقة التثبيت على أجهزة آيفون وآيباد (iPhone / iPad):</span>
              </div>
              <ol className="space-y-2 text-gray-200 text-[11px] list-decimal list-inside pr-1 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-400 shrink-0">1.</span>
                  <span>
                    اضغط على زر المشاركة <Share2 className="w-3.5 h-3.5 inline mx-1 text-sky-400" /> في أسفل شريط متصفح سفاري (Safari).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-400 shrink-0">2.</span>
                  <span>
                    مرر لأسفل واختر <strong>"إضافة إلى الصفحة الرئيسية"</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-400" /> (Add to Home Screen).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-400 shrink-0">3.</span>
                  <span>اضغط على كلمة <strong>"إضافة" (Add)</strong> بالأعلى ليظهر التطبيق في شاشتك الرئيسية فوراً.</span>
                </li>
              </ol>
            </div>
          ) : (
            /* Android & Desktop Flow */
            <div className="space-y-3">
              <p className="text-gray-300 leading-relaxed text-xs">
                اضغط على زر التثبيت بالأسفل لإضافة أيقونة متجر <strong>{settings.storeName}</strong> مباشرة إلى شاشة هاتفك أو سطح مكتب جهاز الكمبيوتر، لتفتحه بنقرة واحدة بدون الحاجة لكتابة الرابط.
              </p>

              <button
                onClick={handleInstallClick}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer text-sm"
              >
                <Download className="w-5 h-5" />
                <span>تثبيت التطبيق الآن على الجهاز</span>
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 pt-1">
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-amber-400" /> يدعم أندرويد وآيفون
                </span>
                <span className="flex items-center gap-1">
                  <Monitor className="w-3 h-3 text-sky-400" /> يدعم ويندوز وماك
                </span>
              </div>
            </div>
          )}

          {/* Close button */}
          <div className="pt-2">
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
