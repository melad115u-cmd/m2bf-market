import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Heart,
  Plus,
  Trash2,
  ShoppingCart,
  Share2,
  X,
  Search,
  Check,
  TrendingDown,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  FolderHeart
} from 'lucide-react';
import { Product } from '../types';

export const WishlistModal: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    collections,
    wishlist,
    activeCollectionId,
    setActiveCollectionId,
    createWishlistCollection,
    deleteWishlistCollection,
    removeFromWishlist,
    toggleWishlistProduct,
    isProductInWishlist,
    products,
    addToCart,
    setSelectedProduct,
    addToast
  } = useStore();

  const [showCreateGroupInput, setShowCreateGroupInput] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [pickerSearchQuery, setPickerSearchQuery] = useState('');
  const [pickerCategory, setPickerCategory] = useState('all');

  if (!isWishlistOpen) return null;

  // Active collection
  const currentCollection = collections.find(c => c.id === activeCollectionId) || collections[0] || {
    id: 'col-default',
    name: 'منتجات نفسك تشتريها',
    isDefault: true
  };

  // Items in active collection
  const activeItems = wishlist.filter(w => w.collectionId === currentCollection.id);
  const activeProductsWithItems = activeItems
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      return { item, product };
    })
    .filter((entry): entry is { item: typeof entry.item; product: Product } => !!entry.product);

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    createWishlistCollection(newGroupName.trim());
    setNewGroupName('');
    setShowCreateGroupInput(false);
  };

  const handleShareCollection = () => {
    const text = `شوف قائمة المفضلة الخاصة بي (${currentCollection.name}) على سوق مصر الكبرى!`;
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({ title: currentCollection.name, text, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} \n${shareUrl}`);
      addToast('تم نسخ رابط القائمة لمشاركتها مع أصحابك');
    }
  };

  // Filtered products for picker modal
  const filteredPickerProducts = products.filter(p => {
    const matchQuery = !pickerSearchQuery.trim() ||
      p.name.toLowerCase().includes(pickerSearchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(pickerSearchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(pickerSearchQuery.toLowerCase());
    const matchCategory = pickerCategory === 'all' || p.category === pickerCategory;
    return matchQuery && matchCategory;
  });

  const uniqueCategories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200 text-right">
        
        {/* Top Header Bar */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-amber-50/50 via-white to-amber-50/30">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-600 flex items-center justify-center shadow-xs">
              <Heart className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">المفضلة والمجموعات</h2>
              <p className="text-xs text-gray-500">احفظ كل ما يعجبك وتسوق وقتما تحب</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeProductsWithItems.length > 0 && (
              <button
                onClick={handleShareCollection}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                title="مشاركة القائمة"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">مشاركة</span>
              </button>
            )}
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="w-9 h-9 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Collections Tab Bar (Noon Style layout) */}
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/70 flex flex-wrap items-center justify-between gap-3">
          {/* On the Right: Collections switcher with "منتجات نفسك تشتريها" */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
            {collections.map(col => {
              const count = wishlist.filter(w => w.collectionId === col.id).length;
              const isActive = col.id === currentCollection.id;
              return (
                <button
                  key={col.id}
                  onClick={() => setActiveCollectionId(col.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-400/40 shadow-amber-400/20'
                      : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  <FolderHeart className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-gray-400'}`} />
                  <span>{col.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-slate-950 text-amber-300' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* On the Left: "+ اعمل مجموعة جديدة" Button */}
          <div className="flex items-center gap-2 shrink-0 mr-auto">
            {!showCreateGroupInput ? (
              <button
                onClick={() => setShowCreateGroupInput(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-black shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                title="إنشاء قائمة مخصصة جديدة"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ اعمل مجموعة جديدة</span>
              </button>
            ) : (
              <form onSubmit={handleCreateGroupSubmit} className="flex items-center gap-1.5 animate-in fade-in">
                <input
                  type="text"
                  autoFocus
                  placeholder="اسم المجموعة (مثل: أجهزة البيت)..."
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-amber-400 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-amber-400 w-44 bg-white"
                />
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-2.5 py-1.5 rounded-xl text-xs font-bold"
                >
                  حفظ
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateGroupInput(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Collection Header Details */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-slate-900">
                {currentCollection.name}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                ({activeProductsWithItems.length} {activeProductsWithItems.length === 1 ? 'منتج' : 'منتجات'})
              </span>
            </div>

            <div className="flex items-center gap-2">
              {activeProductsWithItems.length > 0 && (
                <button
                  onClick={() => setShowProductPicker(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ضيف منتجات</span>
                </button>
              )}

              {!currentCollection.isDefault && currentCollection.id !== 'col-default' && (
                <button
                  onClick={() => deleteWishlistCollection(currentCollection.id)}
                  className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-semibold p-1 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="حذف هذه المجموعة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف المجموعة</span>
                </button>
              )}
            </div>
          </div>

          {/* EMPTY STATE: Exactly as requested by User (Noon style banner) */}
          {activeProductsWithItems.length === 0 ? (
            <div className="py-12 sm:py-16 px-4 flex flex-col items-center justify-center text-center space-y-5 animate-in fade-in duration-300">
              {/* Illustrative Noon-like Heart Icon */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400/20 via-rose-100 to-amber-100 flex items-center justify-center shadow-inner">
                  <Heart className="w-12 h-12 text-rose-500 fill-rose-500/80 animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              {/* Central Text Requested: "احفظ وشارك واستقبل لما الاسعار تنزل" */}
              <div className="max-w-md space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  احفظ وشارك واستقبل لما الاسعار تنزل
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  احفظ المنتجات التي تنوي شراءها في مجموعتك الخاصة، وشاركها مع من تحب، وتابع التخفيضات أولاً بأول لننبهك فور نزول السعر!
                </p>
              </div>

              {/* Central Action Button Requested: "ضيف منتجات" */}
              <button
                onClick={() => setShowProductPicker(true)}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-950 text-sm font-black transition-all cursor-pointer shadow-lg shadow-amber-400/30 hover:shadow-xl hover:scale-105"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>ضيف منتجات</span>
              </button>
            </div>
          ) : (
            /* Items Grid when products exist in the collection */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {activeProductsWithItems.map(({ item, product }) => {
                const isPriceDropped = item.savedPrice > product.price;
                const dropAmount = item.savedPrice - product.price;

                return (
                  <div
                    key={item.productId}
                    className="bg-white border border-gray-200 hover:border-amber-400 rounded-2xl p-3.5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group relative"
                  >
                    {/* Price Drop Notification Badge */}
                    {isPriceDropped && (
                      <div className="absolute top-2 right-2 z-10 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm animate-bounce">
                        <TrendingDown className="w-3 h-3" />
                        <span>انخفض السعر {dropAmount.toLocaleString()} ج.م!</span>
                      </div>
                    )}

                    <div>
                      {/* Product Image & Remove */}
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3 border border-gray-100 flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                        />
                        <button
                          onClick={() => removeFromWishlist(product.id, currentCollection.id)}
                          className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 hover:bg-rose-50 text-gray-400 hover:text-rose-600 flex items-center justify-center shadow-xs transition-colors"
                          title="حذف من هذه المجموعة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                          {product.category}
                        </span>
                        <h4
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsWishlistOpen(false);
                          }}
                          className="text-xs font-bold text-slate-900 hover:text-amber-600 cursor-pointer line-clamp-2 leading-relaxed"
                        >
                          {product.name}
                        </h4>

                        <div className="pt-1 flex items-baseline gap-2">
                          <span className="text-sm font-black text-slate-950 font-mono">
                            {product.price.toLocaleString()} ج.م
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-[11px] text-gray-400 line-through font-mono">
                              {product.originalPrice.toLocaleString()} ج.م
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                      <button
                        onClick={() => {
                          addToCart(product, 1);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black transition-colors cursor-pointer shadow-xs"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>أضف للسلة</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsWishlistOpen(false);
                        }}
                        className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs transition-colors cursor-pointer"
                        title="تفاصيل المنتج"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* PRODUCT PICKER MODAL OVERLAY (When user clicks "ضيف منتجات") */}
        {showProductPicker && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
            <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200 text-right">
              {/* Header */}
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-amber-50/50">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-600" />
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      إضافة منتجات إلى: {currentCollection.name}
                    </h3>
                    <p className="text-[11px] text-gray-500">اختر المنتجات واضغط على زر الإضافة</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProductPicker(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filters */}
              <div className="p-3.5 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center gap-2">
                <div className="flex-1 min-w-[200px] relative">
                  <Search className="w-4 h-4 text-gray-400 absolute top-2.5 right-3" />
                  <input
                    type="text"
                    placeholder="ابحث بالاسم أو الماركة..."
                    value={pickerSearchQuery}
                    onChange={e => setPickerSearchQuery(e.target.value)}
                    className="w-full pl-3 pr-9 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                  />
                </div>

                <select
                  value={pickerCategory}
                  onChange={e => setPickerCategory(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-800 bg-white outline-none cursor-pointer"
                >
                  <option value="all">كل الأقسام</option>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Products List */}
              <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredPickerProducts.map(prod => {
                  const inThisCollection = isProductInWishlist(prod.id, currentCollection.id);

                  return (
                    <div
                      key={prod.id}
                      className={`border rounded-2xl p-3 flex items-center gap-3 transition-all ${
                        inThisCollection
                          ? 'border-amber-400 bg-amber-50/40'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-14 h-14 object-contain rounded-xl bg-gray-50 p-1 border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{prod.name}</h4>
                        <span className="text-[11px] font-black text-amber-600 font-mono block">
                          {prod.price.toLocaleString()} ج.م
                        </span>
                        <div className="mt-1">
                          <button
                            onClick={() => toggleWishlistProduct(prod.id, currentCollection.id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                              inThisCollection
                                ? 'bg-amber-400 text-slate-950 font-black'
                                : 'bg-slate-900 hover:bg-slate-800 text-amber-300'
                            }`}
                          >
                            {inThisCollection ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>مضاف للمجموعة</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3" />
                                <span>أضف للمجموعة</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                  {filteredPickerProducts.length} منتج متاح للإضافة
                </span>
                <button
                  onClick={() => setShowProductPicker(false)}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black cursor-pointer shadow-xs"
                >
                  تم والعودة للمفضلة
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
