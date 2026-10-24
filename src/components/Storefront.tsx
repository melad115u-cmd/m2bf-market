import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { WhatsAppSupportBadge } from './WhatsAppSupportBadge';
import { InstallAppModal } from './InstallAppModal';
import { ShareStoreModal } from './ShareStoreModal';
import {
  Menu,
  Search,
  ShoppingCart,
  PhoneCall,
  Package,
  Sparkles,
  MapPin,
  Trash2,
  CalendarCheck,
  Download,
  Share2
} from 'lucide-react';

export const Storefront: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    settings,
    setIsTrackingModalOpen
  } = useStore();

  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Filter products by active category (if not 'all') and search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeCategoryObj = categories.find(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col text-right">
      {/* Dynamic Announcement Banner (Configurable from Admin Settings) */}
      {settings.topBannerText && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-black text-center flex items-center justify-center gap-2 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-slate-950 shrink-0" />
          <span>{settings.topBannerText}</span>
        </div>
      )}

      {/* Categories Bar - ONLY displays categories added/managed in the Admin Panel */}
      <div className="bg-[#232f3e] text-gray-200 border-t border-slate-700/60 text-xs px-4 py-2 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max">
            {/* All Products button */}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'hover:bg-slate-700 text-white'
              }`}
            >
              <Menu className="w-4 h-4" />
              <span>جميع المنتجات</span>
            </button>

            {/* Display ONLY categories added in the Admin Panel */}
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
                  selectedCategory === cat.id
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'hover:bg-slate-700 text-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Quick Actions in Subnav: Install App & Share Store */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-black transition-all shadow-xs cursor-pointer active:scale-95"
              title="تثبيت التطبيق على الموبايل أو الكمبيوتر بكل سهولة وبدون اهتزاز"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تثبيت التطبيق 📱</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-600 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              title="مشاركة المتجر على فيسبوك، واتساب، تليجرام، انستجرام، مسنجر، وسناب شات"
            >
              <Share2 className="w-3.5 h-3.5 text-sky-400" />
              <span>مشاركة المتجر 🌐</span>
            </button>

            <button
              onClick={() => setIsTrackingModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer"
            >
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>متابعة شحنتك</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Products Storefront Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full space-y-6">
        {/* Top Header Row: Category Title & Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div>
            <h1 className="text-base md:text-xl font-black text-gray-950 flex items-center gap-2">
              <span>{selectedCategory === 'all' ? 'جميع المنتجات المتوفرة' : activeCategoryObj?.name}</span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                ({filteredProducts.length} منتج)
              </span>
            </h1>
            {searchQuery && (
              <p className="text-xs text-gray-500 mt-1">
                البحث عن: <strong className="text-gray-900 font-bold">"{searchQuery}"</strong>
              </p>
            )}
          </div>

          {/* Quick Category Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs font-bold">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl transition-colors shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              الكل
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl transition-colors shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-gray-800">لا توجد منتجات في هذا القسم حالياً</h3>
            <p className="text-xs text-gray-500">
              يمكنك استعراض باقي المنتجات أو تغيير خيارات البحث
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer hover:bg-amber-500 transition-colors"
            >
              عرض كافة المنتجات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Simple Clean Footer */}
      <footer className="bg-[#131921] text-gray-300 text-xs border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
          <div className="space-y-1">
            <div className="text-base font-black text-white">{settings.storeName}</div>
            <div className="text-gray-400 text-[11px]">
              خدمة العملاء والخط الساخن: {settings.supportPhone} • الدعم الفني: {settings.supportEmail}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsTrackingModalOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs transition-colors border border-slate-700 flex items-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5" />
              <span>متابعة طلبي</span>
            </button>
          </div>
        </div>

        <div className="bg-[#0b0e14] py-3 text-center text-gray-500 text-[11px] border-t border-slate-800/60">
          جميع الحقوق محفوظة © 2026 {settings.storeName} • تسوق آمن ودفع إلكتروني معتمد
        </div>
      </footer>

      {/* Dynamic WhatsApp Support & Barcode (Disappears if whatsappNumber is deleted) */}
      <WhatsAppSupportBadge />

      {/* Install App on Mobile & PC Modal */}
      <InstallAppModal
        settings={settings}
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Share Store on Social Media Modal */}
      <ShareStoreModal
        settings={settings}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
