import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Sparkles,
  Tag,
  Flame,
  ShoppingCart,
  X,
  Heart,
  TrendingDown,
  UserCheck,
  CheckCircle,
  Copy,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { Product } from '../types';

export const FollowerFeedModal: React.FC = () => {
  const {
    isFollowerFeedOpen,
    setIsFollowerFeedOpen,
    currentFollower,
    unfollowStore,
    products,
    addToCart,
    setSelectedProduct,
    toggleWishlistProduct,
    isProductInWishlist,
    setIsWishlistOpen,
    addToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'new_arrivals' | 'follower_deals' | 'coupons'>('new_arrivals');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  if (!isFollowerFeedOpen) return null;

  // New arrivals: products sorted or tagged as new
  const newArrivals = [...products].reverse().slice(0, 8);

  // Exclusive deals: products with highest discounts
  const followerDeals = [...products]
    .filter(p => p.originalPrice && p.originalPrice > p.price)
    .sort((a, b) => {
      const discA = (a.originalPrice! - a.price);
      const discB = (b.originalPrice! - b.price);
      return discB - discA;
    });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    addToast(`تم نسخ كوبون المتابعين "${code}" بنجاح!`);
    setTimeout(() => setCopiedCoupon(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 text-right">
        
        {/* Follower Profile Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-950 text-white relative">
          <button
            onClick={() => setIsFollowerFeedOpen(false)}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                {currentFollower?.name ? currentFollower.name.charAt(0) : 'م'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">
                    صفحتك الشخصية: أحدث المنتجات والعروض
                  </h3>
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    <span>متابع مميز</span>
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-0.5">
                  أهلاً بك يا <strong className="text-amber-400">{currentFollower?.name || 'عميلنا العزيز'}</strong> ({currentFollower?.phone}) • {currentFollower?.governorate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsFollowerFeedOpen(false);
                  setIsWishlistOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                <span>قائمتي المفضلة</span>
              </button>

              <button
                onClick={() => {
                  unfollowStore();
                  setIsFollowerFeedOpen(false);
                }}
                className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1"
                title="إلغاء المتابعة"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">إلغاء المتابعة</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-800 overflow-x-auto">
            <button
              onClick={() => setActiveTab('new_arrivals')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'new_arrivals'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>المنتجات الحديثة (وصل حديثاً)</span>
            </button>

            <button
              onClick={() => setActiveTab('follower_deals')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'follower_deals'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>أقوى عروض وتخفيضات المتابعين</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'coupons'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              <span>كوبونات وهدايا المتابعين</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB 1: NEW ARRIVALS */}
          {activeTab === 'new_arrivals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div>
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>المنتجات الحديثة المضافة بالمتجر مؤخراً:</span>
                  </h4>
                  <p className="text-xs text-gray-500">
                    أنت أول من يعلم! تصفح أحدث الأجهزة والموديلات الأصلية المتاحة للشراء الفوري والتقسيط
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {newArrivals.map(prod => {
                  const inWishlist = isProductInWishlist(prod.id);
                  return (
                    <div
                      key={prod.id}
                      className="bg-white border border-gray-200 hover:border-amber-400 rounded-2xl p-3.5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group relative"
                    >
                      <div className="absolute top-2 right-2 z-10 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                        جديد
                      </div>

                      <button
                        onClick={() => toggleWishlistProduct(prod.id)}
                        className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-rose-50 text-gray-400 hover:text-rose-600 flex items-center justify-center shadow-xs transition-colors"
                        title="حفظ في المفضلة"
                      >
                        <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>

                      <div>
                        <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2 border border-gray-100 flex items-center justify-center">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                          {prod.category}
                        </span>
                        <h5
                          onClick={() => {
                            setSelectedProduct(prod);
                            setIsFollowerFeedOpen(false);
                          }}
                          className="text-xs font-bold text-slate-900 hover:text-amber-600 cursor-pointer line-clamp-2 leading-relaxed"
                        >
                          {prod.name}
                        </h5>

                        <div className="pt-2 flex items-baseline gap-2">
                          <span className="text-sm font-black text-slate-950 font-mono">
                            {prod.price.toLocaleString()} ج.م
                          </span>
                          {prod.originalPrice && prod.originalPrice > prod.price && (
                            <span className="text-[11px] text-gray-400 line-through font-mono">
                              {prod.originalPrice.toLocaleString()} ج.م
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                        <button
                          onClick={() => addToCart(prod, 1)}
                          className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>أضف للسلة</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedProduct(prod);
                            setIsFollowerFeedOpen(false);
                          }}
                          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs"
                          title="تفاصيل"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: FOLLOWER DEALS */}
          {activeTab === 'follower_deals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div>
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-500" />
                    <span>أعلى نسب تخفيض وخصومات المتابعين:</span>
                  </h4>
                  <p className="text-xs text-gray-500">
                    وفر آلاف الجنيهات مع أقوى العروض الحصرية المتاحة حالياً
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {followerDeals.map(prod => {
                  const dropAmount = (prod.originalPrice || prod.price) - prod.price;
                  const discountPercent = Math.round((dropAmount / (prod.originalPrice || prod.price)) * 100);

                  return (
                    <div
                      key={prod.id}
                      className="bg-white border border-rose-200 hover:border-amber-400 rounded-2xl p-3.5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group relative"
                    >
                      <div className="absolute top-2 right-2 z-10 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        <span>خصم {discountPercent}% ({dropAmount.toLocaleString()} ج.م)</span>
                      </div>

                      <div>
                        <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2 border border-gray-100 flex items-center justify-center">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                          {prod.category}
                        </span>
                        <h5
                          onClick={() => {
                            setSelectedProduct(prod);
                            setIsFollowerFeedOpen(false);
                          }}
                          className="text-xs font-bold text-slate-900 hover:text-amber-600 cursor-pointer line-clamp-2 leading-relaxed"
                        >
                          {prod.name}
                        </h5>

                        <div className="pt-2 flex items-baseline gap-2">
                          <span className="text-sm font-black text-slate-950 font-mono">
                            {prod.price.toLocaleString()} ج.م
                          </span>
                          <span className="text-[11px] text-gray-400 line-through font-mono">
                            {prod.originalPrice?.toLocaleString()} ج.م
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                        <button
                          onClick={() => addToCart(prod, 1)}
                          className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>شراء وتوفير الخصم</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-gray-100">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span>كوبونات ورموز الخصم الترويجية الخاصة بك كمتابع:</span>
                </h4>
                <p className="text-xs text-gray-500">
                  انسخ أي كود وضعه في خانة الخصم بصفحة الشراء
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Coupon 1 */}
                <div className="border border-amber-300 bg-amber-50/50 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-black text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full inline-block mb-1">
                      خصم ترحيبي للمتابعين
                    </span>
                    <h5 className="text-base font-black text-slate-950">خصم 200 جنيه على أول طلب</h5>
                    <p className="text-xs text-gray-600 mt-1">
                      سارٍ على جميع الأجهزة الكهربائية والموبايلات والشاشات بحد أدنى 1,500 ج.م
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                    <span className="font-mono font-black text-sm text-slate-900 bg-white px-3 py-1 rounded-xl border border-amber-400">
                      FOLLOWER200
                    </span>
                    <button
                      onClick={() => handleCopyCode('FOLLOWER200')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black transition-colors"
                    >
                      {copiedCoupon === 'FOLLOWER200' ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                          <span>تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ الكود</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Coupon 2 */}
                <div className="border border-emerald-300 bg-emerald-50/50 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full inline-block mb-1">
                      شحن مجاني
                    </span>
                    <h5 className="text-base font-black text-slate-950">توصيل وشحن مجاني لجميع المحافظات</h5>
                    <p className="text-xs text-gray-600 mt-1">
                      سارٍ على جميع الطلبيات لأعضاء ومتابعي المتجر المميزين
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-emerald-200">
                    <span className="font-mono font-black text-sm text-slate-900 bg-white px-3 py-1 rounded-xl border border-emerald-400">
                      FREESHIP_VIP
                    </span>
                    <button
                      onClick={() => handleCopyCode('FREESHIP_VIP')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-colors"
                    >
                      {copiedCoupon === 'FREESHIP_VIP' ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ الكود</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
