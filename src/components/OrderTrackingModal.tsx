import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { OrderStatus } from '../types';

export const OrderTrackingModal: React.FC = () => {
  const {
    isTrackingModalOpen,
    setIsTrackingModalOpen,
    orders,
    trackingOrderQuery,
    setTrackingOrderQuery
  } = useStore();

  const [searchQuery, setSearchQuery] = useState(trackingOrderQuery || '');
  const [searched, setSearched] = useState(false);

  if (!isTrackingModalOpen) return null;

  const foundOrder = orders.find(
    o =>
      o.id.toLowerCase() === searchQuery.trim().toLowerCase() ||
      o.id.replace('ORD-2026-', '') === searchQuery.trim() ||
      o.customerPhone.includes(searchQuery.trim()) ||
      (o.customerPhone2 && o.customerPhone2.includes(searchQuery.trim()))
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const getStepState = (currentStatus: OrderStatus, step: OrderStatus) => {
    const statusOrder: OrderStatus[] = ['received', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(step);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col text-right">
        {/* Header */}
        <div className="bg-[#131921] text-white p-4 px-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-black">متابعة مسار الشحنة وحالة الطلب</h2>
          </div>
          <button
            onClick={() => {
              setIsTrackingModalOpen(false);
              setSearched(false);
            }}
            className="p-1 hover:bg-white/10 rounded-lg text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-bold text-gray-700">
              أدخل رقم الطلب أو رقم الهاتف المسجل به:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="مثال: ORD-2026-8805 أو 01002345678"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 p-2.5 rounded-xl border border-gray-300 text-xs font-mono outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>تتبع</span>
              </button>
            </div>
          </form>

          {searched && !foundOrder && (
            <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <h4 className="text-xs font-bold text-rose-900">لم يتم العثور على طلب بهذا الرقم أو الهاتف</h4>
              <p className="text-[11px] text-rose-700">
                يرجى التأكد من كتابة رقم الطلب كما ظهر لك عند الشراء (مثلاً ORD-2026-XXXX) أو رقم الهاتف.
              </p>
            </div>
          )}

          {foundOrder && (
            <div className="space-y-6">
              {/* Order Basic Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-gray-950">{foundOrder.id}</span>
                    <span className="text-[11px] text-gray-400">({foundOrder.createdAt})</span>
                  </div>
                  <div className="text-gray-700 font-bold mt-1">
                    العميل: {foundOrder.customerName}
                  </div>
                  <div className="text-gray-500 text-[11px] flex items-center gap-1 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{foundOrder.customerPhone}</span>
                    {foundOrder.customerPhone2 && <span> / {foundOrder.customerPhone2}</span>}
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-[11px] text-gray-400 block">المبلغ الإجمالي:</span>
                  <span className="text-base font-black text-amber-600 font-mono">
                    {foundOrder.total.toLocaleString()} ج.م
                  </span>
                  <div className="text-[10px] text-gray-500">
                    طريقة الدفع: {foundOrder.paymentMethod}
                  </div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div>
                <h4 className="text-xs font-black text-gray-900 mb-3">مراحل الشحن والتسليم:</h4>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                  {/* Step 1 */}
                  <div className="space-y-1.5 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${
                        getStepState(foundOrder.status, 'received') === 'completed' ||
                        getStepState(foundOrder.status, 'received') === 'active'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-800">تم التأكيد</span>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-1.5 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${
                        getStepState(foundOrder.status, 'processing') === 'completed' ||
                        getStepState(foundOrder.status, 'processing') === 'active'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-800">جاري التجهيز</span>
                  </div>

                  {/* Step 3 */}
                  <div className="space-y-1.5 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${
                        getStepState(foundOrder.status, 'shipped') === 'completed' ||
                        getStepState(foundOrder.status, 'shipped') === 'active'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-800">مع المندوب</span>
                  </div>

                  {/* Step 4 */}
                  <div className="space-y-1.5 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${
                        getStepState(foundOrder.status, 'delivered') === 'completed' ||
                        getStepState(foundOrder.status, 'delivered') === 'active'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-800">تم التسليم</span>
                  </div>
                </div>
              </div>

              {/* Status Timeline History */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                <h5 className="text-xs font-bold text-gray-900">سجل التحديثات الحية للشحنة:</h5>
                <div className="space-y-2.5">
                  {(foundOrder.statusTimeline || []).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div>
                        <span className="text-gray-900 font-bold block">{item?.note || 'تحديث حالة الشحنة'}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{item?.timestamp || ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address & Landmark */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs space-y-1">
                <div className="font-bold text-amber-950 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>عنوان التسليم المحدد:</span>
                </div>
                <div className="text-gray-800">
                  {foundOrder.governorate} - {foundOrder.shippingAddress}
                </div>
                <div className="text-amber-900 font-semibold text-[11px]">
                  العلامة المميزة: {foundOrder.landmark}
                </div>
              </div>

              {/* Items List */}
              <div>
                <h5 className="text-xs font-bold text-gray-900 mb-2">المنتجات في الشحنة:</h5>
                <div className="space-y-2">
                  {(foundOrder.items || []).map(item => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-lg text-xs"
                    >
                      <img
                        src={item.product.image}
                        alt=""
                        className="w-12 h-12 object-contain rounded border p-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 truncate">{item.product.name}</div>
                        <div className="text-gray-500 text-[11px]">
                          الكمية: {item.quantity} • السعر: {(item.product.price * item.quantity).toLocaleString()} ج.م
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
