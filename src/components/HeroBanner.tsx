import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShieldCheck,
  CreditCard,
  Share2,
  TrendingUp,
  ArrowLeft,
  CheckCircle,
  Zap
} from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setViewMode, setAdminTab, setSelectedCategory } = useStore();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#131921] via-[#1e293b] to-gray-100 pb-8 pt-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Hero Card */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-700/60 p-6 md:p-10 shadow-2xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left/Text Content */}
            <div className="lg:col-span-7 space-y-5 text-right">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full text-xs font-bold">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>المنصة الأولى المتكاملة للتجارة والتقسيط والـ ERP في مصر</span>
              </div>

              <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                سوّق، قسّط، واقبض أرباحك <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-amber-400 via-amber-200 to-amber-500">
                  بأعلى معايير الأمان والضمان القانوني
                </span>
              </h1>

              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                متجرك الخاص بإمكانيات تضاهي أمازون: أقسام متعددة، بوابات الدفع المصرية 
                (<span className="text-emerald-400 font-bold">إنستاباي، فودافون كاش، ميزة، فوري</span>)، 
                نظام تقسيط ائتماني محكم بعقود وإيصالات أمانة ثلاثية الأطراف بدون أي ثغرة، 
                وبرنامج محاسبي شامل يدير الخزائن، البنوك، الموردين والعملاء.
              </p>

              {/* Key Features Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                <div className="flex items-center gap-2 text-xs bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-gray-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>عقود وإيصالات أمانة معتمدة</span>
                </div>
                <div className="flex items-center gap-2 text-xs bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-gray-200">
                  <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>كل وسائل الدفع المصرية</span>
                </div>
                <div className="flex items-center gap-2 text-xs bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-gray-200">
                  <TrendingUp className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>برنامج ERP ومحاسبة شامل</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-400/25 flex items-center gap-2 text-sm cursor-pointer"
                >
                  <span>استكشف عروض المتجر</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setViewMode('admin');
                    setAdminTab('dashboard');
                  }}
                  className="bg-slate-800/90 hover:bg-slate-700 text-white font-bold px-5 py-3 rounded-xl border border-slate-600 transition-all flex items-center gap-2 text-sm cursor-pointer"
                >
                  <span>لوحة تحكم الإدارة والمحاسبة</span>
                </button>
              </div>
            </div>

            {/* Right Side Visual Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              {/* Payment Gateways Box */}
              <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">التحصيل الإلكتروني</h3>
                <p className="text-xs text-gray-400">
                  ربط فوري بحساب إنستاباي ومحافظ الكاش وكروت ميزة لتسوية الأرباح تلقائياً في الخزينة.
                </p>
                <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>تسوية فورية بدون تأخير</span>
                </div>
              </div>

              {/* Installment Risk Box */}
              <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">أمان التقسيط القانوني</h3>
                <p className="text-xs text-gray-400">
                  استعلام ائتماني ورفع بطاقة الرقم القومي وإيصال مرافق وإيصال أمانة ملزم للمحاكم.
                </p>
                <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>عقود محكمة بلا ثغرات</span>
                </div>
              </div>

              {/* Social Marketing Box */}
              <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <Share2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">تسويق الميديا</h3>
                <p className="text-xs text-gray-400">
                  مولد بوستات دعائية وروابط تتبع جاهزة للفيسبوك والواتساب لزيادة المبيعات.
                </p>
                <div className="text-[11px] font-bold text-indigo-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>نشر في ثوانٍ</span>
                </div>
              </div>

              {/* ERP Accounting Box */}
              <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">نظام الـ ERP الشامل</h3>
                <p className="text-xs text-gray-400">
                  قيود يومية آلية، حسابات موردين، كشوف حساب عملاء، ورقابة الخزينة والبنوك.
                </p>
                <div className="text-[11px] font-bold text-sky-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>أرباح وخسائر دقيقة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
