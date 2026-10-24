import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Star,
  ShoppingCart,
  CalendarCheck,
  ShieldCheck,
  Truck,
  Share2,
  Maximize2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    openInstallmentApplication,
    setSocialShareProduct,
    setPreviewImage,
    settings
  } = useStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedMonths, setSelectedMonths] = useState<number>(12);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(10);

  if (!selectedProduct) return null;

  const product = selectedProduct;
  const isInstallment = product.isInstallmentAvailable;

  const imagesList = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  const currentImg = imagesList[activeImageIdx] || product.image;

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Installment calculations if applicable
  const maxMonths = product.maxInstallmentMonths || 12;
  const effectiveMonths = Math.min(selectedMonths, maxMonths);
  const downPaymentAmount = Math.round(product.price * (downPaymentPercent / 100));
  const financedAmount = product.price - downPaymentAmount;
  const rateMap: Record<number, number> = { 3: 0.0, 6: 0.04, 12: 0.08, 18: 0.12, 24: 0.16 };
  const currentRate = rateMap[effectiveMonths] || 0.10;
  const totalFinancedWithInterest = Math.round(financedAmount * (1 + currentRate));
  const simulatedMonthlyAmount = Math.round(totalFinancedWithInterest / effectiveMonths);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col text-right">
        {/* Header */}
        <div className="bg-[#131921] text-white p-3.5 px-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">
              {product.brand}
            </span>
            <span className="text-gray-400 text-xs">•</span>
            <span className="text-gray-200 text-xs">كود المنتج: {product.id}</span>
          </div>
          <button
            onClick={() => setSelectedProduct(null)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Image Gallery Column */}
            <div className="md:col-span-5 flex flex-col items-center bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <div className="relative w-full h-72 flex items-center justify-center overflow-hidden group">
                <img
                  src={currentImg}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain cursor-zoom-in"
                  onClick={() => setPreviewImage(currentImg)}
                />

                <button
                  onClick={() => setPreviewImage(currentImg)}
                  className="absolute bottom-2 left-2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-xl shadow border border-gray-200 flex items-center gap-1 text-xs font-bold transition-all"
                  title="تكبير الصورة"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>تكبير الصورة</span>
                </button>
              </div>

              {/* Thumbnails list */}
              {imagesList.length > 1 && (
                <div className="flex items-center gap-2 mt-3 overflow-x-auto p-1 max-w-full">
                  {imagesList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-14 h-14 rounded-xl border-2 p-1 overflow-hidden shrink-0 bg-white transition-all ${
                        idx === activeImageIdx
                          ? 'border-amber-500 ring-2 ring-amber-400/30'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Column */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h1 className="text-base md:text-xl font-black text-gray-950 leading-snug">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                  <span className="font-black text-sm text-gray-900">{product.rating}</span>
                  <span className="text-xs text-gray-500">({product.ratingCount} تقييم مشترين)</span>
                  <span className="text-gray-300 mr-2">|</span>
                  <span className="text-emerald-700 text-xs font-bold">
                    متوفر بالمستودع: {product.stock} قطعة
                  </span>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-gray-500 block">السعر النهائي:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-gray-950">
                      {product.price.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-gray-800">ج.م</span>
                  </div>
                </div>

                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="text-left">
                    <span className="text-xs text-gray-400 block">السعر قبل الخصم:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400 line-through">
                        {product.originalPrice.toLocaleString()} ج.م
                      </span>
                      <span className="bg-rose-600 text-white font-bold text-xs px-2 py-0.5 rounded">
                        وفر {discountPercent}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 mb-1">وصف ومواصفات المنتج:</h4>
                <p className="text-xs text-gray-600 leading-relaxed bg-white border border-gray-100 rounded-xl p-3">
                  {product.description}
                </p>
              </div>

              {/* Installment Simulator ONLY if enabled for this product */}
              {isInstallment && (
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-emerald-950 font-black text-xs md:text-sm">
                      <CalendarCheck className="w-4 h-4 text-emerald-600" />
                      <span>حاسبة ونظام التقسيط الخاص بهذا المنتج</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      حتى {product.maxInstallmentMonths} شهر
                    </span>
                  </div>

                  {/* Plan months select */}
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-900 mb-1.5">
                      اختر مدة التقسيط:
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[3, 6, 12, 18, 24].filter(m => m <= (product.maxInstallmentMonths || 12)).map(months => (
                        <button
                          key={months}
                          onClick={() => setSelectedMonths(months)}
                          className={`py-1.5 px-1 rounded-lg text-xs font-black transition-all ${
                            effectiveMonths === months
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white hover:bg-emerald-100 text-emerald-950 border border-emerald-200'
                          }`}
                        >
                          {months} شهر
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Calculations Breakdown */}
                  <div className="bg-white border border-emerald-200 rounded-xl p-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <span className="text-gray-500 text-[10px] block">القسط الشهري:</span>
                      <span className="text-sm md:text-base font-black text-emerald-900">
                        {simulatedMonthlyAmount.toLocaleString()} ج.م
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px] block">المقدم المطلوب:</span>
                      <span className="text-sm md:text-base font-bold text-gray-800">
                        {downPaymentAmount.toLocaleString()} ج.م
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px] block">فائدة التقسيط:</span>
                      <span className="text-sm font-bold text-emerald-700">
                        {product.installmentInterestRate || settings.defaultInstallmentInterestRate || 15}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px] block">مصاريف الاستعلام:</span>
                      <span className="text-sm font-bold text-amber-700">
                        {product.inquiryFee || settings.defaultInquiryFee || 150} ج.م
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-emerald-800 bg-emerald-100/60 p-2 rounded-lg font-medium">
                    * مصاريف الاستعلام والتحري الميداني تحصل فورياً لرجال الاستعلام لضمان سرعة الموافقة على الطلب خلال 24 ساعة.
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      openInstallmentApplication(product);
                    }}
                    disabled={product.stock === 0}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:text-gray-500 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>{product.stock === 0 ? 'المنتج غير متوفر للتقسيط حالياً' : 'طلب التقسيط وفتح العقد القانوني واستمارة الضمان'}</span>
                  </button>
                </div>
              )}

              {/* Main Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    addToCart(product);
                    setSelectedProduct(null);
                  }}
                  disabled={product.stock === 0}
                  className={`flex-1 font-black py-3 px-4 rounded-xl text-xs md:text-sm flex items-center justify-center gap-2 shadow transition-all cursor-pointer ${
                    product.stock === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-amber-400 hover:bg-amber-500 text-slate-950'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{product.stock === 0 ? 'نفد من المخزن حالياً' : 'إضافة إلى سلة المشتريات'}</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setSocialShareProduct(product);
                  }}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold py-3 px-4 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  title="نشر وتسويق المنتج"
                >
                  <Share2 className="w-4 h-4" />
                  <span>تسويق على الميديا</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
