import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Megaphone,
  Download,
  Image as ImageIcon
} from 'lucide-react';

export const SocialShareModal: React.FC = () => {
  const { socialShareProduct, setSocialShareProduct, addToast } = useStore();
  const [platform, setPlatform] = useState<'whatsapp' | 'facebook' | 'instagram' | 'telegram'>('whatsapp');
  const [affiliateCode, setAffiliateCode] = useState('EGY-SALE-2026');
  const [copied, setCopied] = useState(false);

  if (!socialShareProduct) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://nilemart.eg';
  const trackingUrl = `${currentUrl}/?product=${socialShareProduct.id}&ref=${affiliateCode}&src=${platform}`;

  const monthsAvailable = socialShareProduct.maxInstallmentMonths || 12;
  const minMonthly = socialShareProduct.isInstallmentAvailable && monthsAvailable > 0
    ? Math.round((socialShareProduct.price * 1.12) / monthsAvailable)
    : 0;

  // Pre-crafted Arabic Marketing copy
  const getMarketingCopy = () => {
    const installmentSnippet = socialShareProduct.isInstallmentAvailable
      ? `\n💳 متاح التقسيط الميسر حتى ${monthsAvailable} شهر بقسط يبدأ من ${minMonthly.toLocaleString()} ج.م فقط (بدون إجراءات معقدة وبضمان قانوني معتمد)!`
      : '';

    switch (platform) {
      case 'whatsapp':
        return `🔥 *عرض خاص وحصري من سوق مصر الكبرى* 🔥\n\n📌 *${socialShareProduct.name}*\n\n💰 *السعر الآن:* ${socialShareProduct.price.toLocaleString()} ج.م ${
          socialShareProduct.originalPrice ? `~(بدلاً من ${socialShareProduct.originalPrice.toLocaleString()} ج.م)~` : ''
        }${installmentSnippet}\n\n✅ ضمان محلي معتمد ضد عيوب الصناعة\n🚚 شحن وتوصيل فوري لجميع محافظات مصر\n💵 الدفع عند الاستلام أو بمحفظة فودافون كاش وإنستاباي مصر\n\n📲 *للطلب المباشر والتفاصيل:* \n${trackingUrl}`;

      case 'facebook':
        return `💥 كسر أسعار وتخفيضات ولا في الخيال من سوق مصر الكبرى! 💥\n\nاحصل الآن على ${socialShareProduct.name}\n\nسعر الكاش: ${socialShareProduct.price.toLocaleString()} ج.م فقط! 🏷️${installmentSnippet}\n\n✨ مميزات إضافية:\n- إمكانية المعاينة قبل الاستلام\n- طرق دفع إلكترونية مرنة (إنستاباي / فودافون كاش / ميزة / فوري)\n- عقود تقسيط رسمية موثقة وإيصالات أمانة قانونية تضمن حقك وحق المتجر 📜\n\n👇 اضغط على الرابط للشراء الفوري أو تقديم طلب تقسيط:\n${trackingUrl}\n\n#سوق_مصر #تقسيط #عروض_مصر #إنستاباي #تسوق_أونلاين`;

      case 'instagram':
        return `✨ Upgrade Your Lifestyle with NileMart Egypt! ✨\n\n${socialShareProduct.name}\n\n🏷️ السعر: ${socialShareProduct.price.toLocaleString()} EGP\n${
          socialShareProduct.isInstallmentAvailable ? `💳 قسط شهري يبدأ من ${minMonthly.toLocaleString()} EGP\n` : ''
        }⚡ توصيل سريع في القاهرة والجيزة وجميع المحافظات\n\n🔗 رابط الشراء والتقسيط متاح في البايو أو عبر اللينك:\n${trackingUrl}\n\n#egyptshopping #instapay #cairo #alexandria #nilemart`;

      case 'telegram':
        return `📢 *صفقة اليوم الحصرية:* \n\n${socialShareProduct.name}\n\n💸 *السعر المخفض:* ${socialShareProduct.price.toLocaleString()} ج.م\n${installmentSnippet}\n\n📦 التوصيل لباب البيت في 24 ساعة\n🔗 رابط المنتج: ${trackingUrl}`;
    }
  };

  const marketingText = getMarketingCopy();

  const handleCopyText = () => {
    navigator.clipboard.writeText(marketingText);
    setCopied(true);
    addToast('تم نسخ المنشور التسويقي بالكامل مع رابط التتبع إلى الحافظة');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(marketingText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleOpenFacebook = () => {
    const encodedUrl = encodeURIComponent(trackingUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden text-right flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black">أدوات التسويق والنشر على السوشيال ميديا</h2>
              <p className="text-xs text-indigo-200">
                سوّق هذا المنتج لجمهورك على فيسبوك وواتساب وانستجرام بضغطة واحدة
              </p>
            </div>
          </div>
          <button
            onClick={() => setSocialShareProduct(null)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Product Summary Preview */}
          <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-3">
            <img
              src={socialShareProduct.image}
              alt={socialShareProduct.name}
              className="w-16 h-16 object-contain bg-white rounded-lg border p-1"
            />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                {socialShareProduct.name}
              </h4>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm font-black text-amber-600">
                  {socialShareProduct.price.toLocaleString()} ج.م
                </span>
                {socialShareProduct.isInstallmentAvailable && (
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                    تقسيط متاح حتى {socialShareProduct.maxInstallmentMonths} شهر
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Social Platform Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              اختر المنصة التسويقية المستهدفة:
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setPlatform('whatsapp')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  platform === 'whatsapp'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                <span>واتساب</span>
              </button>

              <button
                onClick={() => setPlatform('facebook')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  platform === 'facebook'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                <span>فيسبوك</span>
              </button>

              <button
                onClick={() => setPlatform('instagram')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  platform === 'instagram'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-rose-500 shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                <span>انستجرام</span>
              </button>

              <button
                onClick={() => setPlatform('telegram')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  platform === 'telegram'
                    ? 'bg-sky-500 text-white border-sky-500 shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                <span>تليجرام</span>
              </button>
            </div>
          </div>

          {/* Affiliate / Campaign Code */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-indigo-900 block">كود الحملة / التتبع (UTM Campaign):</span>
              <span className="text-[11px] text-indigo-600">
                يساعدك على قياس مصدر المبيعات والأرباح
              </span>
            </div>
            <input
              type="text"
              value={affiliateCode}
              onChange={e => setAffiliateCode(e.target.value)}
              className="bg-white border border-indigo-200 text-indigo-950 font-mono text-xs font-bold px-3 py-1.5 rounded-lg text-center w-36 outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Generated Arabic Marketing Post Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>نص المنشور التسويقي الجاهز (صيغة بيعية احترافية):</span>
              </label>
              <button
                onClick={handleCopyText}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ النص بالكامل'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={6}
              value={marketingText}
              className="w-full bg-slate-900 text-gray-100 font-mono text-xs p-3 rounded-xl border border-slate-700 outline-none leading-relaxed resize-none selection:bg-amber-500"
            />
          </div>

          {/* Social Graphic Promo Flyer Preview */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl p-4 text-white border border-slate-800 flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-lg p-1.5 flex items-center justify-center shrink-0">
              <img src={socialShareProduct.image} alt="" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                سوق مصر الكبرى • NileMart Deals
              </div>
              <div className="text-xs font-bold text-white line-clamp-1">
                {socialShareProduct.name}
              </div>
              <div className="text-sm font-black text-amber-300">
                السعر: {socialShareProduct.price.toLocaleString()} ج.م
              </div>
              <div className="text-[10px] text-gray-300">
                الدفع: فودافون كاش • إنستاباي • ميزة • كاش عند الاستلام
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 px-6 flex items-center justify-between gap-3">
          <button
            onClick={() => setSocialShareProduct(null)}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-100 transition-colors cursor-pointer"
          >
            إغلاق
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="bg-gray-800 hover:bg-gray-900 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>نسخ البوست</span>
            </button>

            {platform === 'whatsapp' ? (
              <button
                onClick={handleOpenWhatsApp}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>إرسال فوري إلى واتساب</span>
              </button>
            ) : platform === 'facebook' ? (
              <button
                onClick={handleOpenFacebook}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <Share2 className="w-4 h-4" />
                <span>مشاركة على فيسبوك</span>
              </button>
            ) : (
              <button
                onClick={handleCopyText}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <Share2 className="w-4 h-4" />
                <span>مشاركة الرابط والبوست</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
