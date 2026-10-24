import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  Truck,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    cartCount,
    setIsCheckoutOpen,
    settings,
    getShippingFee
  } = useStore();

  const [shippingGovernorate, setShippingGovernorate] = React.useState('القاهرة');

  if (!isCartOpen) return null;

  const shippingFee = cartTotal > 0 ? getShippingFee(shippingGovernorate) : 0;
  const grandTotal = cartTotal + shippingFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col text-right border-l border-gray-200">
          {/* Header */}
          <div className="bg-[#131921] text-white p-4 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-black">عربة التسوق ({cartCount} منتجات)</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                  <ShoppingCart className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-800">سلة التسوق فارغة حالياً</h3>
                  <p className="text-xs text-gray-500">
                    تصفح أحدث المنتجات والعروض الحصرية وأضفها إلى العربة
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
                >
                  تصفح المنتجات الآن
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">المنتجات المختارة:</span>
                  <button
                    onClick={clearCart}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>إفراغ السلة</span>
                  </button>
                </div>

                {cart.map(item => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3 items-center"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-contain bg-white rounded-lg border p-1 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <div className="text-xs font-black text-amber-600 mt-1">
                        {(item.product.price * item.quantity).toLocaleString()} ج.م
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-gray-400 font-normal mr-1">
                            ({item.product.price.toLocaleString()} ج.م للقطعة)
                          </span>
                        )}
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-400 hover:text-rose-600 p-1 transition-colors mr-auto"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Cart Footer / Checkout */}
          {cart.length > 0 && (
            <div className="bg-gray-50 border-t border-gray-200 p-4 space-y-3">
              {/* Governorate / Region Shipping Selector */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-gray-900">
                  <span className="flex items-center gap-1.5 text-amber-900">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <span>حساب مصاريف الشحن حسب المحافظة / المنطقة:</span>
                  </span>
                  <span className="text-amber-700 font-mono font-black">{shippingFee} ج.م</span>
                </div>
                <select
                  value={shippingGovernorate}
                  onChange={e => setShippingGovernorate(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs font-bold text-gray-800 outline-none cursor-pointer"
                >
                  {settings.shippingRegions && settings.shippingRegions.length > 0 ? (
                    settings.shippingRegions.map(reg => (
                      <option key={reg.id} value={reg.name}>
                        {reg.name} ({reg.fee} ج.م) {reg.deliveryDays ? `• ${reg.deliveryDays}` : ''}
                      </option>
                    ))
                  ) : (
                    Object.keys(settings.shippingFeesByGovernorate || {}).map(gov => (
                      <option key={gov} value={gov}>
                        {gov} ({settings.shippingFeesByGovernorate[gov]} ج.م)
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>إجمالي المنتجات:</span>
                  <span className="font-bold">{cartTotal.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>مصاريف الشحن والتوصيل ({shippingGovernorate}):</span>
                  <span className="font-bold text-amber-700 font-mono">{shippingFee} ج.م</span>
                </div>
                <div className="flex justify-between text-base font-black text-gray-950 pt-2 border-t border-gray-200">
                  <span>المبلغ الإجمالي المستحق:</span>
                  <span className="text-amber-600 font-mono">{grandTotal.toLocaleString()} ج.م</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-3 rounded-xl text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <span>متابعة الشراء واختيار طريقة الدفع</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 font-medium pt-1">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>دعم فودافون كاش • إنستاباي • كروت ميزة • فوري</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
