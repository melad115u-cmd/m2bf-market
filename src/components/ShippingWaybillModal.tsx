import React, { useState, useRef } from 'react';
import { Order, StoreSettings } from '../types';
import { printDocumentHtml } from '../utils/printUtils';
import { Printer, X, Truck, ShieldCheck, MapPin, Phone, Calendar, Package, Barcode, Check, Edit2 } from 'lucide-react';

interface Props {
  order: Order;
  settings: StoreSettings;
  onClose: () => void;
  onUpdateCourier?: (orderId: string, courierName: string) => void;
}

export const ShippingWaybillModal: React.FC<Props> = ({ order, settings, onClose, onUpdateCourier }) => {
  const waybillNo = order.waybillNumber || `WB-${order.id.replace('ORD-', '')}`;
  const [courier, setCourier] = useState(order.courierName || 'الشحن الداخلي للمتجر (أسطولنا الخاص)');
  const [isEditingCourier, setIsEditingCourier] = useState(false);
  const [customCourier, setCustomCourier] = useState('');
  const waybillRef = useRef<HTMLDivElement>(null);

  const courierOptions = [
    'الشحن الداخلي للمتجر (مندوبنا الخاص)',
    'شركة بوسطة مصر (Bosta Express)',
    'شركة أرامكس الدولية (Aramex Egypt)',
    'شركة Mylerz للشحن السريع',
    'البريد المصري للشحن السريع (Egypt Post)',
    'أخرى (تحديد شركة شحن مخصصة)'
  ];

  const handlePrint = () => {
    if (waybillRef.current) {
      printDocumentHtml({
        title: `بوليصة شحن وتسليم معتمدة #${waybillNo}`,
        subtitle: `شركة الشحن: ${courier} | المحافظة: ${order.governorate}`,
        storeName: settings.storeName || 'سوق مصر الكبرى',
        documentNumber: waybillNo,
        contentHtml: waybillRef.current.innerHTML
      });
    } else {
      window.print();
    }
  };

  const handleSaveCourier = (newCourier: string) => {
    setCourier(newCourier);
    setIsEditingCourier(false);
    if (onUpdateCourier) {
      onUpdateCourier(order.id, newCourier);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-300 text-gray-900 text-right print:shadow-none print:border-none print:max-w-full">
        {/* Modal Controls (Hidden in Print) */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <div>
              <span className="font-bold text-sm block">بوليصة الشحن والتسليم المعتمدة #{waybillNo}</span>
              <span className="text-[10px] text-gray-400">يمكنك طباعة البوليصة أو إغلاقها وتعديل شركة الشحن حسب رغبتك</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
              title="طباعة البوليصة فوراً"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة البوليصة</span>
            </button>
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-rose-900/80 text-gray-200 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              title="إغلاق البوليصة"
            >
              <X className="w-4 h-4" />
              <span>إغلاق</span>
            </button>
          </div>
        </div>

        {/* Courier / Shipping Company Selector Toolbar (Hidden in Print) */}
        <div className="bg-amber-50/80 border-b border-amber-200 p-3 px-5 flex flex-wrap items-center justify-between gap-2 text-xs print:hidden">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-700" />
            <span className="font-bold text-gray-800">شركة الشحن المسند إليها هذا الطلب:</span>
            {!isEditingCourier ? (
              <span className="bg-white border border-amber-300 text-slate-900 font-black px-2.5 py-1 rounded-lg">
                {courier}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {!isEditingCourier ? (
              <button
                onClick={() => setIsEditingCourier(true)}
                className="text-amber-800 hover:text-amber-950 font-bold underline text-xs flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>تغيير شركة الشحن</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  value={courierOptions.includes(courier) ? courier : 'أخرى (تحديد شركة شحن مخصصة)'}
                  onChange={e => {
                    if (e.target.value === 'أخرى (تحديد شركة شحن مخصصة)') {
                      // Keep custom courier input ready
                    } else {
                      handleSaveCourier(e.target.value);
                    }
                  }}
                  className="bg-white border border-amber-400 text-slate-900 rounded-lg px-2.5 py-1 text-xs font-bold outline-none cursor-pointer"
                >
                  {courierOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="أو اكتب اسم شركة الشحن / المندوب"
                  value={customCourier}
                  onChange={e => setCustomCourier(e.target.value)}
                  className="bg-white border border-slate-300 px-2 py-1 rounded text-xs w-48 text-gray-800"
                />
                {customCourier.trim() && (
                  <button
                    onClick={() => handleSaveCourier(customCourier.trim())}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-xs font-bold"
                  >
                    حفظ
                  </button>
                )}
                <button
                  onClick={() => setIsEditingCourier(false)}
                  className="text-gray-500 hover:text-gray-700 text-xs px-2 py-1"
                >
                  إلغاء
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Printable Waybill Document */}
        <div ref={waybillRef} className="p-6 space-y-5 print:p-6 print:space-y-4" id="printable-waybill">
          {/* Header & Logo */}
          <div className="flex items-start justify-between border-b-2 border-gray-900 pb-4">
            <div>
              <div className="flex items-center gap-2">
                {settings.storeLogoUrl ? (
                  <img src={settings.storeLogoUrl} alt={settings.storeName} className="w-12 h-12 object-contain rounded-lg border p-1" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg">
                    {settings.storeLogoText || 'نيل'}
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-black text-gray-900">{settings.storeName}</h2>
                  <p className="text-[11px] text-gray-500">إدارة اللوجستيات والشحن والتوزيع السريع</p>
                </div>
              </div>
              <div className="text-[11px] text-gray-600 mt-2 space-y-0.5">
                <p>خدمة العملاء: <strong>{settings.supportPhone}</strong></p>
                <p>جهة الشحن الناقلة: <strong className="text-amber-800 bg-amber-100/60 px-1.5 py-0.5 rounded">{courier}</strong></p>
              </div>
            </div>

            {/* Barcode & Numbers */}
            <div className="text-left flex flex-col items-end">
              <span className="bg-amber-100 text-amber-900 text-xs px-2.5 py-1 rounded font-black border border-amber-300">
                بوليصة شحن بضائع رسمية معتمدة
              </span>
              <div className="mt-2 text-right">
                <span className="text-[10px] text-gray-500 block">رقم البوليصة (Waybill No):</span>
                <span className="font-mono text-base font-black text-gray-900 tracking-wider">{waybillNo}</span>
              </div>
              <div className="mt-1">
                <span className="text-[10px] text-gray-500 block">رقم طلب الشراء:</span>
                <span className="font-mono text-xs font-bold text-gray-700">#{order.id}</span>
              </div>
            </div>
          </div>

          {/* Barcode representation */}
          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Barcode className="w-7 h-7 text-gray-800" />
              <div className="font-mono">
                <span className="text-xs font-black tracking-widest block">{waybillNo}</span>
                <span className="text-[9px] text-gray-500">ELECTRONIC SHIPPING BARCODE</span>
              </div>
            </div>
            <div className="text-xs text-gray-600 flex items-center gap-1 font-sans">
              <Calendar className="w-3.5 h-3.5" />
              <span>تاريخ الإرسال: {order.createdAt || new Date().toISOString().split('T')[0]}</span>
            </div>
          </div>

          {/* Customer & Delivery Destination Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 border border-gray-300 rounded-xl p-4 text-xs">
            <div className="space-y-1.5">
              <div className="font-black text-gray-800 flex items-center gap-1.5 border-b pb-1">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>بيانات المرسل إليه (العميل):</span>
              </div>
              <p><strong>الاسم:</strong> {order.customerName}</p>
              <p className="font-mono"><strong>الهاتف الأساسي:</strong> {order.customerPhone}</p>
              {order.customerPhone2 && (
                <p className="font-mono"><strong>هاتف بديل:</strong> {order.customerPhone2}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="font-black text-gray-800 flex items-center gap-1.5 border-b pb-1">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>عنوان التوصيل والعلامة المميزة:</span>
              </div>
              <p><strong>المحافظة:</strong> {order.governorate}</p>
              <p><strong>العنوان التفصيلي:</strong> {order.shippingAddress}</p>
              {order.landmark && (
                <p className="text-amber-800 font-bold"><strong>علامة مميزة:</strong> {order.landmark}</p>
              )}
            </div>
          </div>

          {/* Shipment Items Table */}
          <div>
            <div className="font-black text-xs text-gray-800 mb-2 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-gray-600" />
              <span>محتويات الشحنة والطرود:</span>
            </div>
            <table className="w-full text-right text-xs border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 border-b border-gray-300 text-gray-700 font-bold">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">اسم الصنف والمواصفات</th>
                  <th className="p-2 text-center">الكمية</th>
                  <th className="p-2 text-left">السعر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(order.items || []).map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2 font-mono text-gray-500">{idx + 1}</td>
                    <td className="p-2 font-bold text-gray-900">{item.product.name}</td>
                    <td className="p-2 text-center font-mono font-bold">{item.quantity}</td>
                    <td className="p-2 text-left font-mono">{(item.product.price * item.quantity).toLocaleString()} ج.م</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cash On Delivery & Total */}
          <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-gray-400 block">طريقة التحصيل والدفع:</span>
              <span className="font-bold text-sm text-amber-400">
                {order.paymentMethod === 'cash_on_delivery' ? 'الدفع نقداً عند الاستلام (COD)' : order.paymentMethod}
              </span>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                رسوم الشحن المحسوبة: {order.shippingFee} ج.م
              </span>
            </div>
            <div className="text-left">
              <span className="text-[11px] text-gray-300 block">المبلغ المطلوب تحصيله من العميل:</span>
              <span className="text-xl font-black text-amber-400 font-mono">
                {order.total.toLocaleString()} ج.م
              </span>
            </div>
          </div>

          {/* Signatures & Instructions */}
          <div className="grid grid-cols-3 gap-2 border-t pt-3 text-[10px] text-gray-600 text-center">
            <div className="border border-dashed border-gray-300 p-2 rounded-lg">
              <p className="font-bold mb-4">توقيع مسؤول المستودع والتجهيز</p>
              <p className="text-gray-400">.............................</p>
            </div>
            <div className="border border-dashed border-gray-300 p-2 rounded-lg">
              <p className="font-bold mb-4">توقيع مندوب شركة الشحن المستلم</p>
              <p className="text-gray-400">.............................</p>
            </div>
            <div className="border border-dashed border-gray-300 p-2 rounded-lg">
              <p className="font-bold mb-4">توقيع المستلم (العميل) بالاستلام سليم</p>
              <p className="text-gray-400">.............................</p>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="text-[9px] text-gray-500 text-center border-t pt-2 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>بوليصة شحن قانونية صادرة آلياً من نظام إدارة {settings.storeName} - يرجى عدم استلام أي طرد مفتوح أو تالف.</span>
          </div>
        </div>

        {/* Bottom Actions Bar (Hidden in Print) */}
        <div className="bg-gray-100 p-3 px-5 flex items-center justify-between border-t border-gray-300 print:hidden">
          <span className="text-xs text-gray-600">
            حالة الطلب الحالية: <strong>{order.status === 'delivered' ? 'تم التسليم' : order.status === 'shipped' ? 'مع المندوب' : 'قيد التجهيز'}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة البوليصة</span>
            </button>
            <button
              onClick={onClose}
              className="bg-slate-700 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>إغلاق البوليصة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
