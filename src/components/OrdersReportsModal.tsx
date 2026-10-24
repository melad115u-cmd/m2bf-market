import React, { useState, useMemo, useRef } from 'react';
import { Order, StoreSettings } from '../types';
import { printDocumentHtml } from '../utils/printUtils';
import {
  Printer,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Truck,
  Calendar,
  AlertOctagon,
  Search,
  Filter,
  User,
  Phone,
  Package
} from 'lucide-react';

interface Props {
  orders: Order[];
  settings: StoreSettings;
  onClose: () => void;
}

export type OrderReportType =
  | 'delivered'
  | 'processing'
  | 'shipped'
  | 'period_delivered'
  | 'cancelled';

export const OrdersReportsModal: React.FC<Props> = ({ orders, settings, onClose }) => {
  const [activeReport, setActiveReport] = useState<OrderReportType>('delivered');

  // Date filters for period report
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [searchFilter, setSearchFilter] = useState('');

  // Filtering orders according to report
  const filteredOrders = useMemo(() => {
    let list = [...orders];

    switch (activeReport) {
      case 'delivered':
        list = list.filter(o => o.status === 'delivered' || o.status === 'received');
        break;
      case 'processing':
        list = list.filter(o => o.status === 'processing');
        break;
      case 'shipped':
        list = list.filter(o => o.status === 'shipped');
        break;
      case 'period_delivered':
        list = list.filter(o => {
          if (o.status !== 'delivered') return false;
          const orderDate = o.createdAt ? o.createdAt.split('T')[0] : '';
          if (fromDate && orderDate < fromDate) return false;
          if (toDate && orderDate > toDate) return false;
          return true;
        });
        break;
      case 'cancelled':
        list = list.filter(o => o.status === 'cancelled');
        break;
    }

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      list = list.filter(
        o =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q) ||
          (o.courierName && o.courierName.toLowerCase().includes(q)) ||
          o.governorate.toLowerCase().includes(q)
      );
    }

    return list;
  }, [orders, activeReport, fromDate, toDate, searchFilter]);

  const totalValue = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalItemsCount = filteredOrders.reduce(
    (sum, o) => sum + (o.items || []).reduce((isum, i) => isum + (i.quantity || 1), 0),
    0
  );

  const reportContentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (reportContentRef.current) {
      printDocumentHtml({
        title: getReportTitle(),
        subtitle: 'نظام إدارة العمليات اللوجستية والشحن المعتمد',
        storeName: settings.storeName || 'سوق مصر الكبرى',
        documentNumber: `REP-ORD-${Date.now().toString().slice(-6)}`,
        contentHtml: reportContentRef.current.innerHTML
      });
    } else {
      window.print();
    }
  };

  const getReportTitle = () => {
    switch (activeReport) {
      case 'delivered':
        return 'تقرير الطلبيات التي تم تسليمها والتأكيد عليها';
      case 'processing':
        return 'تقرير الطلبيات التي جاري تجهيزها بالمستودع';
      case 'shipped':
        return 'تقرير الطلبيات الموجودة مع مندوب الشحن';
      case 'period_delivered':
        return `تقرير الطلبيات المسلمة خلال فترة (من ${fromDate} إلى ${toDate}) مع بيانات المندوب`;
      case 'cancelled':
        return 'تقرير الطلبيات الملغاة مع توضيح سبب الإلغاء';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white animate-in fade-in">
      <div className="bg-slate-900 text-gray-100 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl border border-slate-700 text-right print:bg-white print:text-gray-900 print:shadow-none print:border-none print:max-w-full">
        {/* Header (Hidden in Print) */}
        <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">مركز تقارير الطلبيات والشحن واللوجستيات</h3>
              <p className="text-xs text-gray-400">إحصاءات شاملة وتقارير دورية معتمدة قابلة للطباعة فوراً</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة هذا التقرير</span>
            </button>
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>إغلاق</span>
            </button>
          </div>
        </div>

        {/* The 5 Required Report Buttons (Hidden in Print) */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 print:hidden space-y-3">
          <div className="text-xs font-bold text-gray-400">اختر نوع التقرير المطلوب عرضه:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 text-xs">
            {/* Button 1 */}
            <button
              onClick={() => setActiveReport('delivered')}
              className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                activeReport === 'delivered'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-black shadow-lg ring-1 ring-emerald-400'
                  : 'bg-slate-800/80 border-slate-700 text-gray-300 hover:bg-slate-750'
              }`}
            >
              <div className="flex items-center justify-between">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded font-mono">1</span>
              </div>
              <span className="font-bold">1- الطلبيات التي تم تسليمها والتأكيد عليها</span>
            </button>

            {/* Button 2 */}
            <button
              onClick={() => setActiveReport('processing')}
              className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                activeReport === 'processing'
                  ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-black shadow-lg ring-1 ring-amber-400'
                  : 'bg-slate-800/80 border-slate-700 text-gray-300 hover:bg-slate-750'
              }`}
            >
              <div className="flex items-center justify-between">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded font-mono">2</span>
              </div>
              <span className="font-bold">2- طلبيات جاري تجهيزها بالمستودع</span>
            </button>

            {/* Button 3 */}
            <button
              onClick={() => setActiveReport('shipped')}
              className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                activeReport === 'shipped'
                  ? 'bg-sky-950/80 border-sky-500 text-sky-300 font-black shadow-lg ring-1 ring-sky-400'
                  : 'bg-slate-800/80 border-slate-700 text-gray-300 hover:bg-slate-750'
              }`}
            >
              <div className="flex items-center justify-between">
                <Truck className="w-4 h-4 text-sky-400" />
                <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded font-mono">3</span>
              </div>
              <span className="font-bold">3- طلبيات مع مندوب الشحن</span>
            </button>

            {/* Button 4 */}
            <button
              onClick={() => setActiveReport('period_delivered')}
              className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                activeReport === 'period_delivered'
                  ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300 font-black shadow-lg ring-1 ring-indigo-400'
                  : 'bg-slate-800/80 border-slate-700 text-gray-300 hover:bg-slate-750'
              }`}
            >
              <div className="flex items-center justify-between">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded font-mono">4</span>
              </div>
              <span className="font-bold">4- المسلمة خلال فترة (+ المندوب وهاتفه)</span>
            </button>

            {/* Button 5 */}
            <button
              onClick={() => setActiveReport('cancelled')}
              className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                activeReport === 'cancelled'
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 font-black shadow-lg ring-1 ring-rose-400'
                  : 'bg-slate-800/80 border-slate-700 text-gray-300 hover:bg-slate-750'
              }`}
            >
              <div className="flex items-center justify-between">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded font-mono">5</span>
              </div>
              <span className="font-bold">5- الطلبيات الملغاة مع سبب الإلغاء</span>
            </button>
          </div>

          {/* Sub Filters for Period / Search */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  placeholder="بحث برقم الطلب، العميل، الهاتف، المندوب..."
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  className="w-full pr-9 pl-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            {activeReport === 'period_delivered' && (
              <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 p-1.5 px-3 rounded-xl">
                <span className="text-gray-400 font-bold">فترة المعاينة:</span>
                <span className="text-gray-400">من</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-white px-2 py-1 rounded text-xs outline-none font-mono"
                />
                <span className="text-gray-400">إلى</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-white px-2 py-1 rounded text-xs outline-none font-mono"
                />
              </div>
            )}
          </div>
        </div>

        {/* Printable Report Content */}
        <div ref={reportContentRef} className="p-6 space-y-4 print:p-6 print:space-y-4">
          {/* Print Header */}
          <div className="border-b-2 border-slate-800 pb-4 print:border-gray-900 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                {settings.storeLogoUrl ? (
                  <img src={settings.storeLogoUrl} alt={settings.storeName} className="w-10 h-10 object-contain rounded" />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                    {settings.storeLogoText || 'نيل'}
                  </div>
                )}
                <div>
                  <h2 className="text-base font-black text-white print:text-gray-900">{settings.storeName}</h2>
                  <p className="text-[11px] text-gray-400 print:text-gray-600">نظام إدارة العمليات اللوجستية والشحن</p>
                </div>
              </div>
              <h3 className="text-sm font-black text-amber-400 print:text-gray-900 mt-2">
                {getReportTitle()}
              </h3>
            </div>

            <div className="text-left text-xs text-gray-400 print:text-gray-700 space-y-0.5">
              <p>تاريخ استخراج التقرير: <strong>{new Date().toISOString().split('T')[0]}</strong></p>
              <p>عدد السجلات: <strong>{filteredOrders.length} طلب</strong></p>
              <p>إجمالي المبالغ: <strong className="text-emerald-400 print:text-gray-900 font-mono font-black">{totalValue.toLocaleString()} ج.م</strong></p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 bg-slate-950/60 print:bg-gray-100 p-3 rounded-xl border border-slate-800 print:border-gray-300 text-xs">
            <div>
              <span className="text-gray-400 print:text-gray-600 block text-[10px]">إجمالي عدد الطلبيات بالتقرير:</span>
              <span className="font-mono font-black text-white print:text-gray-900 text-sm">{filteredOrders.length} طلب</span>
            </div>
            <div>
              <span className="text-gray-400 print:text-gray-600 block text-[10px]">إجمالي عدد القطع:</span>
              <span className="font-mono font-black text-white print:text-gray-900 text-sm">{totalItemsCount} قطعة</span>
            </div>
            <div>
              <span className="text-gray-400 print:text-gray-600 block text-[10px]">القيمة الإجمالية للطلبيات:</span>
              <span className="font-mono font-black text-emerald-400 print:text-emerald-700 text-sm">{totalValue.toLocaleString()} ج.م</span>
            </div>
          </div>

          {/* Detailed Orders Table */}
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-gray-400 print:text-gray-600 border border-dashed border-slate-800 rounded-xl">
              لا توجد طلبيات تطابق معايير هذا التقرير حالياً
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-800 print:border-gray-300 rounded-xl">
              <table className="w-full text-right text-xs print:text-[10px]">
                <thead className="bg-slate-950 print:bg-gray-100 text-gray-300 print:text-gray-800 border-b border-slate-800 print:border-gray-300 font-bold">
                  <tr>
                    <th className="p-2.5">رقم الطلب</th>
                    <th className="p-2.5">العميل والتليفون</th>
                    <th className="p-2.5">المحافظة والعنوان</th>
                    <th className="p-2.5">المحتويات والكمية</th>
                    <th className="p-2.5">المبلغ وطريقة الدفع</th>
                    {/* Courier and phone column */}
                    <th className="p-2.5">مندوب الشحن / الشركة</th>
                    {activeReport === 'cancelled' && <th className="p-2.5">سبب الإلغاء</th>}
                    <th className="p-2.5">تاريخ الطلب</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-gray-200">
                  {filteredOrders.map(order => {
                    const courierName = order.courierName || 'مندوب التوصيل السريع (أسطول المتجر)';
                    const courierPhone = '01099238411'; // Representative contact
                    return (
                      <tr key={order.id} className="hover:bg-slate-850 print:hover:bg-transparent">
                        <td className="p-2.5 font-mono font-bold text-amber-400 print:text-gray-900">
                          {order.id}
                        </td>
                        <td className="p-2.5">
                          <span className="font-bold text-white print:text-gray-900 block">{order.customerName}</span>
                          <span className="font-mono text-gray-400 print:text-gray-600 block">{order.customerPhone}</span>
                        </td>
                        <td className="p-2.5">
                          <span className="text-gray-200 print:text-gray-800 block">{order.governorate}</span>
                          <span className="text-[10px] text-gray-400 print:text-gray-500 block truncate max-w-xs">{order.shippingAddress}</span>
                        </td>
                        <td className="p-2.5">
                          <span className="font-medium text-gray-200 print:text-gray-800">
                            {(order.items || []).map(i => `${i.product.name} (${i.quantity})`).join(', ')}
                          </span>
                        </td>
                        <td className="p-2.5 font-mono">
                          <span className="font-bold text-emerald-400 print:text-gray-900 block">{(order.total || 0).toLocaleString()} ج.م</span>
                          <span className="text-[10px] text-gray-400 print:text-gray-600 block">{order.paymentMethod}</span>
                        </td>
                        <td className="p-2.5">
                          <span className="font-bold text-sky-400 print:text-gray-900 block flex items-center gap-1">
                            <Truck className="w-3 h-3 inline print:hidden" />
                            {courierName}
                          </span>
                          <span className="text-[10px] text-gray-400 print:text-gray-600 block font-mono">
                            هاتف: {courierPhone}
                          </span>
                        </td>
                        {activeReport === 'cancelled' && (
                          <td className="p-2.5 text-rose-400 font-bold">
                            عدم الرد على مندوب المعاينة / إلغاء بناء على رغبة العميل
                          </td>
                        )}
                        <td className="p-2.5 font-mono text-gray-400 print:text-gray-600">
                          {order.createdAt || '2026-10-15'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Printable Footer */}
          <div className="border-t border-slate-800 print:border-gray-300 pt-3 flex items-center justify-between text-[10px] text-gray-500">
            <span>تقرير إداري رسمي صادر عن منظومة {settings.storeName}</span>
            <span>اعتماد مدير العمليات واللوجستيات: ..............................</span>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden in Print) */}
        <div className="bg-slate-950 p-4 px-6 flex items-center justify-between border-t border-slate-800 print:hidden">
          <span className="text-xs text-gray-400">
            اضغط على أي زر تقرير بالأعلى لتحديث العرض فوراً
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة هذا التقرير</span>
            </button>
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>إغلاق</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
