import React, { useState, useEffect } from 'react';
import { Supplier, Product, Warehouse, SupplierInvoiceItem, SupplierInvoice, EmployeeUser } from '../types';
import {
  FileText,
  X,
  Plus,
  Trash2,
  Save,
  Building2,
  UserCheck,
  ShieldCheck,
  Warehouse as WarehouseIcon,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Props {
  type: 'purchase' | 'return'; // فاتورة مشتريات أو مرتجع
  suppliers: Supplier[];
  products: Product[];
  warehouses: Warehouse[];
  employees: EmployeeUser[];
  onSave: (invoice: Omit<SupplierInvoice, 'id'>) => void;
  onClose: () => void;
}

export const SupplierInvoiceModal: React.FC<Props> = ({
  type,
  suppliers,
  products,
  warehouses,
  employees,
  onSave,
  onClose
}) => {
  const isReturn = type === 'return';

  // Invoice Header
  const [invoiceNumber] = useState(() => {
    const prefix = isReturn ? 'RINV' : 'PINV';
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${new Date().getFullYear()}-${rand}`;
  });

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [incomingDocNumber, setIncomingDocNumber] = useState(''); // رقم بيان الوارد / إذن التسليم يدوي

  // Employee PIN Auth
  const [employeePin, setEmployeePin] = useState('');
  const [matchedEmployee, setMatchedEmployee] = useState<EmployeeUser | null>(null);

  // Check PIN
  useEffect(() => {
    if (!employeePin.trim()) {
      setMatchedEmployee(null);
      return;
    }
    const found = employees.find(
      emp => emp.passwordHash === employeePin.trim() || emp.username === employeePin.trim()
    );
    if (found) {
      setMatchedEmployee(found);
    } else if (employeePin.trim() === '11183@96' || employeePin.trim() === '01205520031') {
      // Owner fallback PIN
      setMatchedEmployee({
        id: 'owner',
        name: 'المالك / المدير العام (الإدارة العليا)',
        username: 'owner',
        passwordHash: '***',
        jobRole: 'المدير العام',
        permissions: ['settings'],
        isActive: true,
        createdAt: '2026-01-01'
      });
    } else {
      setMatchedEmployee(null);
    }
  }, [employeePin, employees]);

  // Invoice Items
  const [items, setItems] = useState<SupplierInvoiceItem[]>([
    {
      serialNumber: 1,
      productId: products[0]?.id || '',
      productName: products[0]?.name || '',
      warehouseId: warehouses[0]?.id || 'wh-main',
      warehouseName: warehouses[0]?.name || 'المخزن الرئيسي',
      quantity: 1,
      unitPrice: products[0]?.costPrice || 100,
      discountPercent: 0,
      priceAfterDiscount: products[0]?.costPrice || 100,
      lineTotal: products[0]?.costPrice || 100
    }
  ]);

  // Tax & Allowed Discount
  const [vatRate, setVatRate] = useState<number>(14); // 14% VAT default in Egypt
  const [discountAllowed, setDiscountAllowed] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Handle item change
  const handleItemChange = (index: number, field: keyof SupplierInvoiceItem, value: any) => {
    setItems(prev => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };

      if (field === 'productId') {
        const prod = products.find(p => p.id === value);
        if (prod) {
          item.productName = prod.name;
          item.unitPrice = prod.costPrice || prod.price * 0.7;
        }
      }

      if (field === 'warehouseId') {
        const wh = warehouses.find(w => w.id === value);
        if (wh) {
          item.warehouseName = wh.name;
        }
      }

      const qty = Number(item.quantity) || 0;
      const unit = Number(item.unitPrice) || 0;
      const disc = Math.min(100, Math.max(0, Number(item.discountPercent) || 0));

      const afterDisc = unit * (1 - disc / 100);
      item.priceAfterDiscount = Math.round(afterDisc * 100) / 100;
      item.lineTotal = Math.round(qty * item.priceAfterDiscount * 100) / 100;

      updated[index] = item;
      return updated;
    });
  };

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      {
        serialNumber: prev.length + 1,
        productId: products[0]?.id || '',
        productName: products[0]?.name || '',
        warehouseId: warehouses[0]?.id || 'wh-main',
        warehouseName: warehouses[0]?.name || 'المخزن الرئيسي',
        quantity: 1,
        unitPrice: products[0]?.costPrice || 100,
        discountPercent: 0,
        priceAfterDiscount: products[0]?.costPrice || 100,
        lineTotal: products[0]?.costPrice || 100
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(prev =>
      prev
        .filter((_, i) => i !== index)
        .map((it, idx) => ({ ...it, serialNumber: idx + 1 }))
    );
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.lineTotal || 0), 0);
  const vatAmount = Math.round(((subtotal - discountAllowed) * (vatRate / 100)) * 100) / 100;
  const netTotal = Math.max(0, Math.round((subtotal - discountAllowed + vatAmount) * 100) / 100);
  const remainingAmount = Math.max(0, netTotal - paidAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!matchedEmployee) {
      alert('يرجى إدخال الرقم السري الصحيح للموظف مدخل الفاتورة للتحقق من الهوية والمسؤولية');
      return;
    }

    if (!incomingDocNumber.trim()) {
      alert('يرجى كتابة رقم بيان الوارد / إذن التسليم الوارد من المورد يدوياً');
      return;
    }

    const currentSup = suppliers.find(s => s.id === supplierId);
    const invoicePayload: Omit<SupplierInvoice, 'id'> = {
      type,
      supplierId,
      supplierName: currentSup?.name || 'مورد عام',
      invoiceNumber,
      incomingDocNumber: incomingDocNumber.trim(),
      employeePin: employeePin.trim(),
      employeeName: matchedEmployee.name,
      date,
      dueDate,
      items,
      subtotal,
      discountAllowed,
      vatRate,
      vatAmount,
      netTotal,
      totalAmount: netTotal,
      paidAmount: Number(paidAmount) || 0,
      remainingAmount,
      status: remainingAmount === 0 ? 'paid' : paidAmount > 0 ? 'partial' : 'unpaid',
      notes
    };

    onSave(invoicePayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl text-right my-auto">
        {/* Header */}
        <div
          className={`px-6 py-4 flex items-center justify-between border-b ${
            isReturn ? 'bg-rose-950 border-rose-800' : 'bg-slate-950 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {isReturn ? (
              <RotateCcw className="w-5 h-5 text-rose-400" />
            ) : (
              <FileText className="w-5 h-5 text-amber-400" />
            )}
            <div>
              <h3 className="font-black text-base text-white">
                {isReturn ? 'إضافة مرتجع فاتورة مشتريات جديدة (تخصم من المخزون والمورد)' : 'إضافة فاتورة مشتريات جديدة (ترحل للمخزون وحساب المورد)'}
              </h3>
              <p className="text-xs text-gray-400">
                رقم الفاتورة الآلي: <strong className="font-mono text-amber-400">{invoiceNumber}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto text-xs">
          {/* Top Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            {/* Automatic Invoice Number */}
            <div>
              <label className="block text-gray-400 font-bold mb-1">رقم الفاتورة (تلقائي)</label>
              <input
                type="text"
                readOnly
                value={invoiceNumber}
                className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 font-mono font-bold cursor-not-allowed"
              />
            </div>

            {/* Supplier Dropdown */}
            <div>
              <label className="block text-gray-300 font-bold mb-1">اسم المورد (قائمة منسدلة) *</label>
              <select
                required
                value={supplierId}
                onChange={e => setSupplierId(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} - {s.companyName}
                  </option>
                ))}
              </select>
            </div>

            {/* Incoming Document Number (Manual input) */}
            <div>
              <label className="block text-gray-300 font-bold mb-1">
                رقم بيان الوارد / إذن التسليم (يدوي) *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: إذن رقم 8492"
                value={incomingDocNumber}
                onChange={e => setIncomingDocNumber(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400"
              />
              <span className="text-[10px] text-gray-400 block mt-0.5">
                يكتب يدوياً بناءً على إذن المورد الورقي
              </span>
            </div>

            {/* Date */}
            <div>
              <label className="block text-gray-300 font-bold mb-1">تاريخ الفاتورة</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Employee PIN & Instant Name Detection */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-sky-400" />
              <div>
                <label className="block text-gray-300 font-bold">الرقم السري للموظف مدخل الفاتورة *</label>
                <span className="text-[10px] text-gray-400">
                  لتسجيل مسؤولية الإدخال محاسبياً (يظهر اسمه فور كتابة الرقم السري)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="password"
                required
                placeholder="أدخل رقمك السري..."
                value={employeePin}
                onChange={e => setEmployeePin(e.target.value)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono w-48 outline-none focus:ring-2 focus:ring-sky-400"
              />

              {matchedEmployee ? (
                <div className="bg-emerald-950 border border-emerald-500/80 text-emerald-300 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 text-xs animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>الموظف: {matchedEmployee.name} ({matchedEmployee.jobRole})</span>
                </div>
              ) : employeePin ? (
                <div className="bg-rose-950 border border-rose-800 text-rose-300 px-2.5 py-1.5 rounded-xl text-[11px] flex items-center gap-1 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>الرقم السري غير مطابق!</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Items Entry Table as specifically requested by user */}
          <div className="border border-slate-800 rounded-xl overflow-hidden shadow-lg bg-slate-950/40">
            <div className="bg-slate-950 p-3 px-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2 font-bold text-gray-300">
                <WarehouseIcon className="w-4 h-4 text-amber-400" />
                <span>جدول بنود الأصناف والمستودعات المرحل إليها:</span>
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة بند صنف جديد</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950/80 text-gray-400 border-b border-slate-800 font-bold text-[11px]">
                  <tr>
                    <th className="p-2.5 text-center w-12">م</th>
                    <th className="p-2.5 min-w-[200px]">الصنف (مكود بالمخازن)</th>
                    <th className="p-2.5 min-w-[180px]">المخزن المرحل إليه</th>
                    <th className="p-2.5 w-24">الكمية</th>
                    <th className="p-2.5 w-28">السعر (ج.م)</th>
                    <th className="p-2.5 w-24">الخصم %</th>
                    <th className="p-2.5 w-28">بعد الخصم</th>
                    <th className="p-2.5 w-32">الإجمالي</th>
                    <th className="p-2.5 text-center w-12">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {items.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-850">
                      {/* 1. المسلسل */}
                      <td className="p-2.5 text-center font-mono font-bold text-gray-400">
                        {item.serialNumber}
                      </td>

                      {/* 2. قائمة منسدلة بالأصناف المكودة */}
                      <td className="p-2.5">
                        <select
                          value={item.productId}
                          onChange={e => handleItemChange(index, 'productId', e.target.value)}
                          className="w-full p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                        >
                          {products.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.stock} متاح)
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 3. قائمة منسدلة بالمخازن المكودة */}
                      <td className="p-2.5">
                        <select
                          value={item.warehouseId}
                          onChange={e => handleItemChange(index, 'warehouseId', e.target.value)}
                          className="w-full p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-emerald-300 font-bold outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
                        >
                          {warehouses.map(w => (
                            <option key={w.id} value={w.id}>
                              {w.code} - {w.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 4. الكمية */}
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))}
                          className="w-full p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold text-center outline-none focus:ring-1 focus:ring-amber-400"
                        />
                      </td>

                      {/* 5. السعر */}
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          required
                          value={item.unitPrice}
                          onChange={e => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                          className="w-full p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-center outline-none focus:ring-1 focus:ring-amber-400"
                        />
                      </td>

                      {/* 6. الخصم */}
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discountPercent}
                          onChange={e => handleItemChange(index, 'discountPercent', Number(e.target.value))}
                          className="w-full p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 font-mono text-center outline-none focus:ring-1 focus:ring-amber-400"
                        />
                      </td>

                      {/* 7. السعر بعد الخصم */}
                      <td className="p-2.5 font-mono text-gray-300 font-bold">
                        {item.priceAfterDiscount.toLocaleString()} ج.م
                      </td>

                      {/* 8. الإجمالي */}
                      <td className="p-2.5 font-mono font-black text-amber-400">
                        {item.lineTotal.toLocaleString()} ج.م
                      </td>

                      {/* 9. حذف */}
                      <td className="p-2.5 text-center">
                        <button
                          type="button"
                          disabled={items.length <= 1}
                          onClick={() => handleRemoveItem(index)}
                          className="text-gray-500 hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Summary: VAT, Allowed Discount, Net Total */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-gray-400 font-bold mb-1">ملاحظات الفاتورة والتسليم</label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="أي ملاحظات تخص حالة الشحنة أو بيان الوارد..."
                className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:ring-1 focus:ring-amber-400 text-xs"
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-gray-300">
                <span>إجمالي بنود الفاتورة قبل الضريبة:</span>
                <span className="font-mono font-bold">{subtotal.toLocaleString()} ج.م</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300">الخصم المسموح به من المورد (ج.م):</span>
                <input
                  type="number"
                  min="0"
                  value={discountAllowed}
                  onChange={e => setDiscountAllowed(Number(e.target.value))}
                  className="w-28 p-1 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-center outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300">ضريبة القيمة المضافة VAT (14%):</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-gray-300">{vatAmount.toLocaleString()} ج.م</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={vatRate}
                    onChange={e => setVatRate(Number(e.target.value))}
                    className="w-14 p-1 rounded-lg bg-slate-900 border border-slate-700 text-gray-400 font-mono text-center text-xs"
                    title="نسبة الضريبة"
                  />
                  <span className="text-gray-500">%</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-sm">
                <span className="font-black text-white">صافي الفاتورة الإجمالي:</span>
                <span className="font-mono font-black text-amber-400 text-base">{netTotal.toLocaleString()} ج.م</span>
              </div>

              <div className="flex justify-between items-center pt-1 text-xs">
                <span className="text-gray-300">المبلغ المدفوع نقداً/بنكياً الآن:</span>
                <input
                  type="number"
                  min="0"
                  max={netTotal}
                  value={paidAmount}
                  onChange={e => setPaidAmount(Number(e.target.value))}
                  className="w-28 p-1 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold text-center outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-gray-400">
                <span>المبلغ المتبقي لحساب المورد:</span>
                <span className="font-mono text-rose-400 font-bold">{remainingAmount.toLocaleString()} ج.م</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <span className="text-[11px] text-gray-400">
              * بمجرد الحفظ يتم ترحيل الكميات {isReturn ? 'بالخصم' : 'بالإضافة'} تلقائياً للمستودع المحدد وتوليد قيد اليومية.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-gray-300 font-bold hover:bg-slate-700 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className={`px-5 py-2 rounded-xl font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-md ${
                  isReturn
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-amber-400 hover:bg-amber-500 text-slate-950'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>{isReturn ? 'اعتماد وحفظ مرتجع المشتريات' : 'اعتماد وترحيل فاتورة المشتريات'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
