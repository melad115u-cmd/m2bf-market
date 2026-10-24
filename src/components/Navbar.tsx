import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  ShoppingCart,
  Lock,
  LogOut,
  Package,
  Sparkles,
  LayoutDashboard,
  Store,
  Download,
  Share2,
  Heart,
  Users,
  UserCheck,
  UserPlus
} from 'lucide-react';
import { InstallAppModal } from './InstallAppModal';
import { ShareStoreModal } from './ShareStoreModal';

export const Navbar: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    currentUser,
    logoutAdmin,
    setIsLoginModalOpen,
    settings,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    cartCount,
    cartTotal,
    setIsCartOpen,
    setIsTrackingModalOpen,
    isFollowing,
    totalFollowersCount,
    setIsFollowModalOpen,
    setIsFollowerFeedOpen,
    wishlist,
    setIsWishlistOpen
  } = useStore();

  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const formatFollowers = (num: number) => {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace('.0', '') + 'B+';
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace('.0', '') + 'M+';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace('.0', '') + 'K';
    }
    return num.toLocaleString();
  };

  const handleAdminClick = () => {
    if (viewMode === 'admin') {
      setViewMode('storefront');
    } else {
      if (currentUser) {
        setViewMode('admin');
      } else {
        setIsLoginModalOpen(true);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#131921] text-white shadow-md">
      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3 md:gap-5">
        {/* Brand / Logo (Dynamic from Settings) */}
        <div
          onClick={() => setViewMode('storefront')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          {settings.storeLogoUrl ? (
            <img
              src={settings.storeLogoUrl}
              alt={settings.storeName}
              className="w-10 h-10 rounded-xl object-contain bg-white p-1 shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform border border-amber-400/40"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <span className="text-lg md:text-xl font-black text-slate-950 truncate max-w-[36px] text-center">
                {settings.storeLogoText || 'نيل'}
              </span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-base md:text-lg font-black tracking-tight text-white line-clamp-1">
              {settings.storeName}
            </span>
            <span className="text-[10px] text-gray-400 -mt-1 font-sans">
              Egypt E-Commerce
            </span>
          </div>
        </div>

        {/* Search Bar - Amazon Style with dynamic admin categories */}
        <div className="flex-1 flex items-center">
          <div className="flex w-full rounded-lg overflow-hidden border-2 border-transparent focus-within:border-amber-500 bg-white shadow-inner">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-2 border-l border-gray-300 outline-none hover:bg-gray-200 cursor-pointer max-w-[120px] md:max-w-[150px] truncate"
            >
              <option value="all">جميع الأقسام</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Input */}
            <input
              type="text"
              placeholder="ابحث في المنتجات، الماركات، المواصفات..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm text-gray-900 placeholder-gray-500 outline-none bg-white"
            />

            {/* Search Button */}
            <button
              onClick={() => {}}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-4 md:px-5 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="بحث"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Buttons: Track Order, Admin Lock/Login, Cart */}
        <div className="flex items-center gap-2 md:gap-2.5 shrink-0">
          {/* Install App on Mobile & PC Button */}
          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-md hover:scale-[1.02] active:scale-95 shrink-0"
            title="تثبيت التطبيق على الموبايل أو الكمبيوتر بكل سهولة وبدون اهتزاز"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تثبيت التطبيق</span>
            <span className="sm:hidden text-[11px]">تثبيت</span>
          </button>

          {/* Share Store Button (All Social Media) */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-sky-300 border border-slate-700 hover:border-sky-400 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
            title="مشاركة المتجر على فيسبوك، واتساب، تليجرام، انستجرام، مسنجر، وسناب شات"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">مشاركة المتجر</span>
            <span className="sm:hidden text-[11px]">مشاركة</span>
          </button>

          {/* Store Follow Button & Counter Badge (Accepts up to 100M+ followers) */}
          <div
            className="flex items-center rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-xs"
            title={`العدد الفعلي للمتابعين: ${totalFollowersCount.toLocaleString()} متابع`}
          >
            {/* Follower Counter Display */}
            <div
              onClick={() => isFollowing ? setIsFollowerFeedOpen(true) : setIsFollowModalOpen(true)}
              className="px-2 sm:px-2.5 py-1.5 bg-slate-950/80 text-amber-400 text-xs font-black font-mono border-l border-slate-700 flex items-center gap-1 cursor-pointer hover:bg-slate-950 transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatFollowers(totalFollowersCount)}</span>
              <span className="hidden md:inline text-[10px] text-gray-400 font-sans">متابع</span>
            </div>

            {/* Follow / Following Action Button */}
            {isFollowing ? (
              <button
                onClick={() => setIsFollowerFeedOpen(true)}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all cursor-pointer shadow-xs active:scale-95"
                title="صفحتك الشخصية: أحدث المنتجات والعروض للمتابعين"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="text-[11px] sm:text-xs">متابع ✓</span>
              </button>
            ) : (
              <button
                onClick={() => setIsFollowModalOpen(true)}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-xs active:scale-95 hover:scale-[1.02]"
                title="متابعة المتجر لمعرفة كل ما هو جديد وعروض المتابعين"
              >
                <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="text-[11px] sm:text-xs">متابعة</span>
              </button>
            )}
          </div>

          {/* Noon-style Wishlist (المفضلة) Button */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 hover:border-rose-400 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 relative"
            title="المفضلة وقوائم المنتجات (على طريقة نون)"
          >
            <div className="relative">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">المفضلة</span>
          </button>

          {/* Order Tracking Button */}
          <button
            onClick={() => setIsTrackingModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <Package className="w-4 h-4 text-amber-400" />
            <span>متابعة طلبي</span>
          </button>

          {/* Admin Toggle / Login Button */}
          {currentUser ? (
            <div className="flex items-center gap-1">
              <button
                onClick={handleAdminClick}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'admin'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
              >
                {viewMode === 'admin' ? (
                  <>
                    <Store className="w-4 h-4" />
                    <span>المتجر</span>
                  </>
                ) : (
                  <>
                    <LayoutDashboard className="w-4 h-4 text-amber-400" />
                    <span>لوحة الإدارة</span>
                  </>
                )}
              </button>

              <button
                onClick={logoutAdmin}
                className="p-1.5 hover:bg-rose-950 text-gray-400 hover:text-rose-400 rounded-lg transition-colors"
                title="قفل لوحة التحكم وتسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-200 border border-slate-700 hover:border-amber-400 text-xs font-bold transition-all cursor-pointer"
              title="دخول الإدارة (محمي برقم سري)"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">دخول الإدارة</span>
              <span className="sm:hidden">الإدارة</span>
            </button>
          )}

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:border-white border border-transparent transition-all relative text-white cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-amber-400" />
              <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <div className="hidden md:flex flex-col text-right text-xs leading-tight">
              <span className="text-gray-400 text-[11px]">سلة المشتريات</span>
              <span className="font-extrabold text-amber-400">
                {cartTotal.toLocaleString()} ج.م
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Install App Modal */}
      <InstallAppModal
        settings={settings}
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Social Media Share Store Modal */}
      <ShareStoreModal
        settings={settings}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </header>
  );
};
