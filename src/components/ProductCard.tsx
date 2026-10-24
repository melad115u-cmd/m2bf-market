import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import {
  Star,
  ShoppingCart,
  Share2,
  CalendarCheck,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Heart
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    openInstallmentApplication,
    setSelectedProduct,
    setSocialShareProduct,
    setPreviewImage,
    toggleWishlistProduct,
    isProductInWishlist
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const imagesList = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  const currentImg = imagesList[activeImageIndex] || product.image;

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Monthly installment estimate only if enabled
  const minMonthly = product.isInstallmentAvailable && product.maxInstallmentMonths
    ? Math.round((product.price * 1.12) / product.maxInstallmentMonths)
    : 0;

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev + 1) % imagesList.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev - 1 + imagesList.length) % imagesList.length);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      {/* Product Image Area with Gallery Carousel & Zoom */}
      <div className="relative p-4 pb-1 bg-white">
        {/* Badges: Discount percentage & Tags */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 items-start">
          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white font-black text-xs px-2.5 py-0.5 rounded-lg shadow-sm">
              خصم {discountPercent}%
            </span>
          )}
          {product.tags && product.tags.length > 0 && (
            <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
              {product.tags[0]}
            </span>
          )}
        </div>

        {/* Top Left: Zoom, Wishlist & Share Buttons */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          <button
            onClick={e => {
              e.stopPropagation();
              toggleWishlistProduct(product.id);
            }}
            className={`w-8 h-8 rounded-full border flex items-center justify-center shadow-xs transition-transform hover:scale-110 cursor-pointer ${
              isProductInWishlist(product.id)
                ? 'bg-rose-50 border-rose-300 text-rose-600'
                : 'bg-white/90 hover:bg-rose-50 border-gray-200 text-gray-500 hover:text-rose-600'
            }`}
            title="حفظ في المفضلة (منتجات نفسك تشتريها)"
          >
            <Heart className={`w-3.5 h-3.5 ${isProductInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <button
            onClick={e => {
              e.stopPropagation();
              setSelectedProduct(product);
              setPreviewImage(currentImg);
            }}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-amber-50 border border-gray-200 text-gray-700 hover:text-amber-600 flex items-center justify-center shadow-xs transition-transform hover:scale-110 cursor-pointer"
            title="تكبير الصورة بجودة عالية"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={e => {
              e.stopPropagation();
              setSocialShareProduct(product);
            }}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-indigo-50 border border-gray-200 text-gray-700 hover:text-indigo-600 flex items-center justify-center shadow-xs transition-transform hover:scale-110 cursor-pointer"
            title="تسويق ونشر المنتج على الميديا"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Image with Navigation Arrows */}
        <div
          onClick={() => setSelectedProduct(product)}
          className="relative w-full h-56 flex items-center justify-center overflow-hidden cursor-pointer rounded-xl bg-gray-50/60"
        >
          <img
            src={currentImg}
            alt={product.name}
            className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Image Navigation Arrows (if multiple images) */}
          {imagesList.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 hover:bg-white text-gray-800 flex items-center justify-center shadow border border-gray-200 transition-opacity opacity-0 group-hover:opacity-100"
                title="الصورة السابقة"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 hover:bg-white text-gray-800 flex items-center justify-center shadow border border-gray-200 transition-opacity opacity-0 group-hover:opacity-100"
                title="الصورة التالية"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {imagesList.length > 1 && (
            <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1">
              {imagesList.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === activeImageIndex ? 'bg-amber-500 w-3' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Info Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand */}
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            {product.brand}
          </div>

          {/* Title */}
          <h3
            onClick={() => setSelectedProduct(product)}
            className="text-xs md:text-sm font-bold text-gray-900 line-clamp-2 hover:text-amber-600 cursor-pointer transition-colors leading-snug mb-2"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-gray-800">{product.rating}</span>
            <span className="text-[11px] text-gray-400">({product.ratingCount})</span>
          </div>

          {/* Pricing: Before discount, After discount */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-lg md:text-xl font-black text-gray-950">
                {product.price.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-gray-800">ج.م</span>

              {/* Price before discount */}
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="flex items-center gap-1 mr-auto text-xs">
                  <span className="text-gray-400 text-[11px]">بدلاً من:</span>
                  <span className="text-gray-400 line-through font-medium">
                    {product.originalPrice.toLocaleString()} ج.م
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Installment Badge ONLY if product has installment enabled */}
          {product.isInstallmentAvailable ? (
            <div
              onClick={() => openInstallmentApplication(product)}
              className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 mb-3 cursor-pointer hover:bg-emerald-100 transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                <span className="flex items-center gap-1">
                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>متاح تقسيط حتى {product.maxInstallmentMonths} شهر:</span>
                </span>
                <span className="text-emerald-950 font-black">
                  {minMonthly.toLocaleString()} ج.م / شهر
                </span>
              </div>
            </div>
          ) : (
            <div className="h-2 mb-3" />
          )}
        </div>

        {/* Stock warning if low */}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-bold mb-2 inline-flex items-center gap-1">
            <span>تنبيه: متبقي في المخزن {product.stock} قطع فقط!</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-1.5 pt-1">
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className={`w-full py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs font-black ${
              product.stock === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-amber-400 hover:bg-amber-500 text-slate-950'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{product.stock === 0 ? 'نفد من المخزن حالياً' : 'إضافة إلى سلة المشتريات'}</span>
          </button>

          {product.isInstallmentAvailable && product.stock > 0 && (
            <button
              onClick={() => openInstallmentApplication(product)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-2 rounded-xl text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>طلب شراء بالتقسيط المعتمد</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
