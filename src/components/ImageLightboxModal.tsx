import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ZoomIn, ZoomOut, ChevronRight, ChevronLeft } from 'lucide-react';

export const ImageLightboxModal: React.FC = () => {
  const { previewImage, setPreviewImage, selectedProduct } = useStore();
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!previewImage) return null;

  const images = selectedProduct?.images && selectedProduct.images.length > 0
    ? selectedProduct.images
    : [previewImage];

  const currentIndex = images.indexOf(previewImage);

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + images.length) % images.length;
    setPreviewImage(images[nextIdx]);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % images.length;
    setPreviewImage(images[nextIdx]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in select-none">
      {/* Top Bar Controls */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10 text-white">
        <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full border border-white/20 text-xs">
          <span>صورة {currentIndex + 1} من {images.length}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.3, 2.5))}
            className="p-2 rounded-full bg-black/60 hover:bg-white/20 text-white border border-white/20 transition-colors"
            title="تكبير"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.3, 0.7))}
            className="p-2 rounded-full bg-black/60 hover:bg-white/20 text-white border border-white/20 transition-colors"
            title="تصغير"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setPreviewImage(null);
              setZoomLevel(1);
            }}
            className="p-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white transition-colors"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image View */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-8">
        <img
          src={previewImage}
          alt=""
          style={{ transform: `scale(${zoomLevel})` }}
          className="max-h-[85vh] max-w-[85vw] object-contain transition-transform duration-200 cursor-zoom-in rounded-xl shadow-2xl"
          onClick={() => setZoomLevel(prev => (prev === 1 ? 1.8 : 1))}
        />

        {/* Previous & Next Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-white/30 text-white border border-white/20 transition-all cursor-pointer"
              title="الصورة السابقة"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-white/30 text-white border border-white/20 transition-all cursor-pointer"
              title="الصورة التالية"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
