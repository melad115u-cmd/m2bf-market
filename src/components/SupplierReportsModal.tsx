import React, { useState, useMemo, useRef } from 'react';
import { Supplier, SupplierInvoice, StoreSettings } from '../types';
import { printDocumentHtml } from '../utils/printUtils';
import {
  Printer,
  X,
  FileSpreadsheet,
  Truck,
  RotateCcw,
  Calendar,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Building2,
  DollarSign
} from 'lucide-react';

interface Props {
  suppliers: Supplier[];
  supplierInvoices: SupplierInvoice[];
  settings: StoreSettings;
  onClose: () => void;
}

export type SupplierReportType =
  | 'supplier_period'       // 1. تقرير عن فواتير مورد خلال فترة
  | 'single_invoice'        // 2. تقرير عن فاتورة مورد
  | 'single_return'         // 3. تقرير عن مرتد فاتورة مورد
  | 'returns_period'        // 4. تقرير عن فواتير مرتد لمورد خلال فترة
  | 'comprehensive_period'; // 5. تقرير شامل عن فواتير الموردين خلال فترة معينة

export const SupplierReportsModal: React.FC<Props> = ({
  suppliers,
  supplierInvoices,
  settings,
  onClose
}) => {
  const [activeReport, setActiveReport] = useState<SupplierReportType>('supplier_period');

  // Filter States
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(suppliers[0]?.id || 'all');
  const [selectedInvoiceNumber, setSelectedInvoiceNumber] = useState<string>('');
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered invoices according to active report
  const filteredInvoices = useMemo(() => {
    let list = [...supplierInvoices];

    switch (activeReport) {
      case 'supplier_period':
        // 1. فواتير شراء لمورد خلال فترة
        list = list.filter(inv => {
          if (inv.type === 'return') return false;
          if (selectedSupplierId !== 'all' && inv.supplierId !== selectedSupplierId) return false;
          if (fromDate && inv.date < fromDate) return false;
          if (toDate && inv.date > toDate) return false;
          return true;
        });
        break;

      case 'single_invoice':
        // 2. تقرير عن فاتورة مورد مفردة
        list = list.filter(inv => {
          if (inv.type === 'return') return false;
          if (selectedSupplierId !== 'all' && inv.supplierId !== selectedSupplierId) return false;
          if (selectedInvoiceNumber && !inv.invoiceNumber.toLowerCase().includes(selectedInvoiceNumber.toLowerCase())) return false;
          return true;
        });
        break;

      case 'single_return':
        // 3. تقرير عن مرتد فاتورة مورد مفردة
        list = list.filter(inv => {
          if (inv.type !== 'return') return false;
          if (selectedSupplierId !== 'all' && inv.supplierId !== selectedSupplierId) return false;
          if (selectedInvoiceNumber && !inv.invoiceNumber.toLowerCase().includes(selectedInvoiceNumber.toLowerCase())) return false;
          return true;
        });
        break;

      case 'returns_period':
        // 4. تقرير عن فواتير مرتد لمورد خلال فترة
        list = list.filter(inv => {
          if (inv.type !== 'return') return false;
          if (selectedSupplierId !== 'all' && inv.supplierId !== selectedSupplierId) return false;
          if (fromDate && inv.date < fromDate) return false;
          if (toDate && inv.date > toDate) return false;
          return true;
        });
        break;

      case 'comprehensive_period':
        // 5. تقرير شامل عن فواتير الموردين (شراء ومرتجع) خلال فترة معينة
        list = list.filter(inv => {
          if (selectedSupplierId !== 'all' && inv.supplierId !== selectedSupplierId) return false;
          if (fromDate && inv.date < fromDate) return false;
          if (toDate && inv.date > toDate) return false;
          return true;
        });
        break;
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        inv =>
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.supplierName.toLowerCase().includes(q) ||
          (inv.incomingDocNumber && inv.incomingDocNumber.toLowerCase().includes(q)) ||
          (inv.employeeName && inv.employeeName.toLowerCase().includes(q))
      );
    }

    return list;
  }, [supplierInvoices, activeReport, selectedSupplierId, selectedInvoiceNumber, fromDate, toDate, searchTerm]);

  // Statistics
  const totalPurchasesAmount = filteredInvoices
    .filter(i => i.type !== 'return')
    .reduce((sum, i) => sum + (i.netTotal || i.totalAmount || 0), 0);

  const totalReturnsAmount = filteredInvoices
    .filter(i => i.type === 'return')
    .reduce((sum, i) => sum + (i.netTotal || i.totalAmount || 0), 0);

  const netPeriodMovement = totalPurchasesAmount - totalReturnsAmount;

  const reportContentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (reportContentRef.current) {
      printDocumentHtml({
        title: getReportHeading(),
        subtitle: 'مركز تقارير الموردين والمشتريات والمرتجعات المعتمدة',
        storeName: settings.storeName || 'سوق مصر الكبرى',
        documentNumber: `REP-SUP-${Date.now().toString().slice(-6)}`,
        contentHtml: reportContentRef.current.innerHTML
      });
    } else {
      window.print();
    }
  };

  const getReportHeading = () => {
    const supName = selectedSupplierId === 'all'
      ? 'كافة الموردين'
      : suppliers.find(s => s.id === selectedSupplierId)?.name || 'المورد المحدد';

    switch (activeReport) {
      case 'supplier_period':
        return `تقرير فواتير الشراء لـ (${supName}) خلال الفترة من ${fromDate} إلى ${toDate}`;
      case 'single_invoice':
        return `تقرير تفصيلي عن فاتورة مشتريات مورد (${supName})`;
      case 'single_return':
        return `تقرير تفصيلي عن مرتد فاتورة مورد (${supName})`;
      case 'returns_period':
        return `تقرير فواتير المرتجع لـ (${supName}) خلال الفترة من ${fromDate} إلى ${toDate}`;
      case 'comprehensive_period':
        return `تقرير محاسبي شامل عن فواتير الموردين (مشتريات ومرتجع) خلال الفترة من ${fromDate} إلى ${toDate}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white animate-in fade-in">
      <div className="bg-slate-900 text-gray-100 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl border border-slate-700 text-right print:bg-white print:text-gray-900 print:shadow-none print:border-none print:max-w-full my-auto">
        {/* Header (Hidden in Print) */}
        <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">مركز تقارير الموردين والمشتريات والمرتجعات</h3>
              <p className="text-xs text-gray-400">تقارير محاسبية تفصيلية وإجمالية لكافة حركات التوريد والمرتجع</p>
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
          <div className="text-xs font-bold text-gray-400">اختر نوع تقرير الموردين والمشتريات المطلوب:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 text-xs">
            {/* Button 1 */}
            <button
              onClick={() => setActiveReport('supplier_period')}
              className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                activeReport === 'supplier_period'
                  ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-black shadow-lg ring-1 ring-amber-400'
                  : 'bg-slate-800/80 border-slate-700 text-gray-300 hover:bg-slate-750'
              }`}
            >
              <div className="flex items-center justify-between">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded font-mono">1</span>
              </div>
              <span className="font-bold">1- فواتير مورد خلال فترة</span>
            </button>

            {/* Button 2 */}
            <button
              onClick={() => setActiveReport('single_invoice')}
              className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                activeReport === 'single_invoice'
                  ? 'bg-sky-950/80 border-sky-500 text-sky-300 font-black shadow-lg ring-1 ring-sky-400'
                  : 'bg-slate-800/80 border-slate-700 text-gray-300 hover:bg-slate-750'
              }`}
            >
              <div className="flex items-center justify-between">
                <FileSpreadsheet className="w-4 h-4 text-sky-400" />
                <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded font-mono">2</span>
              </div>
              <span className="font-bold">2- تقرير عن فاتورة مورد</span>
            </button>

            {/* Button 3 */}
            <button
              onClick={() => setActiveReport('single_return')}
              className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                activeReport === 'single_return'
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 font-black shadow-lg ring-1 ring-rose-400'
                  : 'bg-slate-800/80 border-slate-700 text-gray-300 hover:bg-slate-750'
              }`}
            >
              <div className="flex items-center justify-between">
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded font-mono">3</span>
              </div>
              <span className="font-bold">3- تقرير عن مرتد فاتورة مورد</span>
            </button>

            {/* Button 4 */}
            <button
              onClick={() => setActiveReport('returns_period')}
              className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                activeReport === 'returns_period'
                  ? 'bg-purple-950/80 border-purple-500 text-purple-300 font-black shadow-lg ring-1 ring-purple-400'
                  : 'bg-slate-800/80 border-slate-700 text-gray-300 hover:bg-slate-750'
              }`}
            >
              <div className="flex items-center justify-between">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded font-mono">4</span>
              </div>
              <span className="font-bold">4- فواتير مرتد لمورد خلال فترة</span>
            </button>

            {/* Button 5 */}
            <button
              onClick={() => setActiveReport('comprehensive_period')}
              className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                activeReport === 'comprehensive_period'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-black shadow-lg ring-1 ring-emerald-400'
                  : 'bg-slate-800/80 border-slate-700 text-gray-300 hover:bg-slate-750'
              }`}
            >
              <div className="flex items-center justify-between">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded font-mono">5</span>
              </div>
              <span className="font-bold">5- تقرير شامل (شراء ومرتجع)</span>
            </button>
          </div>

          {/* Sub Filters: Supplier dropdown, date range, search */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 text-xs">
            <div>
              <label className="block text-gray-400 font-bold mb-1">تحديد المورد:</label>
              <select
                value={selectedSupplierId}
                onChange={e => setSelectedSupplierId(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
              >
                <option value="all">كافة الموردين (عرض إجمالي)</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.companyName})</option>
                ))}
              </select>
            </div>

            {(activeReport === 'supplier_period' || activeReport === 'returns_period' || activeReport === 'comprehensive_period') ? (
              <>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">من تاريخ:</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={e => setFromDate(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">إلى تاريخ:</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={e => setToDate(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </>
            ) : (
              <div className="md:col-span-2">
                <label className="block text-gray-400 font-bold mb-1">رقم الفاتورة المحددة:</label>
                <input
                  type="text"
                  placeholder="ابحث برقم الفاتورة PINV أو RINV..."
                  value={selectedInvoiceNumber}
                  onChange={e => setSelectedInvoiceNumber(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-400 font-bold mb-1">بحث عام:</label>
              <input
                type="text"
                placeholder="رقم بيان الوارد، الموظف..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
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
                  <p className="text-[11px] text-gray-400 print:text-gray-600">إدارة الحسابات العامة وقسم المشتريات والموردين</p>
                </div>
              </div>
              <h3 className="text-sm font-black text-amber-400 print:text-gray-900 mt-2">
                {getReportHeading()}
              </h3>
            </div>

            <div className="text-left text-xs text-gray-400 print:text-gray-700 space-y-0.5">
              <p>تاريخ استخراج التقرير: <strong>{new Date().toISOString().split('T')[0]}</strong></p>
              <p>عدد الفواتير: <strong>{filteredInvoices.length} فاتورة</strong></p>
              <p>صافي حركة التوريد: <strong className="text-emerald-400 print:text-gray-900 font-mono font-black">{netPeriodMovement.toLocaleString()} ج.م</strong></p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/60 print:bg-gray-100 p-3 rounded-xl border border-slate-800 print:border-gray-300 text-xs">
            <div>
              <span className="text-gray-400 print:text-gray-600 block text-[10px]">إجمالي فواتير الشراء:</span>
              <span className="font-mono font-black text-white print:text-gray-900 text-sm">
                {totalPurchasesAmount.toLocaleString()} ج.م
              </span>
            </div>
            <div>
              <span className="text-gray-400 print:text-gray-600 block text-[10px]">إجمالي فواتير المرتجع (مخصومة):</span>
              <span className="font-mono font-black text-rose-400 print:text-rose-700 text-sm">
                {totalReturnsAmount.toLocaleString()} ج.م
              </span>
            </div>
            <div>
              <span className="text-gray-400 print:text-gray-600 block text-[10px]">صافي مستحقات حركة الفترة:</span>
              <span className="font-mono font-black text-emerald-400 print:text-emerald-700 text-sm">
                {netPeriodMovement.toLocaleString()} ج.م
              </span>
            </div>
          </div>

          {/* Invoices List Table */}
          {filteredInvoices.length === 0 ? (
            <div className="py-12 text-center text-gray-400 print:text-gray-600 border border-dashed border-slate-800 rounded-xl">
              لا توجد فواتير أو مرتجعات تطابق معايير هذا التقرير حالياً
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-800 print:border-gray-300 rounded-xl">
              <table className="w-full text-right text-xs print:text-[10px]">
                <thead className="bg-slate-950 print:bg-gray-100 text-gray-300 print:text-gray-800 border-b border-slate-800 print:border-gray-300 font-bold">
                  <tr>
                    <th className="p-2.5">رقم الفاتورة</th>
                    <th className="p-2.5">النوع</th>
                    <th className="p-2.5">المورد</th>
                    <th className="p-2.5">رقم بيان الوارد (يدوي)</th>
                    <th className="p-2.5">الموظف المدخل</th>
                    <th className="p-2.5">التاريخ</th>
                    <th className="p-2.5">عدد البنود</th>
                    <th className="p-2.5">الإجمالي قبل الضريبة</th>
                    <th className="p-2.5">صافي الفاتورة</th>
                    <th className="p-2.5">المسدد والمتبقي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-gray-200">
                  {filteredInvoices.map(inv => {
                    const isRet = inv.type === 'return';
                    return (
                      <tr key={inv.id} className="hover:bg-slate-850 print:hover:bg-transparent">
                        <td className="p-2.5 font-mono font-bold text-amber-400 print:text-gray-900">
                          {inv.invoiceNumber}
                        </td>
                        <td className="p-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isRet
                                ? 'bg-rose-950 text-rose-300 border border-rose-800 print:text-rose-700'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800 print:text-emerald-700'
                            }`}
                          >
                            {isRet ? 'مرتجع مشتريات' : 'فاتورة شراء'}
                          </span>
                        </td>
                        <td className="p-2.5 font-bold text-white print:text-gray-900">
                          {inv.supplierName}
                        </td>
                        <td className="p-2.5 font-mono text-gray-300 print:text-gray-700">
                          {inv.incomingDocNumber || 'إذن يدوي'}
                        </td>
                        <td className="p-2.5 text-gray-300 print:text-gray-700">
                          {inv.employeeName || 'مسؤول المشتريات'}
                        </td>
                        <td className="p-2.5 font-mono text-gray-400 print:text-gray-600">
                          {inv.date}
                        </td>
                        <td className="p-2.5 font-mono text-center">
                          {(inv.items || []).length} بنود
                        </td>
                        <td className="p-2.5 font-mono text-gray-300 print:text-gray-700">
                          {(inv.subtotal || inv.totalAmount || 0).toLocaleString()} ج.م
                        </td>
                        <td className="p-2.5 font-mono font-black text-amber-400 print:text-gray-900">
                          {(inv.netTotal || inv.totalAmount || 0).toLocaleString()} ج.م
                        </td>
                        <td className="p-2.5 font-mono">
                          <span className="text-emerald-400 print:text-gray-800 block">مدفوع: {(inv.paidAmount || 0).toLocaleString()}</span>
                          <span className="text-rose-400 print:text-gray-600 block text-[10px]">متبقي: {(inv.remainingAmount || 0).toLocaleString()}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Printable Signatures */}
          <div className="border-t border-slate-800 print:border-gray-300 pt-3 flex items-center justify-between text-[10px] text-gray-500">
            <span>تقرير مشتريات وموردين رسمي صادر عن منظومة {settings.storeName} المحاسبية</span>
            <span>اعتماد قسم المراجعة والحسابات: ..............................</span>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden in Print) */}
        <div className="bg-slate-950 p-4 px-6 flex items-center justify-between border-t border-slate-800 print:hidden">
          <span className="text-xs text-gray-400">
            اختر أي زر تقرير بالأعلى لتحديث الفلترة وطباعة الكشف فوراً
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
