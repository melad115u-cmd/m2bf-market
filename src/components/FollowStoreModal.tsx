import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Users,
  CheckCircle2,
  Bell,
  Sparkles,
  Tag,
  ShieldCheck,
  X,
  Phone,
  User,
  MapPin,
  TrendingUp
} from 'lucide-react';

export const FollowStoreModal: React.FC = () => {
  const {
    isFollowModalOpen,
    setIsFollowModalOpen,
    followStore,
    isFollowing,
    currentFollower,
    totalFollowersCount,
    settings,
    setIsFollowerFeedOpen
  } = useStore();

  const [name, setName] = useState(currentFollower?.name || '');
  const [phone, setPhone] = useState(currentFollower?.phone || '');
  const [governorate, setGovernorate] = useState(currentFollower?.governorate || 'القاهرة');

  if (!isFollowModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    followStore({ name, phone, governorate });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 text-right">
        
        {/* Header */}
        <div className="p-6 pb-4 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white relative">
          <button
            onClick={() => setIsFollowModalOpen(false)}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Users className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                مجتمع متابعي المتجر
              </span>
              <h3 className="text-lg font-black text-white">
                متابعة {settings.storeName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800 text-xs text-gray-300">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 font-mono font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{totalFollowersCount.toLocaleString()} متابع نشط</span>
            </span>
            <span className="text-[11px] text-gray-400">انضم لأكبر عائلة تسوق</span>
          </div>
        </div>

        {/* Benefits List */}
        <div className="p-5 bg-amber-50/50 border-b border-amber-100/60 space-y-2 text-xs">
          <div className="flex items-start gap-2.5 text-slate-800 font-bold">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>معرفة كل ما هو جديد والمنتجات الحديثة لحظة نزولها في المتجر.</span>
          </div>
          <div className="flex items-start gap-2.5 text-slate-800 font-bold">
            <Tag className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>خصومات حصرية وكوبونات توفير خاصة بالمتابعين فقط.</span>
          </div>
          <div className="flex items-start gap-2.5 text-slate-800 font-bold">
            <Bell className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span>تنبيهات فورية عند انخفاض أسعار الأجهزة المفضلة لديك.</span>
          </div>
        </div>

        {/* Form or Already Followed State */}
        {isFollowing && currentFollower ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900">
                أنت تتابع المتجر بالفعل يا {currentFollower.name}!
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                تاريخ انضمامك للمتابعة: {currentFollower.followedAt}
              </p>
            </div>

            <button
              onClick={() => {
                setIsFollowModalOpen(false);
                setIsFollowerFeedOpen(true);
              }}
              className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-md"
            >
              افتح صفحة المتابع والمنتجات الحديثة الآن
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
            <div>
              <label className="block text-gray-700 font-bold mb-1">الاسم الكريم *</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute top-2.5 right-3" />
                <input
                  type="text"
                  required
                  placeholder="مثال: أحمد عبد الله"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-3 pr-9 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">رقم الموبايل / الواتساب *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute top-2.5 right-3" />
                <input
                  type="tel"
                  required
                  placeholder="01012345678"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-3 pr-9 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 font-mono outline-none focus:ring-2 focus:ring-amber-400 text-right"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">المحافظة</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute top-2.5 right-3" />
                <select
                  value={governorate}
                  onChange={e => setGovernorate(e.target.value)}
                  className="w-full pl-3 pr-9 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-amber-400 bg-white cursor-pointer"
                >
                  <option value="القاهرة">القاهرة</option>
                  <option value="الجيزة">الجيزة</option>
                  <option value="الإسكندرية">الإسكندرية</option>
                  <option value="القليوبية">القليوبية</option>
                  <option value="الدقهلية (المنصورة)">الدقهلية (المنصورة)</option>
                  <option value="الغربية (طنطا)">الغربية (طنطا)</option>
                  <option value="الشرقية (الزقازيق)">الشرقية (الزقازيق)</option>
                  <option value="المنوفية">المنوفية</option>
                  <option value="البحيرة">البحيرة</option>
                  <option value="كفر الشيخ">كفر الشيخ</option>
                  <option value="دمياط">دمياط</option>
                  <option value="بورسعيد">بورسعيد</option>
                  <option value="الإسماعيلية">الإسماعيلية</option>
                  <option value="السويس">السويس</option>
                  <option value="الفيوم">الفيوم</option>
                  <option value="بني سويف">بني سويف</option>
                  <option value="المنيا">المنيا</option>
                  <option value="أسيوط">أسيوط</option>
                  <option value="سوهاج">سوهاج</option>
                  <option value="قنا">قنا</option>
                  <option value="الأقصر">الأقصر</option>
                  <option value="أسوان">أسوان</option>
                  <option value="البحر الأحمر (الغردقة)">البحر الأحمر (الغردقة)</option>
                  <option value="جنوب سيناء (شرم الشيخ)">جنوب سيناء (شرم الشيخ)</option>
                  <option value="مرسى مطروح">مرسى مطروح</option>
                  <option value="الوادي الجديد">الوادي الجديد</option>
                  <option value="شمال سيناء">شمال سيناء</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تأكيد المتابعة والانضمام الآن</span>
              </button>
            </div>

            <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>بياناتك محفوظة بأمان تام ولا نشاركها إطلاقاً</span>
            </p>
          </form>
        )}

      </div>
    </div>
  );
};
