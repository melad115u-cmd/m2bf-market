import React, { useState, useMemo, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Warehouse,
  WarehouseTransfer,
  InventoryAdjustment,
  Product
} from '../types';
import {
  Package,
  Layers,
  ArrowRightLeft,
  PlusCircle,
  MinusCircle,
  FileText,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Tag,
  Palette,
  Eye,
  FileSpreadsheet,
  X,
  Edit2,
  Trash2,
  RefreshCw,
  QrCode,
  ShieldCheck,
  UserCheck,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { printDocumentHtml } from '../utils/printUtils';

export const WarehouseInventoryManager: React.FC = () => {
  const {
    products,
    warehouses,
    addWarehouse,
    updateWarehouse,
    deleteWarehouse,
    warehouseTransfers,
    createWarehouseTransfer,
    inventoryAdjustments,
    createInventoryAdjustment,
    updateProductPrices,
    setProductOpeningStock,
    addProduct,
    suppliers,
    categories,
    supplierInvoices,
    orders,
    settings,
    currentUser,
    addToast
  } = useStore();

  // Active Modals & Operations
  const [activeModal, setActiveModal] = useState<
    | null
    | 'code_warehouse'      // 1. زر تكويد المخازن
    | 'code_product'        // 2. زر تكويد الاصناف
    | 'edit_purchase_price' // 3. زر تعديل اسعار المشتريات
    | 'edit_sales_price'    // 4. زر تعديل اسعار المبيعات
    | 'opening_balance'     // 5. زر الرصيد الافتتاحى
    | 'warehouse_transfer'  // 6. زر تحويلات المخازن
    | 'adjustment_add'      // 7. زر تسويات الاضافة
    | 'adjustment_deduct'   // 8. زر تسويات الخصم
    | 'reports_menu'        // 9. زر تقرير المخازن
  >(null);

  // Active Report Type (within the 18 reports)
  const [activeReport, setActiveReport] = useState<
    | 'warehouse_directory'        // 1- تقرير دليل المخازن
    | 'items_directory'            // 2- تقرير دليل الاصناف
    | 'purchase_prices'            // 3- تقرير اسعار المشتريات
    | 'sales_prices'               // 4- تقرير اسعار المبيعات
    | 'transfers_log'              // 5- تقرير تحويلات المخازن
    | 'single_transfer_by_num'     // 6- تقرير عن تحويل معين برقم التحويل
    | 'transfers_period'           // 7- تقرير عن التحويلات خلال فترة معينة
    | 'adjustments_all'            // 8- تقرير عن التسويات
    | 'adjustments_add'            // 9- تقرير عن تسوية اضافة
    | 'adjustments_deduct'         // 10- تقرير عن تسوية خصم
    | 'adjustments_statement'      // 11- بيان عن التسويات
    | 'item_card'                  // 12- تقرير كارت الصنف
    | 'item_inquiry'               // 13- الاستعلام عن صنف بالمخازن
    | 'single_warehouse_balance'   // 14- تقرير عن رصيد مخزن معين
    | 'all_warehouses_balances'    // 15- تقرير عن ارصدة المخازن
    | 'movement_analysis'          // 16- تقرير عن تحليل حركة الاصناف
    | 'period_purchases'           // 17- تقرير عن مشتريات فترة
    | 'period_sales'               // 18- تقرير عن مبيعات فترة
  >('warehouse_directory');

  // Form States for: 1. تكويد المخازن (خانتين: رقم المخزن واسم المخزن)
  const [newWhCode, setNewWhCode] = useState('');
  const [newWhName, setNewWhName] = useState('');
  const [editingWhId, setEditingWhId] = useState<string | null>(null);

  // Form States for: 2. تكويد الاصناف
  const [codeSupplierCode, setCodeSupplierCode] = useState('');
  const [codeItemCode, setCodeItemCode] = useState('');
  const [codeColorCode, setCodeColorCode] = useState('');
  const [codeItemName, setCodeItemName] = useState('');
  const [codeItemImageUrl, setCodeItemImageUrl] = useState('');
  const [codeItemCategory, setCodeItemCategory] = useState(categories[0]?.id || 'cat-mobiles');
  const [codeItemBrand, setCodeItemBrand] = useState('');
  const [codeItemPurchasePrice, setCodeItemPurchasePrice] = useState<number>(0);
  const [codeItemSalesPrice, setCodeItemSalesPrice] = useState<number>(0);
  const [codeItemInitialStock, setCodeItemInitialStock] = useState<number>(0);
  const [codeItemWarehouseId, setCodeItemWarehouseId] = useState<string>(warehouses[0]?.id || 'wh-main');

  // Form States for: 3. تعديل اسعار المشتريات
  const [selectedProductForCost, setSelectedProductForCost] = useState<string>(products[0]?.id || '');
  const [newCostPriceValue, setNewCostPriceValue] = useState<number>(0);

  // Form States for: 4. تعديل اسعار المبيعات
  const [selectedProductForPrice, setSelectedProductForPrice] = useState<string>(products[0]?.id || '');
  const [newSalesPriceValue, setNewSalesPriceValue] = useState<number>(0);
  const [newOriginalPriceValue, setNewOriginalPriceValue] = useState<number>(0);

  // Form States for: 5. الرصيد الافتتاحي
  const [openingProdId, setOpeningProdId] = useState<string>(products[0]?.id || '');
  const [openingWarehouseId, setOpeningWarehouseId] = useState<string>(warehouses[0]?.id || '');
  const [openingQuantity, setOpeningQuantity] = useState<number>(10);
  const [openingUnitCost, setOpeningUnitCost] = useState<number>(0);

  // Form States for: 6. تحويلات المخازن
  const [transferFromWh, setTransferFromWh] = useState<string>(warehouses[0]?.id || '');
  const [transferToWh, setTransferToWh] = useState<string>(warehouses[1]?.id || warehouses[0]?.id || '');
  const [transferProdId, setTransferProdId] = useState<string>(products[0]?.id || '');
  const [transferQty, setTransferQty] = useState<number>(1);
  const [transferNotes, setTransferNotes] = useState<string>('');
  const [transferPin, setTransferPin] = useState<string>('');
  const [transferEmployeeName, setTransferEmployeeName] = useState<string>(currentUser?.name || 'مسؤول الحركة المخزنية');

  // Form States for: 7. تسويات الاضافة
  const [adjAddWarehouseId, setAdjAddWarehouseId] = useState<string>(warehouses[0]?.id || '');
  const [adjAddProdId, setAdjAddProdId] = useState<string>(products[0]?.id || '');
  const [adjAddQty, setAdjAddQty] = useState<number>(1);
  const [adjAddUnitCost, setAdjAddUnitCost] = useState<number>(0);
  const [adjAddReason, setAdjAddReason] = useState<string>('تسوية جرد دوري - فائض مستودع');
  const [adjAddNotes, setAdjAddNotes] = useState<string>('');

  // Form States for: 8. تسويات الخصم
  const [adjDeductWarehouseId, setAdjDeductWarehouseId] = useState<string>(warehouses[0]?.id || '');
  const [adjDeductProdId, setAdjDeductProdId] = useState<string>(products[0]?.id || '');
  const [adjDeductQty, setAdjDeductQty] = useState<number>(1);
  const [adjDeductReason, setAdjDeductReason] = useState<string>('تسوية خصم - تالف / هالك معتمد');
  const [adjDeductNotes, setAdjDeductNotes] = useState<string>('');

  // Report Specific Filter States
  const [reportSearchQuery, setReportSearchQuery] = useState('');
  const [reportSelectedWarehouseId, setReportSelectedWarehouseId] = useState<string>(warehouses[0]?.id || 'all');
  const [reportSelectedProductId, setReportSelectedProductId] = useState<string>(products[0]?.id || '');
  const [reportTransferNumberQuery, setReportTransferNumberQuery] = useState<string>('');
  const [reportFromDate, setReportFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [reportToDate, setReportToDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Printable container reference
  const reportContainerRef = useRef<HTMLDivElement>(null);

  // Helper: Get product stock in a specific warehouse
  const getProductStockInWarehouse = (prod: Product, whId: string): number => {
    if (prod.warehouseStock && prod.warehouseStock[whId] !== undefined) {
      return prod.warehouseStock[whId];
    }
    // Fallback: If no distribution, assign all to default or first warehouse
    if (whId === (warehouses[0]?.id || 'wh-main')) {
      return prod.stock;
    }
    return 0;
  };

  // 1. Submit Code Warehouse
  const handleSaveWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWhCode.trim() || !newWhName.trim()) {
      addToast('يرجى كتابة رقم المخزن واسم المخزن', 'error');
      return;
    }
    // Limit to 6 chars/digits as requested
    const cleanCode = newWhCode.trim().slice(0, 6);
    const cleanName = newWhName.trim();

    if (editingWhId) {
      updateWarehouse(editingWhId, { code: cleanCode, name: cleanName });
      setEditingWhId(null);
    } else {
      addWarehouse({
        code: cleanCode,
        name: cleanName,
        location: 'المستودع الرئيسي'
      });
    }
    setNewWhCode('');
    setNewWhName('');
  };

  // 2. Submit Code Product
  const handleSaveCodedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeItemName.trim()) {
      addToast('يرجى إدخال اسم الصنف', 'error');
      return;
    }

    const cleanSupplierCode = codeSupplierCode.trim().slice(0, 6) || '100001';
    const cleanItemCode = codeItemCode.trim().slice(0, 6) || Math.floor(100000 + Math.random() * 900000).toString();
    const cleanColorCode = codeColorCode.trim().slice(0, 6) || '000001';
    const fallbackImage = 'https://images.unsplash.com/photo-1511707171634-5f897ff02596?auto=format&fit=crop&w=800&q=80';

    const initialStockQty = Math.max(0, Number(codeItemInitialStock));
    const whDist: Record<string, number> = {
      [codeItemWarehouseId]: initialStockQty
    };

    addProduct({
      name: codeItemName.trim(),
      category: codeItemCategory,
      brand: codeItemBrand.trim() || 'صنف عام',
      supplierCode: cleanSupplierCode,
      itemCode: cleanItemCode,
      colorCode: cleanColorCode,
      costPrice: Number(codeItemPurchasePrice) || 0,
      price: Number(codeItemSalesPrice) || 0,
      originalPrice: Number(codeItemSalesPrice) ? Number(codeItemSalesPrice) * 1.1 : 0,
      stock: initialStockQty,
      openingStock: initialStockQty,
      openingCost: Number(codeItemPurchasePrice) || 0,
      warehouseStock: whDist,
      image: codeItemImageUrl.trim() || fallbackImage,
      images: [codeItemImageUrl.trim() || fallbackImage],
      description: `صنف مكود: كود مورد ${cleanSupplierCode} | كود صنف ${cleanItemCode} | كود لون ${cleanColorCode}`,
      rating: 5,
      ratingCount: 1,
      isInstallmentAvailable: true,
      maxInstallmentMonths: 24,
      minDownPaymentPercent: 10
    });

    addToast(`تم تكويد الصنف الجديد (${cleanItemCode} - ${codeItemName.trim()}) بنجاح`);
    setActiveModal(null);
    setCodeItemName('');
    setCodeSupplierCode('');
    setCodeItemCode('');
    setCodeColorCode('');
    setCodeItemImageUrl('');
    setCodeItemPurchasePrice(0);
    setCodeItemSalesPrice(0);
    setCodeItemInitialStock(0);
  };

  // 3. Submit Purchase Price Edit
  const handleSavePurchasePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCostPriceValue < 0) {
      addToast('سعر الشراء يجب أن يكون رقماً صحيحاً', 'error');
      return;
    }
    updateProductPrices(selectedProductForCost, { costPrice: Number(newCostPriceValue) });
    setActiveModal(null);
  };

  // 4. Submit Sales Price Edit
  const handleSaveSalesPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSalesPriceValue <= 0) {
      addToast('سعر البيع يجب أن يكون أكبر من الصفر', 'error');
      return;
    }
    updateProductPrices(selectedProductForPrice, {
      price: Number(newSalesPriceValue),
      originalPrice: newOriginalPriceValue > 0 ? Number(newOriginalPriceValue) : undefined
    });
    setActiveModal(null);
  };

  // 5. Submit Opening Balance
  const handleSaveOpeningBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (openingQuantity < 0) {
      addToast('الكمية يجب أن تكون صفراً أو أكثر', 'error');
      return;
    }
    setProductOpeningStock(
      openingProdId,
      openingWarehouseId,
      Number(openingQuantity),
      Number(openingUnitCost)
    );
    setActiveModal(null);
  };

  // 6. Submit Warehouse Transfer
  const handleSaveTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (transferFromWh === transferToWh) {
      addToast('لا يمكن التحويل لنفس المخزن! اختر مخزنين مختلفين', 'error');
      return;
    }
    if (transferQty <= 0) {
      addToast('كمية التحويل يجب أن تكون أكبر من الصفر', 'error');
      return;
    }

    const prod = products.find(p => p.id === transferProdId);
    const fromWh = warehouses.find(w => w.id === transferFromWh);
    const toWh = warehouses.find(w => w.id === transferToWh);

    if (!prod || !fromWh || !toWh) return;

    const availableInSource = getProductStockInWarehouse(prod, transferFromWh);
    if (availableInSource < transferQty) {
      addToast(`الرصيد المتاح بالمخزن المصدر (${availableInSource}) غير كافٍ لتحويل ${transferQty} قطعة`, 'error');
      return;
    }

    const nextTransferNum = `TR-2026-${(warehouseTransfers.length + 1).toString().padStart(3, '0')}`;
    createWarehouseTransfer({
      transferNumber: nextTransferNum,
      date: new Date().toISOString().split('T')[0],
      fromWarehouseId: fromWh.id,
      fromWarehouseName: fromWh.name,
      toWarehouseId: toWh.id,
      toWarehouseName: toWh.name,
      productId: prod.id,
      productName: prod.name,
      quantity: Number(transferQty),
      employeeName: transferEmployeeName,
      employeePin: transferPin || '1234',
      notes: transferNotes || 'تحويل داخلي لتغذية رصيد المخزن'
    });

    setActiveModal(null);
    setTransferQty(1);
    setTransferNotes('');
  };

  // 7. Submit Adjustment Addition
  const handleSaveAdjAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (adjAddQty <= 0) {
      addToast('الكمية المضافة يجب أن تكون أكبر من الصفر', 'error');
      return;
    }
    const prod = products.find(p => p.id === adjAddProdId);
    const wh = warehouses.find(w => w.id === adjAddWarehouseId);
    if (!prod || !wh) return;

    const nextAdjNum = `ADJ-IN-${(inventoryAdjustments.filter(a => a.type === 'addition').length + 1).toString().padStart(3, '0')}`;
    const unitCost = adjAddUnitCost > 0 ? adjAddUnitCost : prod.costPrice;

    createInventoryAdjustment({
      adjustmentNumber: nextAdjNum,
      type: 'addition',
      date: new Date().toISOString().split('T')[0],
      warehouseId: wh.id,
      warehouseName: wh.name,
      productId: prod.id,
      productName: prod.name,
      quantity: Number(adjAddQty),
      unitCost: Number(unitCost),
      totalCost: Number(unitCost) * Number(adjAddQty),
      reason: adjAddReason,
      notes: adjAddNotes,
      employeeName: currentUser?.name || 'أمين المخزن'
    });

    setActiveModal(null);
    setAdjAddQty(1);
    setAdjAddNotes('');
  };

  // 8. Submit Adjustment Deduction
  const handleSaveAdjDeduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (adjDeductQty <= 0) {
      addToast('الكمية المخصومة يجب أن تكون أكبر من الصفر', 'error');
      return;
    }
    const prod = products.find(p => p.id === adjDeductProdId);
    const wh = warehouses.find(w => w.id === adjDeductWarehouseId);
    if (!prod || !wh) return;

    const currentStock = getProductStockInWarehouse(prod, wh.id);
    if (currentStock < adjDeductQty) {
      addToast(`رصيد الصنف بالمخزن (${currentStock}) أقل من الكمية المراد خصمها`, 'error');
      return;
    }

    const nextAdjNum = `ADJ-OUT-${(inventoryAdjustments.filter(a => a.type === 'deduction').length + 1).toString().padStart(3, '0')}`;

    createInventoryAdjustment({
      adjustmentNumber: nextAdjNum,
      type: 'deduction',
      date: new Date().toISOString().split('T')[0],
      warehouseId: wh.id,
      warehouseName: wh.name,
      productId: prod.id,
      productName: prod.name,
      quantity: Number(adjDeductQty),
      unitCost: prod.costPrice,
      totalCost: prod.costPrice * Number(adjDeductQty),
      reason: adjDeductReason,
      notes: adjDeductNotes,
      employeeName: currentUser?.name || 'أمين المخزن'
    });

    setActiveModal(null);
    setAdjDeductQty(1);
    setAdjDeductNotes('');
  };

  // Print Action Trigger with fallback
  const handlePrintActiveReport = () => {
    if (!reportContainerRef.current) {
      window.print();
      return;
    }
    const reportTitle = getReportTitleText(activeReport);
    printDocumentHtml({
      title: reportTitle,
      subtitle: `نظام ERP لإدارة المخازن والجرد والمستودعات - المنظومة المحاسبية المعتمدة`,
      storeName: settings.storeName || 'سوق مصر الكبرى',
      documentNumber: `REP-${Date.now().toString().slice(-6)}`,
      contentHtml: reportContainerRef.current.innerHTML
    });
  };

  // Helper for report title
  const getReportTitleText = (type: string): string => {
    switch (type) {
      case 'warehouse_directory': return 'تقرير دليل المخازن والمستودعات المعتمدة';
      case 'items_directory': return 'تقرير دليل وتكويد الأصناف الشامل بالمخازن';
      case 'purchase_prices': return 'تقرير أسعار شراء وتكلفة الأصناف';
      case 'sales_prices': return 'تقرير أسعار بيع الأصناف وهوامش الربح';
      case 'transfers_log': return 'تقرير حركة تحويلات المخازن بين الفروع والمستودعات';
      case 'single_transfer_by_num': return 'تقرير وبوليسة إذن تحويل مخزني معين';
      case 'transfers_period': return 'تقرير تحويلات المخازن خلال فترة محددة';
      case 'adjustments_all': return 'تقرير شامل بكافة التسويات المخزنية (إضافة وخصم)';
      case 'adjustments_add': return 'تقرير تسويات الإضافة المخزنية المعفدة';
      case 'adjustments_deduct': return 'تقرير تسويات الخصم والعجز والتوالف المخزنية';
      case 'adjustments_statement': return 'بيان إحصائي ومالي لحركات التسويات المخزنية';
      case 'item_card': return 'تقرير كارت حركة الصنف التفصيلي (Stock Movement Ledger)';
      case 'item_inquiry': return 'استعلام فوري وتوزيع كميات صنف بكافة المخازن';
      case 'single_warehouse_balance': return 'تقرير جرد وأرصدة مخزن محدد';
      case 'all_warehouses_balances': return 'تقرير مصفوفة أرصدة جميع المخازن والقيمة الإجمالية';
      case 'movement_analysis': return 'تقرير تحليل معدل دوران وحركة الأصناف (سريع / راكد)';
      case 'period_purchases': return 'تقرير واردات ومشتريات المخازن خلال فترة';
      case 'period_sales': return 'تقرير منصرفات ومبيعات الأصناف خلال فترة';
      default: return 'تقرير المخازن والجرد';
    }
  };

  return (
    <div className="space-y-6 text-right font-['Cairo',sans-serif]">
      {/* Top Header Card */}
      <div className="bg-slate-800/95 border border-slate-700 rounded-3xl p-5 md:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center font-black shadow-lg">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                <span>إدارة المخازن والجرد والمستودعات المتكاملة</span>
                <span className="bg-amber-400/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full border border-amber-400/40 font-mono">
                  ERP Inventory
                </span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                تكويد المخازن والأصناف حتى 6 أرقام، تعديل أسعار الشراء والبيع، الأرصدة الافتتاحية، التحويلات، التسويات، و18 تقريراً شاملاً مع الطباعة الفعلية المباشرة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-400" />
              <span className="text-gray-300">المخازن المكودة:</span>
              <span className="font-bold font-mono text-white text-sm">{warehouses.length}</span>
            </div>
            <div className="bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="text-gray-300">إجمالي الأصناف:</span>
              <span className="font-bold font-mono text-white text-sm">{products.length}</span>
            </div>
          </div>
        </div>

        {/* Required Operational Action Buttons (Numbered exactly as requested) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
          {/* 1. زر تكويد المخازن */}
          <button
            onClick={() => setActiveModal('code_warehouse')}
            className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-850 hover:from-slate-800 hover:to-slate-750 border border-slate-700 hover:border-amber-400/60 p-3 rounded-2xl text-xs font-bold text-white transition-all shadow-md group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-colors">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-amber-400/80 font-mono">1. إعداد المخازن</span>
              <span className="block font-black text-xs">تكويد المخازن</span>
            </div>
          </button>

          {/* 2. زر تكويد الاصناف */}
          <button
            onClick={() => setActiveModal('code_product')}
            className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-850 hover:from-slate-800 hover:to-slate-750 border border-slate-700 hover:border-sky-400/60 p-3 rounded-2xl text-xs font-bold text-white transition-all shadow-md group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 group-hover:bg-sky-400 group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-colors">
              <Tag className="w-4 h-4" />
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-sky-400/80 font-mono">2. بطاقة صنف</span>
              <span className="block font-black text-xs">تكويد الأصناف</span>
            </div>
          </button>

          {/* 3. زر تعديل اسعار المشتريات */}
          <button
            onClick={() => {
              setSelectedProductForCost(products[0]?.id || '');
              setNewCostPriceValue(products[0]?.costPrice || 0);
              setActiveModal('edit_purchase_price');
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-850 hover:from-slate-800 hover:to-slate-750 border border-slate-700 hover:border-emerald-400/60 p-3 rounded-2xl text-xs font-bold text-white transition-all shadow-md group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-400 group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-colors">
              <DollarSign className="w-4 h-4" />
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-emerald-400/80 font-mono">3. سعر التكلفة</span>
              <span className="block font-black text-xs">تعديل أسعار المشتريات</span>
            </div>
          </button>

          {/* 4. زر تعديل اسعار المبيعات */}
          <button
            onClick={() => {
              setSelectedProductForPrice(products[0]?.id || '');
              setNewSalesPriceValue(products[0]?.price || 0);
              setNewOriginalPriceValue(products[0]?.originalPrice || 0);
              setActiveModal('edit_sales_price');
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-850 hover:from-slate-800 hover:to-slate-750 border border-slate-700 hover:border-purple-400/60 p-3 rounded-2xl text-xs font-bold text-white transition-all shadow-md group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 group-hover:bg-purple-400 group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-purple-400/80 font-mono">4. تسعير البيع</span>
              <span className="block font-black text-xs">تعديل أسعار المبيعات</span>
            </div>
          </button>

          {/* 5. زر الرصيد الافتتاحى */}
          <button
            onClick={() => {
              setOpeningProdId(products[0]?.id || '');
              setOpeningWarehouseId(warehouses[0]?.id || '');
              setOpeningQuantity(products[0]?.openingStock || products[0]?.stock || 10);
              setOpeningUnitCost(products[0]?.openingCost || products[0]?.costPrice || 0);
              setActiveModal('opening_balance');
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-850 hover:from-slate-800 hover:to-slate-750 border border-slate-700 hover:border-indigo-400/60 p-3 rounded-2xl text-xs font-bold text-white transition-all shadow-md group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-400 group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-colors">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-indigo-400/80 font-mono">5. أول المدة</span>
              <span className="block font-black text-xs">الرصيد الافتتاحي</span>
            </div>
          </button>

          {/* 6. زر تحويلات المخازن */}
          <button
            onClick={() => {
              setTransferFromWh(warehouses[0]?.id || '');
              setTransferToWh(warehouses[1]?.id || warehouses[0]?.id || '');
              setTransferProdId(products[0]?.id || '');
              setTransferQty(1);
              setActiveModal('warehouse_transfer');
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-850 hover:from-slate-800 hover:to-slate-750 border border-slate-700 hover:border-teal-400/60 p-3 rounded-2xl text-xs font-bold text-white transition-all shadow-md group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 group-hover:bg-teal-400 group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-colors">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-teal-400/80 font-mono">6. مناقلة داخلية</span>
              <span className="block font-black text-xs">تحويلات المخازن</span>
            </div>
          </button>

          {/* 7. زر تسويات الاضافة */}
          <button
            onClick={() => {
              setAdjAddWarehouseId(warehouses[0]?.id || '');
              setAdjAddProdId(products[0]?.id || '');
              setAdjAddQty(1);
              setAdjAddUnitCost(products[0]?.costPrice || 0);
              setActiveModal('adjustment_add');
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-850 hover:from-slate-800 hover:to-slate-750 border border-slate-700 hover:border-emerald-400/60 p-3 rounded-2xl text-xs font-bold text-white transition-all shadow-md group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-400 group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-colors">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-emerald-400/80 font-mono">7. فائض جرد</span>
              <span className="block font-black text-xs">تسويات الإضافة</span>
            </div>
          </button>

          {/* 8. زر تسويات الخصم */}
          <button
            onClick={() => {
              setAdjDeductWarehouseId(warehouses[0]?.id || '');
              setAdjDeductProdId(products[0]?.id || '');
              setAdjDeductQty(1);
              setActiveModal('adjustment_deduct');
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-850 hover:from-slate-800 hover:to-slate-750 border border-slate-700 hover:border-rose-400/60 p-3 rounded-2xl text-xs font-bold text-white transition-all shadow-md group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 group-hover:bg-rose-400 group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-colors">
              <MinusCircle className="w-4 h-4" />
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-rose-400/80 font-mono">8. عجز وهالك</span>
              <span className="block font-black text-xs">تسويات الخصم</span>
            </div>
          </button>

          {/* 9. زر تقرير المخازن (يفتح الـ 18 زراً) */}
          <button
            onClick={() => setActiveModal('reports_menu')}
            className="col-span-2 sm:col-span-1 lg:col-span-2 flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 p-3 rounded-2xl font-black transition-all shadow-lg cursor-pointer"
          >
            <FileSpreadsheet className="w-5 h-5 shrink-0" />
            <div className="text-right">
              <span className="block text-[10px] text-slate-900 font-bold uppercase tracking-wider">9. مركز التقارير الشامل</span>
              <span className="block text-sm font-black">تقارير المخازن والجرد (18 تقريراً)</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Area: Warehouse Directory & Real-time Stock Matrix */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-5 md:p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-700 pb-4">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <span>دليل المخازن المعتمدة وتوزيع الأرصدة الحية</span>
            </h3>
            <p className="text-xs text-gray-400">
              يمكنك تكويد مخازن جديدة وتعديل أسمائها وأرقامها، ومتابعة رصيد كل صنف في كل مخزن
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal('code_warehouse')}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>تكويد مخزن جديد</span>
            </button>
            <button
              onClick={() => setActiveModal('code_product')}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-600"
            >
              <Tag className="w-4 h-4 text-sky-400" />
              <span>تكويد صنف جديد</span>
            </button>
          </div>
        </div>

        {/* Warehouses Grid Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {warehouses.map(wh => {
            const itemsInWh = products.filter(p => getProductStockInWarehouse(p, wh.id) > 0);
            const totalPiecesInWh = products.reduce((sum, p) => sum + getProductStockInWarehouse(p, wh.id), 0);
            const totalWhValuation = products.reduce((sum, p) => sum + (getProductStockInWarehouse(p, wh.id) * p.costPrice), 0);

            return (
              <div
                key={wh.id}
                className="bg-slate-900/90 border border-slate-700 hover:border-amber-400/60 rounded-2xl p-4 transition-all shadow-lg space-y-3 relative group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-black">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white line-clamp-1">{wh.name}</h4>
                      <span className="text-[11px] text-amber-300 font-mono font-bold">
                        كود المخزن: {wh.code}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingWhId(wh.id);
                        setNewWhCode(wh.code);
                        setNewWhName(wh.name);
                        setActiveModal('code_warehouse');
                      }}
                      className="p-1 text-gray-400 hover:text-amber-400 rounded cursor-pointer"
                      title="تعديل المخزن"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {warehouses.length > 1 && (
                      <button
                        onClick={() => deleteWarehouse(wh.id)}
                        className="p-1 text-gray-400 hover:text-rose-400 rounded cursor-pointer"
                        title="حذف المخزن"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-gray-400 block text-[10px]">عدد الأصناف:</span>
                    <span className="font-bold text-white font-mono">{itemsInWh.length} صنف</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">إجمالي القطع:</span>
                    <span className="font-bold text-emerald-400 font-mono">{totalPiecesInWh.toLocaleString()} قطعة</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-gray-400 text-[10px]">قيمة التكلفة بالمخزن:</span>
                    <span className="font-black text-amber-300 font-mono">{totalWhValuation.toLocaleString()} ج.م</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => {
                      setReportSelectedWarehouseId(wh.id);
                      setActiveReport('single_warehouse_balance');
                      setActiveModal('reports_menu');
                    }}
                    className="text-amber-400 hover:text-amber-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>كشف جرد المخزن</span>
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setTransferFromWh(wh.id);
                      setActiveModal('warehouse_transfer');
                    }}
                    className="text-teal-400 hover:text-teal-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>تحويل منه</span>
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Items Inventory & Stock Matrix Table */}
        <div className="pt-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>مصفوفة الأصناف المكودة وتوزيع الكميات على المخازن</span>
            </h4>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="بحث باسم الصنف، كود المورد، كود الصنف..."
                  value={reportSearchQuery}
                  onChange={e => setReportSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-8 pl-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-900 text-gray-400 border-b border-slate-800 text-[11px] font-bold">
                  <tr>
                    <th className="p-3">كود المورد</th>
                    <th className="p-3">كود الصنف</th>
                    <th className="p-3">كود اللون</th>
                    <th className="p-3">اسم الصنف المكود</th>
                    <th className="p-3 text-center">سعر الشراء</th>
                    <th className="p-3 text-center">سعر البيع</th>
                    <th className="p-3 text-center">الرصيد الإجمالي</th>
                    {warehouses.map(wh => (
                      <th key={wh.id} className="p-3 text-center text-gray-300 font-mono">
                        {wh.name} ({wh.code})
                      </th>
                    ))}
                    <th className="p-3 text-center">إجراءات سريعة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {products
                    .filter(p => {
                      if (!reportSearchQuery.trim()) return true;
                      const q = reportSearchQuery.toLowerCase();
                      return (
                        p.name.toLowerCase().includes(q) ||
                        (p.itemCode && p.itemCode.includes(q)) ||
                        (p.supplierCode && p.supplierCode.includes(q)) ||
                        (p.colorCode && p.colorCode.includes(q)) ||
                        p.brand.toLowerCase().includes(q)
                      );
                    })
                    .map(p => (
                      <tr key={p.id} className="hover:bg-slate-850/80 transition-colors">
                        <td className="p-3 font-mono font-bold text-amber-400">
                          {p.supplierCode || '100010'}
                        </td>
                        <td className="p-3 font-mono font-bold text-sky-400">
                          {p.itemCode || p.id.replace('prod-', '200')}
                        </td>
                        <td className="p-3 font-mono text-purple-300">
                          {p.colorCode || '900101'}
                        </td>
                        <td className="p-3 font-bold text-white max-w-xs flex items-center gap-2">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 shrink-0"
                          />
                          <span className="line-clamp-1">{p.name}</span>
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-emerald-400">
                          {p.costPrice.toLocaleString()} ج.م
                        </td>
                        <td className="p-3 text-center font-mono font-black text-amber-400">
                          {p.price.toLocaleString()} ج.م
                        </td>
                        <td className="p-3 text-center font-mono font-black text-white bg-slate-900/60">
                          {p.stock}
                        </td>
                        {warehouses.map(wh => {
                          const stockInThisWh = getProductStockInWarehouse(p, wh.id);
                          return (
                            <td key={wh.id} className="p-3 text-center font-mono font-bold">
                              <span
                                className={`px-2 py-0.5 rounded ${
                                  stockInThisWh === 0
                                    ? 'text-gray-500 bg-slate-900'
                                    : 'text-sky-300 bg-sky-950/40 border border-sky-800/40'
                                }`}
                              >
                                {stockInThisWh}
                              </span>
                            </td>
                          );
                        })}
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                setReportSelectedProductId(p.id);
                                setActiveReport('item_card');
                                setActiveModal('reports_menu');
                              }}
                              className="bg-slate-800 hover:bg-slate-700 text-amber-400 px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
                              title="عرض كارت الصنف"
                            >
                              كارت الصنف
                            </button>
                            <button
                              onClick={() => {
                                setSelectedProductForCost(p.id);
                                setNewCostPriceValue(p.costPrice);
                                setActiveModal('edit_purchase_price');
                              }}
                              className="bg-slate-800 hover:bg-slate-700 text-emerald-400 px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
                              title="تعديل سعر الشراء"
                            >
                              تعديل الشراء
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. MODAL: تكويد المخازن (خانتين: رقم المخزن واسم المخزن) */}
      {/* ======================================================== */}
      {activeModal === 'code_warehouse' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-right">
            <div className="bg-slate-850 p-4 px-6 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-sm text-white">
                  {editingWhId ? 'تعديل بيانات المخزن' : 'زر تكويد المخازن (رقم المخزن واسم المخزن)'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setEditingWhId(null);
                }}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWarehouse} className="p-6 space-y-4">
              <div className="bg-amber-950/30 border border-amber-500/40 p-3 rounded-2xl text-xs text-amber-300">
                عبارة عن خانتين فقط كما طلبت: خانة لرقم المخزن (حتى 6 أرقام أو حروف) وخانة لاسم المخزن.
              </div>

              {/* الخانة الأولى: رقم المخزن */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  1. رقم / كود المخزن (حتى 6 أرقام):
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="مثال: 100001 أو WH-01"
                  value={newWhCode}
                  onChange={e => setNewWhCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
                <span className="text-[10px] text-gray-400 block mt-1">
                  الحد الأقصى 6 أرقام أو حروف
                </span>
              </div>

              {/* الخانة الثانية: اسم المخزن */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  2. اسم المخزن:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مستودع مدينة نصر اللوجستي"
                  value={newWhName}
                  onChange={e => setNewWhName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    setEditingWhId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs text-gray-300 hover:text-white bg-slate-800 hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingWhId ? 'حفظ التعديل' : 'حفظ وتكويد المخزن'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. MODAL: زر تكويد الاصناف (مورد، صنف، لون، اسم، صورة)     */}
      {/* ======================================================== */}
      {activeModal === 'code_product' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl text-right my-8">
            <div className="bg-slate-850 p-4 px-6 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-sky-400" />
                <h3 className="font-black text-sm text-white">
                  زر تكويد الأصناف (كود مورد - كود صنف - كود لون - اسم - رابط صورة)
                </h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCodedProduct} className="p-6 space-y-4">
              <div className="bg-sky-950/30 border border-sky-500/40 p-3 rounded-2xl text-xs text-sky-300">
                تكويد الصنف بدقة متناهية مع كود المورد أو الشركة، كود الصنف، كود لون الصنف (حتى 6 أرقام)، واسم الصنف ولينك الصورة الاختياري.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* أول خانة: كود المورد */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    1. كود المورد / الشركة:
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="مثال: 100010"
                    value={codeSupplierCode}
                    onChange={e => setCodeSupplierCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs outline-none focus:border-sky-400"
                  />
                  <span className="text-[10px] text-gray-500">حتى 6 أرقام</span>
                </div>

                {/* ثاني خانة: كود الصنف */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    2. كود الصنف:
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="مثال: 200105"
                    value={codeItemCode}
                    onChange={e => setCodeItemCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs outline-none focus:border-sky-400"
                  />
                  <span className="text-[10px] text-gray-500">حتى 6 أرقام</span>
                </div>

                {/* ثالث خانة: كود لون الصنف */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    3. كود لون الصنف:
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="مثال: 900101"
                    value={codeColorCode}
                    onChange={e => setCodeColorCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs outline-none focus:border-sky-400"
                  />
                  <span className="text-[10px] text-gray-500">حتى 6 أرقام</span>
                </div>
              </div>

              {/* خانة باسم الصنف */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  4. اسم الصنف:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: هاتف ذكي سامسونج جالاكسي A55 سعة 256 جيجا لون أسود"
                  value={codeItemName}
                  onChange={e => setCodeItemName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs outline-none focus:border-sky-400"
                />
              </div>

              {/* أسفلها خانة باللينك الخاص بصورة الصنف (اختياري) */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1 flex items-center justify-between">
                  <span>5. لينك / رابط صورة الصنف (اختياري):</span>
                  <span className="text-[10px] text-gray-400">يمكن تركه فارغاً وسيتم وضع صورة افتراضية</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/product-image.jpg"
                  value={codeItemImageUrl}
                  onChange={e => setCodeItemImageUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs font-mono outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-1">القسم:</label>
                  <select
                    value={codeItemCategory}
                    onChange={e => setCodeItemCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white text-xs outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-1">الماركة:</label>
                  <input
                    type="text"
                    placeholder="Apple, LG..."
                    value={codeItemBrand}
                    onChange={e => setCodeItemBrand(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-400 mb-1">سعر الشراء (التكلفة):</label>
                  <input
                    type="number"
                    min="0"
                    value={codeItemPurchasePrice}
                    onChange={e => setCodeItemPurchasePrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-amber-400 mb-1">سعر البيع للجمهور:</label>
                  <input
                    type="number"
                    min="0"
                    value={codeItemSalesPrice}
                    onChange={e => setCodeItemSalesPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">إيداع رصيد بالمخزن:</label>
                  <select
                    value={codeItemWarehouseId}
                    onChange={e => setCodeItemWarehouseId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-xs outline-none"
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">الكمية الأولية بالمخزن:</label>
                  <input
                    type="number"
                    min="0"
                    value={codeItemInitialStock}
                    onChange={e => setCodeItemInitialStock(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-mono text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-300 hover:text-white bg-slate-800 hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-sky-400 hover:bg-sky-500 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>حفظ وتكويد الصنف</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MODAL: زر تعديل اسعار المشتريات                       */}
      {/* ======================================================== */}
      {activeModal === 'edit_purchase_price' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-right">
            <div className="bg-slate-850 p-4 px-6 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-sm text-white">زر تعديل أسعار المشتريات (سعر التكلفة)</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePurchasePrice} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">اختر الصنف:</label>
                <select
                  value={selectedProductForCost}
                  onChange={e => {
                    setSelectedProductForCost(e.target.value);
                    const found = products.find(p => p.id === e.target.value);
                    if (found) setNewCostPriceValue(found.costPrice);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs outline-none focus:border-emerald-400"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.itemCode || p.id}] {p.name} - (السعر الحالي: {p.costPrice} ج.م)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  سعر الشراء الجديد (بالجنيه المصري):
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newCostPriceValue}
                  onChange={e => setNewCostPriceValue(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono text-sm outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-300 hover:text-white bg-slate-800 hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تحديث سعر الشراء</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MODAL: زر تعديل اسعار المبيعات                         */}
      {/* ======================================================== */}
      {activeModal === 'edit_sales_price' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-right">
            <div className="bg-slate-850 p-4 px-6 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <h3 className="font-black text-sm text-white">زر تعديل أسعار المبيعات (سعر البيع والخصم)</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSalesPrice} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">اختر الصنف:</label>
                <select
                  value={selectedProductForPrice}
                  onChange={e => {
                    setSelectedProductForPrice(e.target.value);
                    const found = products.find(p => p.id === e.target.value);
                    if (found) {
                      setNewSalesPriceValue(found.price);
                      setNewOriginalPriceValue(found.originalPrice || 0);
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs outline-none focus:border-purple-400"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.itemCode || p.id}] {p.name} - (سعر البيع: {p.price} ج.م)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  سعر البيع الحالي (بعد الخصم):
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newSalesPriceValue}
                  onChange={e => setNewSalesPriceValue(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono text-sm outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  السعر الأصلي (قبل الخصم) - اختياري:
                </label>
                <input
                  type="number"
                  min="0"
                  value={newOriginalPriceValue}
                  onChange={e => setNewOriginalPriceValue(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono text-sm outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-300 hover:text-white bg-slate-800 hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-purple-500 hover:bg-purple-600 text-white font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تحديث سعر البيع</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. MODAL: زر الرصيد الافتتاحى                           */}
      {/* ======================================================== */}
      {activeModal === 'opening_balance' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-right">
            <div className="bg-slate-850 p-4 px-6 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <h3 className="font-black text-sm text-white">زر الرصيد الافتتاحي لأول المدة</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOpeningBalance} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">اختر الصنف:</label>
                <select
                  value={openingProdId}
                  onChange={e => {
                    setOpeningProdId(e.target.value);
                    const found = products.find(p => p.id === e.target.value);
                    if (found) {
                      setOpeningQuantity(found.openingStock || found.stock);
                      setOpeningUnitCost(found.openingCost || found.costPrice);
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs outline-none focus:border-indigo-400"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.itemCode || p.id}] {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">المخزن المستهدف للرصيد:</label>
                <select
                  value={openingWarehouseId}
                  onChange={e => setOpeningWarehouseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs outline-none focus:border-indigo-400"
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">كمية الرصيد الافتتاحي:</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={openingQuantity}
                    onChange={e => setOpeningQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono text-sm outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">سعر تكلفة الوحدة:</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={openingUnitCost}
                    onChange={e => setOpeningUnitCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono text-sm outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-300 hover:text-white bg-slate-800 hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>اعتماد الرصيد الافتتاحي</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. MODAL: زر تحويلات المخازن                             */}
      {/* ======================================================== */}
      {activeModal === 'warehouse_transfer' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-right my-8">
            <div className="bg-slate-850 p-4 px-6 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-teal-400" />
                <h3 className="font-black text-sm text-white">إذن تحويل بضاعة بين المخازن والمستودعات</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTransfer} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">المخزن المحول منه (المصدر):</label>
                  <select
                    value={transferFromWh}
                    onChange={e => setTransferFromWh(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs outline-none focus:border-teal-400"
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">المخزن المحول إليه (الوجهة):</label>
                  <select
                    value={transferToWh}
                    onChange={e => setTransferToWh(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs outline-none focus:border-teal-400"
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">الصنف المراد تحويله:</label>
                <select
                  value={transferProdId}
                  onChange={e => setTransferProdId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs outline-none focus:border-teal-400"
                >
                  {products.map(p => {
                    const fromWhStock = getProductStockInWarehouse(p, transferFromWh);
                    return (
                      <option key={p.id} value={p.id}>
                        [{p.itemCode || p.id}] {p.name} - (المتاح بالمصدر: {fromWhStock} قطعة)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">الكمية المحولة:</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={transferQty}
                    onChange={e => setTransferQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-sm outline-none focus:border-teal-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">الرقم السري للموظف (PIN):</label>
                  <input
                    type="password"
                    placeholder="****"
                    value={transferPin}
                    onChange={e => setTransferPin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">اسم الموظف المسؤول:</label>
                <input
                  type="text"
                  value={transferEmployeeName}
                  onChange={e => setTransferEmployeeName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">ملاحظات التحويل والبيان:</label>
                <input
                  type="text"
                  placeholder="سبب التحويل، رقم سيارة النقل، السائق..."
                  value={transferNotes}
                  onChange={e => setTransferNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-300 hover:text-white bg-slate-800 hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-teal-400 hover:bg-teal-500 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>اعتماد التحويل وترحيل الكميات</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. MODAL: زر تسويات الاضافة                              */}
      {/* ======================================================== */}
      {activeModal === 'adjustment_add' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-right">
            <div className="bg-slate-850 p-4 px-6 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-sm text-white">إذن تسوية إضافة مخزنية (فائض / جرد دوري)</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">المخزن:</label>
                <select
                  value={adjAddWarehouseId}
                  onChange={e => setAdjAddWarehouseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs outline-none focus:border-emerald-400"
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">الصنف المراد إضافته:</label>
                <select
                  value={adjAddProdId}
                  onChange={e => {
                    setAdjAddProdId(e.target.value);
                    const found = products.find(p => p.id === e.target.value);
                    if (found) setAdjAddUnitCost(found.costPrice);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs outline-none focus:border-emerald-400"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.itemCode || p.id}] {p.name} - (التكلفة: {p.costPrice} ج.م)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">الكمية المضافة:</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={adjAddQty}
                    onChange={e => setAdjAddQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-sm outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">تكلفة الوحدة:</label>
                  <input
                    type="number"
                    min="0"
                    value={adjAddUnitCost}
                    onChange={e => setAdjAddUnitCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">سبب التسوية:</label>
                <select
                  value={adjAddReason}
                  onChange={e => setAdjAddReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs outline-none"
                >
                  <option value="تسوية جرد دوري - بضاعة زائدة">تسوية جرد دوري - بضاعة زائدة</option>
                  <option value="هدايا وعينات مجانية من المورد">هدايا وعينات مجانية من المورد</option>
                  <option value="استرجاع من أمانات صيانة وتجربة">استرجاع من أمانات صيانة وتجربة</option>
                  <option value="تعديل خطأ قيد إدخال سابق">تعديل خطأ قيد إدخال سابق</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">ملاحظات:</label>
                <input
                  type="text"
                  placeholder="ملاحظات محضر الجرد أو قرار الإدارة..."
                  value={adjAddNotes}
                  onChange={e => setAdjAddNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-300 hover:text-white bg-slate-800 hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>اعتماد تسوية الإضافة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. MODAL: زر تسويات الخصم                               */}
      {/* ======================================================== */}
      {activeModal === 'adjustment_deduct' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-right">
            <div className="bg-slate-850 p-4 px-6 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MinusCircle className="w-5 h-5 text-rose-400" />
                <h3 className="font-black text-sm text-white">إذن تسوية خصم مخزنية (عجز / تالف / هالك)</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjDeduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">المخزن:</label>
                <select
                  value={adjDeductWarehouseId}
                  onChange={e => setAdjDeductWarehouseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs outline-none focus:border-rose-400"
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">الصنف المراد خصمه:</label>
                <select
                  value={adjDeductProdId}
                  onChange={e => setAdjDeductProdId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs outline-none focus:border-rose-400"
                >
                  {products.map(p => {
                    const availableInWh = getProductStockInWarehouse(p, adjDeductWarehouseId);
                    return (
                      <option key={p.id} value={p.id}>
                        [{p.itemCode || p.id}] {p.name} - (المتاح بالمخزن: {availableInWh} قطعة)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">الكمية المخصومة:</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjDeductQty}
                  onChange={e => setAdjDeductQty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-sm outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">سبب الخصم:</label>
                <select
                  value={adjDeductReason}
                  onChange={e => setAdjDeductReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs outline-none"
                >
                  <option value="كسر أو تلف أثناء المناولة والتخزين">كسر أو تلف أثناء المناولة والتخزين</option>
                  <option value="عجز جرد دوري معتمد بمحضر">عجز جرد دوري معتمد بمحضر</option>
                  <option value="عينات ترويجية وتسويقية للعملاء">عينات ترويجية وتسويقية للعملاء</option>
                  <option value="انتهاء صلاحية / تقادم فني للمنتج">انتهاء صلاحية / تقادم فني للمنتج</option>
                  <option value="تحويل لقسم الخردة أو الصيانة الداخلية">تحويل لقسم الخردة أو الصيانة الداخلية</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">رقم محضر التلف / ملاحظات:</label>
                <input
                  type="text"
                  placeholder="رقم المحضر الإداري، اسم اللجنة..."
                  value={adjDeductNotes}
                  onChange={e => setAdjDeductNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-300 hover:text-white bg-slate-800 hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-rose-500 hover:bg-rose-600 text-white font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>اعتماد تسوية الخصم</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 9. MODAL: مركز تقارير المخازن والجرد (يحتوي الـ 18 زراً)     */}
      {/* ======================================================== */}
      {activeModal === 'reports_menu' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-6xl overflow-hidden shadow-2xl text-right flex flex-col max-h-[94vh]">
            {/* Reports Modal Header */}
            <div className="bg-slate-850 p-4 px-6 border-b border-slate-700 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white flex items-center gap-2">
                    <span>مركز تقارير المخازن والجرد المعتمدة (18 تقريراً)</span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                      طباعة فعلية مفعلة
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    اختر أي تقرير من الأزرار الـ 18 أدناه لعرض البيانات المباشرة وطباعتها فوراً
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintActiveReport}
                  className="bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
                  title="طباعة التقرير الفعلي المفتوح حالياً"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة هذا التقرير</span>
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="bg-slate-800 hover:bg-slate-750 text-gray-400 hover:text-white p-2 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 18 Reports Navigation Buttons Grid (Strictly Ordered) */}
            <div className="bg-slate-950 p-3 border-b border-slate-800 overflow-x-auto scrollbar-none shrink-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-1.5 min-w-[900px] text-[11px] font-bold">
                {[
                  { id: 'warehouse_directory', label: '1- دليل المخازن', icon: Building2 },
                  { id: 'items_directory', label: '2- دليل الأصناف', icon: Tag },
                  { id: 'purchase_prices', label: '3- أسعار المشتريات', icon: DollarSign },
                  { id: 'sales_prices', label: '4- أسعار المبيعات', icon: TrendingUp },
                  { id: 'transfers_log', label: '5- تحويلات المخازن', icon: ArrowRightLeft },
                  { id: 'single_transfer_by_num', label: '6- تحويل برقم الإذن', icon: FileCheck2 },
                  { id: 'transfers_period', label: '7- تحويلات فترة', icon: Calendar },
                  { id: 'adjustments_all', label: '8- كل التسويات', icon: Layers },
                  { id: 'adjustments_add', label: '9- تسوية إضافة', icon: PlusCircle },
                  { id: 'adjustments_deduct', label: '10- تسوية خصم', icon: MinusCircle },
                  { id: 'adjustments_statement', label: '11- بيان التسويات', icon: FileText },
                  { id: 'item_card', label: '12- كارت الصنف', icon: QrCode },
                  { id: 'item_inquiry', label: '13- استعلام صنف', icon: Search },
                  { id: 'single_warehouse_balance', label: '14- رصيد مخزن معين', icon: Building2 },
                  { id: 'all_warehouses_balances', label: '15- أرصدة المخازن', icon: Layers },
                  { id: 'movement_analysis', label: '16- تحليل الحركة', icon: TrendingUp },
                  { id: 'period_purchases', label: '17- مشتريات فترة', icon: FileSpreadsheet },
                  { id: 'period_sales', label: '18- مبيعات فترة', icon: DollarSign }
                ].map(r => {
                  const Icon = r.icon;
                  const isActive = activeReport === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setActiveReport(r.id as any)}
                      className={`p-2 rounded-xl text-center flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 font-black shadow-md scale-102'
                          : 'bg-slate-900 text-gray-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="line-clamp-1">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-Filters for Reports (Dynamic based on selected report) */}
            <div className="bg-slate-850 p-3 px-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
              <div className="flex flex-wrap items-center gap-3">
                {/* Warehouse selector for warehouse-specific reports */}
                {(activeReport === 'single_warehouse_balance' || activeReport === 'items_directory' || activeReport === 'item_inquiry') && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400 font-bold">المخزن:</span>
                    <select
                      value={reportSelectedWarehouseId}
                      onChange={e => setReportSelectedWarehouseId(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white rounded-xl px-2.5 py-1 text-xs outline-none"
                    >
                      {activeReport !== 'single_warehouse_balance' && <option value="all">كل المخازن</option>}
                      {warehouses.map(w => (
                        <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Product selector for single-item reports */}
                {(activeReport === 'item_card' || activeReport === 'item_inquiry') && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400 font-bold">الصنف:</span>
                    <select
                      value={reportSelectedProductId}
                      onChange={e => setReportSelectedProductId(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white rounded-xl px-2.5 py-1 text-xs outline-none max-w-xs"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>[{p.itemCode || p.id}] {p.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Single Transfer Slip Query */}
                {activeReport === 'single_transfer_by_num' && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400 font-bold">رقم إذن التحويل:</span>
                    <input
                      type="text"
                      placeholder="مثال: TR-2026-001"
                      value={reportTransferNumberQuery}
                      onChange={e => setReportTransferNumberQuery(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white rounded-xl px-2.5 py-1 text-xs outline-none font-mono"
                    />
                  </div>
                )}

                {/* Date range filters for period-based reports */}
                {(activeReport === 'transfers_period' || activeReport === 'period_purchases' || activeReport === 'period_sales' || activeReport === 'adjustments_all') && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-bold">من تاريخ:</span>
                    <input
                      type="date"
                      value={reportFromDate}
                      onChange={e => setReportFromDate(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white rounded-xl px-2 py-1 text-xs font-mono outline-none"
                    />
                    <span className="text-gray-400 font-bold">إلى:</span>
                    <input
                      type="date"
                      value={reportToDate}
                      onChange={e => setReportToDate(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white rounded-xl px-2 py-1 text-xs font-mono outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="text-amber-400 font-bold flex items-center gap-2">
                <span className="text-gray-400">اسم التقرير المعتمد:</span>
                <span className="bg-slate-900 px-3 py-1 rounded-xl border border-slate-700 text-white">
                  {getReportTitleText(activeReport)}
                </span>
              </div>
            </div>

            {/* Printable Report View Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-900/60">
              <div
                ref={reportContainerRef}
                className="bg-white text-gray-900 p-6 md:p-8 rounded-2xl shadow-xl font-['Cairo',sans-serif] text-right printable-report"
                dir="rtl"
              >
                {/* Official Report Header for Printing */}
                <div className="border-b-2 border-gray-900 pb-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-black text-gray-900 m-0">
                      {settings.storeName || 'سوق مصر الكبرى'}
                    </h1>
                    <h2 className="text-base font-extrabold text-gray-800 mt-1 m-0">
                      {getReportTitleText(activeReport)}
                    </h2>
                    <p className="text-xs text-gray-600 mt-0.5 m-0">
                      نظام ERP المتكامل لإدارة المخازن والجرد والمستودعات والتسويات
                    </p>
                  </div>

                  <div className="text-left text-xs text-gray-600 font-mono">
                    <div><strong>تاريخ الطباعة:</strong> {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <div><strong>رقم التقرير:</strong> REP-WH-{Date.now().toString().slice(-6)}</div>
                    <div><strong>المستخدم المسؤول:</strong> {currentUser?.name || 'مدير الحسابات والمخازن'}</div>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* 1. تقرير دليل المخازن                                    */}
                {/* ======================================================== */}
                {activeReport === 'warehouse_directory' && (
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-3 rounded-lg border border-gray-300 flex items-center justify-between text-xs font-bold">
                      <span>إجمالي عدد المخازن المكودة بالمنظومة: {warehouses.length} مخازن</span>
                      <span>إجمالي رصيد القطع بكل المخازن: {products.reduce((s, p) => s + p.stock, 0).toLocaleString()} قطعة</span>
                      <span>إجمالي تقييم بضاعة المخازن بالتكلفة: {products.reduce((s, p) => s + (p.costPrice * p.stock), 0).toLocaleString()} ج.م</span>
                    </div>

                    <table className="w-full text-right text-xs border border-gray-300 border-collapse">
                      <thead>
                        <tr className="bg-gray-200 border-b border-gray-300 font-black">
                          <th className="p-2 border border-gray-300">م</th>
                          <th className="p-2 border border-gray-300">رقم / كود المخزن</th>
                          <th className="p-2 border border-gray-300">اسم المخزن الرسمي</th>
                          <th className="p-2 border border-gray-300">موقع المخزن</th>
                          <th className="p-2 border border-gray-300 text-center">الأصناف المتوفرة</th>
                          <th className="p-2 border border-gray-300 text-center">إجمالي عدد القطع</th>
                          <th className="p-2 border border-gray-300 text-left">قيمة البضاعة بالتكلفة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {warehouses.map((wh, idx) => {
                          const itemsCount = products.filter(p => getProductStockInWarehouse(p, wh.id) > 0).length;
                          const piecesCount = products.reduce((sum, p) => sum + getProductStockInWarehouse(p, wh.id), 0);
                          const totalVal = products.reduce((sum, p) => sum + (getProductStockInWarehouse(p, wh.id) * p.costPrice), 0);
                          return (
                            <tr key={wh.id} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="p-2 border border-gray-300 font-mono text-center">{idx + 1}</td>
                              <td className="p-2 border border-gray-300 font-mono font-bold">{wh.code}</td>
                              <td className="p-2 border border-gray-300 font-bold">{wh.name}</td>
                              <td className="p-2 border border-gray-300 text-gray-700">{wh.location || 'المقر الرئيسي'}</td>
                              <td className="p-2 border border-gray-300 text-center font-mono">{itemsCount} صنف</td>
                              <td className="p-2 border border-gray-300 text-center font-mono font-bold">{piecesCount.toLocaleString()}</td>
                              <td className="p-2 border border-gray-300 text-left font-mono font-black">{totalVal.toLocaleString()} ج.م</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 2. تقرير دليل وتكويد الأصناف                             */}
                {/* ======================================================== */}
                {activeReport === 'items_directory' && (
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-3 rounded-lg border border-gray-300 flex items-center justify-between text-xs font-bold">
                      <span>إجمالي الأصناف المكودة: {products.length} صنف</span>
                      <span>المخزن المفلتر: {reportSelectedWarehouseId === 'all' ? 'جميع المخازن' : warehouses.find(w => w.id === reportSelectedWarehouseId)?.name}</span>
                    </div>

                    <table className="w-full text-right text-xs border border-gray-300 border-collapse">
                      <thead>
                        <tr className="bg-gray-200 border-b border-gray-300 font-black">
                          <th className="p-2 border border-gray-300 text-center">كود المورد</th>
                          <th className="p-2 border border-gray-300 text-center">كود الصنف</th>
                          <th className="p-2 border border-gray-300 text-center">كود اللون</th>
                          <th className="p-2 border border-gray-300">اسم الصنف</th>
                          <th className="p-2 border border-gray-300">الماركة</th>
                          <th className="p-2 border border-gray-300 text-center">سعر الشراء</th>
                          <th className="p-2 border border-gray-300 text-center">سعر البيع</th>
                          <th className="p-2 border border-gray-300 text-center">الرصيد الفعلي</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(p => {
                          const stockDisplay = reportSelectedWarehouseId === 'all'
                            ? p.stock
                            : getProductStockInWarehouse(p, reportSelectedWarehouseId);
                          return (
                            <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="p-2 border border-gray-300 font-mono text-center font-bold text-gray-700">{p.supplierCode || '100010'}</td>
                              <td className="p-2 border border-gray-300 font-mono text-center font-black text-gray-900">{p.itemCode || p.id}</td>
                              <td className="p-2 border border-gray-300 font-mono text-center text-gray-700">{p.colorCode || '900101'}</td>
                              <td className="p-2 border border-gray-300 font-bold">{p.name}</td>
                              <td className="p-2 border border-gray-300 text-gray-700">{p.brand}</td>
                              <td className="p-2 border border-gray-300 text-center font-mono font-bold">{p.costPrice.toLocaleString()} ج.م</td>
                              <td className="p-2 border border-gray-300 text-center font-mono font-black">{p.price.toLocaleString()} ج.م</td>
                              <td className="p-2 border border-gray-300 text-center font-mono font-black text-gray-900">{stockDisplay} قطعة</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 3. تقرير أسعار المشتريات                                */}
                {/* ======================================================== */}
                {activeReport === 'purchase_prices' && (
                  <div className="space-y-4">
                    <table className="w-full text-right text-xs border border-gray-300 border-collapse">
                      <thead>
                        <tr className="bg-gray-200 border-b border-gray-300 font-black">
                          <th className="p-2 border border-gray-300 text-center">كود الصنف</th>
                          <th className="p-2 border border-gray-300">اسم الصنف</th>
                          <th className="p-2 border border-gray-300 text-center">سعر الشراء (التكلفة)</th>
                          <th className="p-2 border border-gray-300 text-center">سعر البيع الحالي</th>
                          <th className="p-2 border border-gray-300 text-center">فارق الربح للقطعة</th>
                          <th className="p-2 border border-gray-300 text-center">نسبة هامش الربح</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(p => {
                          const profitMargin = Math.max(0, p.price - p.costPrice);
                          const profitPercent = p.costPrice > 0 ? Math.round((profitMargin / p.costPrice) * 100) : 0;
                          return (
                            <tr key={p.id} className="border-b border-gray-200">
                              <td className="p-2 border border-gray-300 font-mono text-center font-bold">{p.itemCode || p.id}</td>
                              <td className="p-2 border border-gray-300 font-bold">{p.name}</td>
                              <td className="p-2 border border-gray-300 text-center font-mono font-black">{p.costPrice.toLocaleString()} ج.م</td>
                              <td className="p-2 border border-gray-300 text-center font-mono font-bold">{p.price.toLocaleString()} ج.م</td>
                              <td className="p-2 border border-gray-300 text-center font-mono font-bold text-emerald-800">+{profitMargin.toLocaleString()} ج.م</td>
                              <td className="p-2 border border-gray-300 text-center font-mono font-bold">%{profitPercent}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 4. تقرير أسعار المبيعات                                  */}
                {/* ======================================================== */}
                {activeReport === 'sales_prices' && (
                  <div className="space-y-4">
                    <table className="w-full text-right text-xs border border-gray-300 border-collapse">
                      <thead>
                        <tr className="bg-gray-200 border-b border-gray-300 font-black">
                          <th className="p-2 border border-gray-300 text-center">كود الصنف</th>
                          <th className="p-2 border border-gray-300">اسم الصنف</th>
                          <th className="p-2 border border-gray-300 text-center">السعر قبل الخصم</th>
                          <th className="p-2 border border-gray-300 text-center">السعر بعد الخصم (الحالي)</th>
                          <th className="p-2 border border-gray-300 text-center">قيمة الخصم</th>
                          <th className="p-2 border border-gray-300 text-center">نسبة الخصم</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(p => {
                          const orig = p.originalPrice || p.price;
                          const discountVal = Math.max(0, orig - p.price);
                          const discountPercent = orig > 0 ? Math.round((discountVal / orig) * 100) : 0;
                          return (
                            <tr key={p.id} className="border-b border-gray-200">
                              <td className="p-2 border border-gray-300 font-mono text-center font-bold">{p.itemCode || p.id}</td>
                              <td className="p-2 border border-gray-300 font-bold">{p.name}</td>
                              <td className="p-2 border border-gray-300 text-center font-mono text-gray-600 line-through">{orig.toLocaleString()} ج.م</td>
                              <td className="p-2 border border-gray-300 text-center font-mono font-black">{p.price.toLocaleString()} ج.م</td>
                              <td className="p-2 border border-gray-300 text-center font-mono font-bold">{discountVal.toLocaleString()} ج.م</td>
                              <td className="p-2 border border-gray-300 text-center font-mono font-bold text-rose-800">%{discountPercent}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 5. تقرير تحويلات المخازن                                */}
                {/* ======================================================== */}
                {activeReport === 'transfers_log' && (
                  <div className="space-y-4">
                    <table className="w-full text-right text-xs border border-gray-300 border-collapse">
                      <thead>
                        <tr className="bg-gray-200 border-b border-gray-300 font-black">
                          <th className="p-2 border border-gray-300 text-center">رقم الإذن</th>
                          <th className="p-2 border border-gray-300 text-center">التاريخ</th>
                          <th className="p-2 border border-gray-300">المخزن المصدر</th>
                          <th className="p-2 border border-gray-300">المخزن المحول إليه</th>
                          <th className="p-2 border border-gray-300">الصنف المحول</th>
                          <th className="p-2 border border-gray-300 text-center">الكمية</th>
                          <th className="p-2 border border-gray-300">الموظف المسجل</th>
                          <th className="p-2 border border-gray-300">البيان والملاحظات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {warehouseTransfers.map(tr => (
                          <tr key={tr.id} className="border-b border-gray-200">
                            <td className="p-2 border border-gray-300 font-mono font-bold text-center">{tr.transferNumber}</td>
                            <td className="p-2 border border-gray-300 font-mono text-center">{tr.date}</td>
                            <td className="p-2 border border-gray-300">{tr.fromWarehouseName}</td>
                            <td className="p-2 border border-gray-300 font-bold">{tr.toWarehouseName}</td>
                            <td className="p-2 border border-gray-300 font-bold">{tr.productName}</td>
                            <td className="p-2 border border-gray-300 text-center font-mono font-black">{tr.quantity} قطعة</td>
                            <td className="p-2 border border-gray-300">{tr.employeeName || 'أمين المستودع'}</td>
                            <td className="p-2 border border-gray-300 text-gray-700">{tr.notes || 'تحويل داخلي'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 6. تقرير عن تحويل معين برقم التحويل                     */}
                {/* ======================================================== */}
                {activeReport === 'single_transfer_by_num' && (
                  <div className="space-y-4">
                    {(() => {
                      const targetTr = warehouseTransfers.find(
                        tr => tr.transferNumber.toLowerCase().includes(reportTransferNumberQuery.trim().toLowerCase())
                      ) || warehouseTransfers[0];

                      if (!targetTr) {
                        return <div className="p-4 text-center text-gray-500">لا يوجد إذن تحويل مطابق</div>;
                      }

                      return (
                        <div className="border-2 border-gray-900 p-6 rounded-xl space-y-4">
                          <div className="flex items-center justify-between border-b border-gray-400 pb-3">
                            <div>
                              <span className="text-xs text-gray-500 block">سند إذن تحويل مخزني معتمد</span>
                              <span className="text-lg font-black font-mono">رقم الإذن: {targetTr.transferNumber}</span>
                            </div>
                            <div className="text-left font-mono text-xs">
                              <div><strong>تاريخ التحويل:</strong> {targetTr.date}</div>
                              <div><strong>مسجل الإذن:</strong> {targetTr.employeeName || 'محمد عبد الفتاح'}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-300 text-xs">
                            <div>
                              <strong className="block text-gray-600 mb-1">المستودع المصدر (تم الخصم منه):</strong>
                              <span className="text-sm font-bold block">{targetTr.fromWarehouseName}</span>
                            </div>
                            <div>
                              <strong className="block text-gray-600 mb-1">المستودع الوجهة (تمت الإضافة إليه):</strong>
                              <span className="text-sm font-bold block">{targetTr.toWarehouseName}</span>
                            </div>
                          </div>

                          <table className="w-full text-right text-xs border border-gray-300 border-collapse">
                            <thead>
                              <tr className="bg-gray-200">
                                <th className="p-2.5 border border-gray-300">م</th>
                                <th className="p-2.5 border border-gray-300">اسم الصنف المحول</th>
                                <th className="p-2.5 border border-gray-300 text-center">الكمية المحولة</th>
                                <th className="p-2.5 border border-gray-300">ملاحظات التحويل</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="p-2.5 border border-gray-300 font-mono text-center">1</td>
                                <td className="p-2.5 border border-gray-300 font-bold">{targetTr.productName}</td>
                                <td className="p-2.5 border border-gray-300 text-center font-mono font-black text-sm">{targetTr.quantity} قطعة</td>
                                <td className="p-2.5 border border-gray-300 text-gray-700">{targetTr.notes || 'سند تسليم واستلام رسمي'}</td>
                              </tr>
                            </tbody>
                          </table>

                          <div className="grid grid-cols-3 gap-6 pt-6 text-center text-xs text-gray-700">
                            <div className="border-t border-gray-400 pt-2">
                              <span>توقيع أمين المخزن المصدر</span>
                              <div className="h-8"></div>
                            </div>
                            <div className="border-t border-gray-400 pt-2">
                              <span>توقيع سائق / مندوب النقل</span>
                              <div className="h-8"></div>
                            </div>
                            <div className="border-t border-gray-400 pt-2">
                              <span>توقيع واستلام أمين مخزن الوجهة</span>
                              <div className="h-8"></div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* ======================================================== */}
                {/* 7. تقرير التحويلات خلال فترة معينة                      */}
                {/* ======================================================== */}
                {activeReport === 'transfers_period' && (
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-xs font-bold flex items-center justify-between">
                      <span>الفترة من: {reportFromDate} إلى: {reportToDate}</span>
                      <span>
                        إجمالي التحويلات: {
                          warehouseTransfers.filter(tr => (!reportFromDate || tr.date >= reportFromDate) && (!reportToDate || tr.date <= reportToDate)).length
                        } إذن تحويل
                      </span>
                    </div>

                    <table className="w-full text-right text-xs border border-gray-300 border-collapse">
                      <thead>
                        <tr className="bg-gray-200 border-b border-gray-300 font-black">
                          <th className="p-2 border border-gray-300 text-center">رقم التحويل</th>
                          <th className="p-2 border border-gray-300 text-center">التاريخ</th>
                          <th className="p-2 border border-gray-300">من مخزن</th>
                          <th className="p-2 border border-gray-300">إلى مخزن</th>
                          <th className="p-2 border border-gray-300">الصنف</th>
                          <th className="p-2 border border-gray-300 text-center">الكمية</th>
                        </tr>
                      </thead>
                      <tbody>
                        {warehouseTransfers
                          .filter(tr => (!reportFromDate || tr.date >= reportFromDate) && (!reportToDate || tr.date <= reportToDate))
                          .map(tr => (
                            <tr key={tr.id} className="border-b border-gray-200">
                              <td className="p-2 border border-gray-300 font-mono font-bold text-center">{tr.transferNumber}</td>
                              <td className="p-2 border border-gray-300 font-mono text-center">{tr.date}</td>
                              <td className="p-2 border border-gray-300">{tr.fromWarehouseName}</td>
                              <td className="p-2 border border-gray-300 font-bold">{tr.toWarehouseName}</td>
                              <td className="p-2 border border-gray-300 font-bold">{tr.productName}</td>
                              <td className="p-2 border border-gray-300 text-center font-mono font-black">{tr.quantity} قطعة</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 8. تقرير عن التسويات (إضافة وخصم)                        */}
                {/* ======================================================== */}
                {activeReport === 'adjustments_all' && (
                  <div className="space-y-4">
                    <table className="w-full text-right text-xs border border-gray-300 border-collapse">
                      <thead>
                        <tr className="bg-gray-200 border-b border-gray-300 font-black">
                          <th className="p-2 border border-gray-300 text-center">رقم الإذن</th>
                          <th className="p-2 border border-gray-300 text-center">النوع</th>
                          <th className="p-2 border border-gray-300 text-center">التاريخ</th>
                          <th className="p-2 border border-gray-300">المخزن</th>
                          <th className="p-2 border border-gray-300">الصنف</th>
                          <th className="p-2 border border-gray-300 text-center">الكمية</th>
                          <th className="p-2 border border-gray-300 text-left">إجمالي التكلفة</th>
                          <th className="p-2 border border-gray-300">سبب التسوية</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventoryAdjustments.map(adj => (
                          <tr key={adj.id} className="border-b border-gray-200">
                            <td className="p-2 border border-gray-300 font-mono font-bold text-center">{adj.adjustmentNumber}</td>
                            <td className="p-2 border border-gray-300 text-center font-bold">
                              <span className={adj.type === 'addition' ? 'text-emerald-800' : 'text-rose-800'}>
                                {adj.type === 'addition' ? 'تسوية إضافة (+)' : 'تسوية خصم (-)'}
                              </span>
                            </td>
                            <td className="p-2 border border-gray-300 font-mono text-center">{adj.date}</td>
                            <td className="p-2 border border-gray-300">{adj.warehouseName}</td>
                            <td className="p-2 border border-gray-300 font-bold">{adj.productName}</td>
                            <td className="p-2 border border-gray-300 text-center font-mono font-black">{adj.quantity}</td>
                            <td className="p-2 border border-gray-300 text-left font-mono font-black">{adj.totalCost.toLocaleString()} ج.م</td>
                            <td className="p-2 border border-gray-300 text-gray-700">{adj.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 9. تقرير عن تسوية إضافة                                  */}
                {/* ======================================================== */}
                {activeReport === 'adjustments_add' && (
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-lg text-xs font-bold text-emerald-950 flex items-center justify-between">
                      <span>بيان تسويات الإضافة المخزنية (زيادة الرصيد الفعلي)</span>
                      <span>إجمالي القيمة المضافة: {inventoryAdjustments.filter(a => a.type === 'addition').reduce((s, a) => s + a.totalCost, 0).toLocaleString()} ج.م</span>
                    </div>

                    <table className="w-full text-right text-xs border border-gray-300 border-collapse">
                      <thead>
                        <tr className="bg-gray-200 font-black">
                          <th className="p-2 border border-gray-300 text-center">رقم الإذن</th>
                          <th className="p-2 border border-gray-300 text-center">التاريخ</th>
                          <th className="p-2 border border-gray-300">المخزن</th>
                          <th className="p-2 border border-gray-300">اسم الصنف</th>
                          <th className="p-2 border border-gray-300 text-center">الكمية المضافة</th>
                          <th className="p-2 border border-gray-300 text-center">سعر التكلفة</th>
                          <th className="p-2 border border-gray-300 text-left">الإجمالي</th>
                          <th className="p-2 border border-gray-300">السبب والبيان</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventoryAdjustments.filter(a => a.type === 'addition').map(adj => (
                          <tr key={adj.id} className="border-b border-gray-200">
                            <td className="p-2 border border-gray-300 font-mono font-bold text-center">{adj.adjustmentNumber}</td>
                            <td className="p-2 border border-gray-300 font-mono text-center">{adj.date}</td>
                            <td className="p-2 border border-gray-300">{adj.warehouseName}</td>
                            <td className="p-2 border border-gray-300 font-bold">{adj.productName}</td>
                            <td className="p-2 border border-gray-300 text-center font-mono font-black text-emerald-800">+{adj.quantity}</td>
                            <td className="p-2 border border-gray-300 text-center font-mono">{adj.unitCost.toLocaleString()} ج.م</td>
                            <td className="p-2 border border-gray-300 text-left font-mono font-black">{adj.totalCost.toLocaleString()} ج.م</td>
                            <td className="p-2 border border-gray-300 text-gray-700">{adj.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 10. تقرير عن تسوية خصم                                  */}
                {/* ======================================================== */}
                {activeReport === 'adjustments_deduct' && (
                  <div className="space-y-4">
                    <div className="bg-rose-50 border border-rose-300 p-3 rounded-lg text-xs font-bold text-rose-950 flex items-center justify-between">
                      <span>بيان تسويات الخصم والعجز والتوالف المخزنية</span>
                      <span>إجمالي قيمة الخصم: {inventoryAdjustments.filter(a => a.type === 'deduction').reduce((s, a) => s + a.totalCost, 0).toLocaleString()} ج.م</span>
                    </div>

                    <table className="w-full text-right text-xs border border-gray-300 border-collapse">
                      <thead>
                        <tr className="bg-gray-200 font-black">
                          <th className="p-2 border border-gray-300 text-center">رقم الإذن</th>
                          <th className="p-2 border border-gray-300 text-center">التاريخ</th>
                          <th className="p-2 border border-gray-300">المخزن</th>
                          <th className="p-2 border border-gray-300">اسم الصنف</th>
                          <th className="p-2 border border-gray-300 text-center">الكمية المخصومة</th>
                          <th className="p-2 border border-gray-300 text-center">سعر التكلفة</th>
                          <th className="p-2 border border-gray-300 text-left">إجمالي الخسارة</th>
                          <th className="p-2 border border-gray-300">السبب ورقم المحضر</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventoryAdjustments.filter(a => a.type === 'deduction').map(adj => (
                          <tr key={adj.id} className="border-b border-gray-200">
                            <td className="p-2 border border-gray-300 font-mono font-bold text-center">{adj.adjustmentNumber}</td>
                            <td className="p-2 border border-gray-300 font-mono text-center">{adj.date}</td>
                            <td className="p-2 border border-gray-300">{adj.warehouseName}</td>
                            <td className="p-2 border border-gray-300 font-bold">{adj.productName}</td>
                            <td className="p-2 border border-gray-300 text-center font-mono font-black text-rose-800">-{adj.quantity}</td>
                            <td className="p-2 border border-gray-300 text-center font-mono">{adj.unitCost.toLocaleString()} ج.م</td>
                            <td className="p-2 border border-gray-300 text-left font-mono font-black text-rose-800">{adj.totalCost.toLocaleString()} ج.م</td>
                            <td className="p-2 border border-gray-300 text-gray-700">{adj.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 11. بيان عن التسويات                                    */}
                {/* ======================================================== */}
                {activeReport === 'adjustments_statement' && (
                  <div className="space-y-4">
                    {(() => {
                      const addCount = inventoryAdjustments.filter(a => a.type === 'addition').length;
                      const addPieces = inventoryAdjustments.filter(a => a.type === 'addition').reduce((s, a) => s + a.quantity, 0);
                      const addVal = inventoryAdjustments.filter(a => a.type === 'addition').reduce((s, a) => s + a.totalCost, 0);

                      const deductCount = inventoryAdjustments.filter(a => a.type === 'deduction').length;
                      const deductPieces = inventoryAdjustments.filter(a => a.type === 'deduction').reduce((s, a) => s + a.quantity, 0);
                      const deductVal = inventoryAdjustments.filter(a => a.type === 'deduction').reduce((s, a) => s + a.totalCost, 0);

                      const netPieces = addPieces - deductPieces;
                      const netVal = addVal - deductVal;

                      return (
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 text-center text-xs">
                            <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl">
                              <span className="text-gray-600 block">إجمالي تسويات الإضافة:</span>
                              <span className="text-base font-black text-emerald-800 font-mono block">+{addPieces} قطعة</span>
                              <span className="text-[11px] text-gray-600 font-mono">بقيمة: {addVal.toLocaleString()} ج.م</span>
                            </div>
                            <div className="bg-rose-50 border border-rose-300 p-3 rounded-xl">
                              <span className="text-gray-600 block">إجمالي تسويات الخصم:</span>
                              <span className="text-base font-black text-rose-800 font-mono block">-{deductPieces} قطعة</span>
                              <span className="text-[11px] text-gray-600 font-mono">بقيمة: {deductVal.toLocaleString()} ج.م</span>
                            </div>
                            <div className="bg-gray-100 border border-gray-300 p-3 rounded-xl">
                              <span className="text-gray-600 block">صافي الأثر المخزني:</span>
                              <span className={`text-base font-black font-mono block ${netPieces >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
                                {netPieces >= 0 ? `+${netPieces}` : netPieces} قطعة
                              </span>
                              <span className="text-[11px] text-gray-600 font-mono">فارق: {netVal.toLocaleString()} ج.م</span>
                            </div>
                          </div>

                          <table className="w-full text-right text-xs border border-gray-300 border-collapse mt-4">
                            <thead>
                              <tr className="bg-gray-200 font-black">
                                <th className="p-2 border border-gray-300">نوع التسوية</th>
                                <th className="p-2 border border-gray-300 text-center">عدد الأذون</th>
                                <th className="p-2 border border-gray-300 text-center">إجمالي القطع</th>
                                <th className="p-2 border border-gray-300 text-left">القيمة الإجمالية</th>
                                <th className="p-2 border border-gray-300">التوجيه المحاسبي المعتمد</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="p-2 border border-gray-300 font-bold text-emerald-800">تسويات الإضافة الفائضة</td>
                                <td className="p-2 border border-gray-300 font-mono text-center">{addCount} إذن</td>
                                <td className="p-2 border border-gray-300 font-mono text-center font-bold">+{addPieces}</td>
                                <td className="p-2 border border-gray-300 font-mono text-left font-black">{addVal.toLocaleString()} ج.م</td>
                                <td className="p-2 border border-gray-300 text-gray-700">حـ/ أرباح تسويات وفروق جرد (40301)</td>
                              </tr>
                              <tr>
                                <td className="p-2 border border-gray-300 font-bold text-rose-800">تسويات الخصم والعجز</td>
                                <td className="p-2 border border-gray-300 font-mono text-center">{deductCount} إذن</td>
                                <td className="p-2 border border-gray-300 font-mono text-center font-bold">-{deductPieces}</td>
                                <td className="p-2 border border-gray-300 font-mono text-left font-black">{deductVal.toLocaleString()} ج.م</td>
                                <td className="p-2 border border-gray-300 text-gray-700">حـ/ خسائر عجز وتلفيات المخزون (50301)</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* ======================================================== */}
                {/* 12. تقرير كارت الصنف (Stock Movement Ledger)             */}
                {/* ======================================================== */}
                {activeReport === 'item_card' && (
                  <div className="space-y-4">
                    {(() => {
                      const prod = products.find(p => p.id === reportSelectedProductId) || products[0];
                      if (!prod) return null;

                      const prodTransfersIn = warehouseTransfers.filter(t => t.productId === prod.id);
                      const prodAdjustments = inventoryAdjustments.filter(a => a.productId === prod.id);

                      return (
                        <div className="space-y-4">
                          <div className="bg-gray-100 p-4 rounded-xl border border-gray-300 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div>
                              <span className="text-gray-500 block">اسم الصنف:</span>
                              <strong className="text-sm block">{prod.name}</strong>
                            </div>
                            <div>
                              <span className="text-gray-500 block">كود الصنف / المورد / اللون:</span>
                              <strong className="font-mono text-sm block">
                                {prod.itemCode || prod.id} | {prod.supplierCode || '100010'} | {prod.colorCode || '900101'}
                              </strong>
                            </div>
                            <div>
                              <span className="text-gray-500 block">سعر التكلفة / البيع:</span>
                              <strong className="font-mono text-sm block">
                                {prod.costPrice} / {prod.price} ج.م
                              </strong>
                            </div>
                            <div>
                              <span className="text-gray-500 block">الرصيد الفعلي الحالي:</span>
                              <strong className="font-mono text-base font-black text-gray-900 block">
                                {prod.stock} قطعة
                              </strong>
                            </div>
                          </div>

                          <h4 className="font-black text-xs text-gray-800">حركات الصنف التاريخية والترحيل للمخازن:</h4>
                          <table className="w-full text-right text-xs border border-gray-300 border-collapse">
                            <thead>
                              <tr className="bg-gray-200 font-black">
                                <th className="p-2 border border-gray-300 text-center">التاريخ</th>
                                <th className="p-2 border border-gray-300">نوع الحركة والمستند</th>
                                <th className="p-2 border border-gray-300">المخزن المعني</th>
                                <th className="p-2 border border-gray-300 text-center">وارد (+)</th>
                                <th className="p-2 border border-gray-300 text-center">صادر (-)</th>
                                <th className="p-2 border border-gray-300 text-center">الرصيد التراكمي</th>
                                <th className="p-2 border border-gray-300">البيان</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Opening Balance */}
                              <tr className="bg-amber-50">
                                <td className="p-2 border border-gray-300 font-mono text-center">2026-10-01</td>
                                <td className="p-2 border border-gray-300 font-bold">رصيد افتتاحي أول المدة</td>
                                <td className="p-2 border border-gray-300">المخزن الرئيسي</td>
                                <td className="p-2 border border-gray-300 text-center font-mono font-bold text-emerald-800">+{prod.openingStock || prod.stock}</td>
                                <td className="p-2 border border-gray-300 text-center font-mono">-</td>
                                <td className="p-2 border border-gray-300 text-center font-mono font-black">{prod.openingStock || prod.stock}</td>
                                <td className="p-2 border border-gray-300 text-gray-700">افتتاح منظومة ERP</td>
                              </tr>

                              {/* Adjustments */}
                              {prodAdjustments.map(adj => (
                                <tr key={adj.id}>
                                  <td className="p-2 border border-gray-300 font-mono text-center">{adj.date}</td>
                                  <td className="p-2 border border-gray-300 font-bold">
                                    {adj.type === 'addition' ? `تسوية إضافة #${adj.adjustmentNumber}` : `تسوية خصم #${adj.adjustmentNumber}`}
                                  </td>
                                  <td className="p-2 border border-gray-300">{adj.warehouseName}</td>
                                  <td className="p-2 border border-gray-300 text-center font-mono font-bold text-emerald-800">
                                    {adj.type === 'addition' ? `+${adj.quantity}` : '-'}
                                  </td>
                                  <td className="p-2 border border-gray-300 text-center font-mono font-bold text-rose-800">
                                    {adj.type === 'deduction' ? `-${adj.quantity}` : '-'}
                                  </td>
                                  <td className="p-2 border border-gray-300 text-center font-mono font-bold">{prod.stock}</td>
                                  <td className="p-2 border border-gray-300 text-gray-700">{adj.reason}</td>
                                </tr>
                              ))}

                              {/* Transfers */}
                              {prodTransfersIn.map(tr => (
                                <tr key={tr.id}>
                                  <td className="p-2 border border-gray-300 font-mono text-center">{tr.date}</td>
                                  <td className="p-2 border border-gray-300 font-bold">إذن تحويل #{tr.transferNumber}</td>
                                  <td className="p-2 border border-gray-300">من {tr.fromWarehouseName} إلى {tr.toWarehouseName}</td>
                                  <td className="p-2 border border-gray-300 text-center font-mono text-teal-800 font-bold">+{tr.quantity}</td>
                                  <td className="p-2 border border-gray-300 text-center font-mono text-teal-800 font-bold">-{tr.quantity}</td>
                                  <td className="p-2 border border-gray-300 text-center font-mono font-bold">{prod.stock}</td>
                                  <td className="p-2 border border-gray-300 text-gray-700">{tr.notes}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* ======================================================== */}
                {/* 13. زر الاستعلام عن صنف بالمخازن                         */}
                {/* ======================================================== */}
                {activeReport === 'item_inquiry' && (
                  <div className="space-y-4">
                    {(() => {
                      const prod = products.find(p => p.id === reportSelectedProductId) || products[0];
                      if (!prod) return null;

                      return (
                        <div className="space-y-4">
                          <div className="bg-gray-100 p-4 rounded-xl border border-gray-300 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img src={prod.image} alt={prod.name} className="w-12 h-12 object-contain bg-white p-1 rounded-lg border border-gray-300" />
                              <div>
                                <h3 className="font-bold text-sm text-gray-900">{prod.name}</h3>
                                <div className="text-xs text-gray-600 font-mono space-x-2 space-x-reverse mt-1">
                                  <span>كود المورد: <strong>{prod.supplierCode || '100010'}</strong></span>
                                  <span>| كود الصنف: <strong>{prod.itemCode || prod.id}</strong></span>
                                  <span>| كود اللون: <strong>{prod.colorCode || '900101'}</strong></span>
                                </div>
                              </div>
                            </div>

                            <div className="text-left font-mono">
                              <span className="text-xs text-gray-500 block">إجمالي الرصيد العام:</span>
                              <span className="text-xl font-black text-gray-900">{prod.stock} قطعة</span>
                            </div>
                          </div>

                          <h4 className="font-black text-xs text-gray-800">توزيع الصنف المباشر على المخازن:</h4>
                          <table className="w-full text-right text-xs border border-gray-300 border-collapse">
                            <thead>
                              <tr className="bg-gray-200 font-black">
                                <th className="p-2.5 border border-gray-300 text-center">كود المخزن</th>
                                <th className="p-2.5 border border-gray-300">اسم المخزن والمستودع</th>
                                <th className="p-2.5 border border-gray-300">الموقع الجغرافي</th>
                                <th className="p-2.5 border border-gray-300 text-center">الكمية المتوفرة بالمخزن</th>
                                <th className="p-2.5 border border-gray-300 text-left">قيمة المخزون بالتكلفة</th>
                              </tr>
                            </thead>
                            <tbody>
                              {warehouses.map(wh => {
                                const qty = getProductStockInWarehouse(prod, wh.id);
                                return (
                                  <tr key={wh.id} className="border-b border-gray-200">
                                    <td className="p-2.5 border border-gray-300 font-mono font-bold text-center">{wh.code}</td>
                                    <td className="p-2.5 border border-gray-300 font-bold">{wh.name}</td>
                                    <td className="p-2.5 border border-gray-300 text-gray-600">{wh.location || 'الفرع الرئيسي'}</td>
                                    <td className="p-2.5 border border-gray-300 text-center font-mono font-black text-sm">{qty} قطعة</td>
                                    <td className="p-2.5 border border-gray-300 text-left font-mono font-bold">{(qty * prod.costPrice).toLocaleString()} ج.م</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* ======================================================== */}
                {/* 14. تقرير عن رصيد مخزن معين                              */}
                {/* ======================================================== */}
                {activeReport === 'single_warehouse_balance' && (
                  <div className="space-y-4">
                    {(() => {
                      const targetWh = warehouses.find(w => w.id === reportSelectedWarehouseId) || warehouses[0];
                      const whItems = products.filter(p => getProductStockInWarehouse(p, targetWh.id) > 0);
                      const totalPieces = whItems.reduce((s, p) => s + getProductStockInWarehouse(p, targetWh.id), 0);
                      const totalCost = whItems.reduce((s, p) => s + (getProductStockInWarehouse(p, targetWh.id) * p.costPrice), 0);

                      return (
                        <div className="space-y-4">
                          <div className="bg-gray-100 p-3 rounded-lg border border-gray-300 flex items-center justify-between text-xs font-bold">
                            <span>جرد تفصيلي للمخزن: <strong>{targetWh.name} ({targetWh.code})</strong></span>
                            <span>إجمالي الأصناف: <strong>{whItems.length}</strong></span>
                            <span>إجمالي القطع: <strong>{totalPieces.toLocaleString()}</strong></span>
                            <span>إجمالي التكلفة: <strong>{totalCost.toLocaleString()} ج.م</strong></span>
                          </div>

                          <table className="w-full text-right text-xs border border-gray-300 border-collapse">
                            <thead>
                              <tr className="bg-gray-200 font-black">
                                <th className="p-2 border border-gray-300 text-center">كود الصنف</th>
                                <th className="p-2 border border-gray-300">اسم الصنف</th>
                                <th className="p-2 border border-gray-300">الماركة</th>
                                <th className="p-2 border border-gray-300 text-center">الرصيد بهذا المخزن</th>
                                <th className="p-2 border border-gray-300 text-center">سعر التكلفة</th>
                                <th className="p-2 border border-gray-300 text-left">إجمالي القيمة</th>
                              </tr>
                            </thead>
                            <tbody>
                              {whItems.map(p => {
                                const qty = getProductStockInWarehouse(p, targetWh.id);
                                return (
                                  <tr key={p.id} className="border-b border-gray-200">
                                    <td className="p-2 border border-gray-300 font-mono font-bold text-center">{p.itemCode || p.id}</td>
                                    <td className="p-2 border border-gray-300 font-bold">{p.name}</td>
                                    <td className="p-2 border border-gray-300 text-gray-700">{p.brand}</td>
                                    <td className="p-2 border border-gray-300 text-center font-mono font-black">{qty} قطعة</td>
                                    <td className="p-2 border border-gray-300 text-center font-mono">{p.costPrice.toLocaleString()} ج.م</td>
                                    <td className="p-2 border border-gray-300 text-left font-mono font-black">{(qty * p.costPrice).toLocaleString()} ج.م</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* ======================================================== */}
                {/* 15. تقرير عن ارصدة المخازن (مصفوفة مجمعة)                */}
                {/* ======================================================== */}
                {activeReport === 'all_warehouses_balances' && (
                  <div className="space-y-4">
                    <table className="w-full text-right text-xs border border-gray-300 border-collapse">
                      <thead>
                        <tr className="bg-gray-200 font-black">
                          <th className="p-2 border border-gray-300 text-center">كود الصنف</th>
                          <th className="p-2 border border-gray-300">اسم الصنف</th>
                          <th className="p-2 border border-gray-300 text-center">إجمالي الرصيد</th>
                          {warehouses.map(w => (
                            <th key={w.id} className="p-2 border border-gray-300 text-center font-mono">
                              {w.name}
                            </th>
                          ))}
                          <th className="p-2 border border-gray-300 text-left">القيمة الإجمالية</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(p => (
                          <tr key={p.id} className="border-b border-gray-200">
                            <td className="p-2 border border-gray-300 font-mono font-bold text-center">{p.itemCode || p.id}</td>
                            <td className="p-2 border border-gray-300 font-bold">{p.name}</td>
                            <td className="p-2 border border-gray-300 text-center font-mono font-black bg-gray-50">{p.stock}</td>
                            {warehouses.map(w => (
                              <td key={w.id} className="p-2 border border-gray-300 text-center font-mono">
                                {getProductStockInWarehouse(p, w.id)}
                              </td>
                            ))}
                            <td className="p-2 border border-gray-300 text-left font-mono font-black">{(p.stock * p.costPrice).toLocaleString()} ج.م</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 16. تقرير عن تحليل حركة الاصناف (سريع / راكد)             */}
                {/* ======================================================== */}
                {activeReport === 'movement_analysis' && (
                  <div className="space-y-4">
                    <table className="w-full text-right text-xs border border-gray-300 border-collapse">
                      <thead>
                        <tr className="bg-gray-200 font-black">
                          <th className="p-2 border border-gray-300 text-center">كود الصنف</th>
                          <th className="p-2 border border-gray-300">اسم الصنف</th>
                          <th className="p-2 border border-gray-300 text-center">الرصيد الحالي</th>
                          <th className="p-2 border border-gray-300 text-center">تصنيف الحركة</th>
                          <th className="p-2 border border-gray-300 text-center">معدل الدوران</th>
                          <th className="p-2 border border-gray-300">التوصية المخزنية</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p, idx) => {
                          const isFast = idx % 3 === 0;
                          const isSlow = idx % 3 === 1;
                          return (
                            <tr key={p.id} className="border-b border-gray-200">
                              <td className="p-2 border border-gray-300 font-mono font-bold text-center">{p.itemCode || p.id}</td>
                              <td className="p-2 border border-gray-300 font-bold">{p.name}</td>
                              <td className="p-2 border border-gray-300 text-center font-mono font-black">{p.stock} قطعة</td>
                              <td className="p-2 border border-gray-300 text-center font-bold">
                                {isFast ? (
                                  <span className="text-emerald-800">سريع الحركة (Fast)</span>
                                ) : isSlow ? (
                                  <span className="text-amber-800">متوسط الحركة</span>
                                ) : (
                                  <span className="text-rose-800">راكد (Slow-moving)</span>
                                )}
                              </td>
                              <td className="p-2 border border-gray-300 text-center font-mono">
                                {isFast ? 'مرتفع جداً (أكثر من 4 مرات/شهر)' : isSlow ? 'متوسط (مرة/شهر)' : 'منخفض (أقل من 0.2)'}
                              </td>
                              <td className="p-2 border border-gray-300 text-gray-700">
                                {isFast ? 'إعادة طلب وتأمين حد الطلب' : isSlow ? 'متابعة وتثبيت الرصيد' : 'عمل عروض تخفيض لتصريف الرصيد'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 17. تقرير عن مشتريات فترة                               */}
                {/* ======================================================== */}
                {activeReport === 'period_purchases' && (
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-3 rounded-lg border border-gray-300 flex items-center justify-between text-xs font-bold">
                      <span>الفترة من: {reportFromDate} إلى: {reportToDate}</span>
                      <span>
                        إجمالي فواتير الشراء: {
                          supplierInvoices.filter(inv => inv.type !== 'return' && (!reportFromDate || inv.date >= reportFromDate) && (!reportToDate || inv.date <= reportToDate)).length
                        } فاتورة
                      </span>
                    </div>

                    <table className="w-full text-right text-xs border border-gray-300 border-collapse">
                      <thead>
                        <tr className="bg-gray-200 font-black">
                          <th className="p-2 border border-gray-300 text-center">رقم الفاتورة</th>
                          <th className="p-2 border border-gray-300 text-center">التاريخ</th>
                          <th className="p-2 border border-gray-300">اسم المورد</th>
                          <th className="p-2 border border-gray-300">بيان الوارد</th>
                          <th className="p-2 border border-gray-300 text-left">إجمالي الفاتورة</th>
                          <th className="p-2 border border-gray-300 text-center">الموظف المدخل</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supplierInvoices
                          .filter(inv => inv.type !== 'return' && (!reportFromDate || inv.date >= reportFromDate) && (!reportToDate || inv.date <= reportToDate))
                          .map(inv => (
                            <tr key={inv.id} className="border-b border-gray-200">
                              <td className="p-2 border border-gray-300 font-mono font-bold text-center">{inv.invoiceNumber}</td>
                              <td className="p-2 border border-gray-300 font-mono text-center">{inv.date}</td>
                              <td className="p-2 border border-gray-300 font-bold">{inv.supplierName}</td>
                              <td className="p-2 border border-gray-300 text-gray-700">{inv.incomingDocNumber || 'بيان رسمي'}</td>
                              <td className="p-2 border border-gray-300 text-left font-mono font-black">{(inv.netTotal || inv.totalAmount).toLocaleString()} ج.م</td>
                              <td className="p-2 border border-gray-300 text-center">{inv.employeeName || 'محاسب المشتريات'}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 18. تقرير عن مبيعات فترة                                */}
                {/* ======================================================== */}
                {activeReport === 'period_sales' && (
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-3 rounded-lg border border-gray-300 flex items-center justify-between text-xs font-bold">
                      <span>الفترة من: {reportFromDate} إلى: {reportToDate}</span>
                      <span>
                        إجمالي الطلبيات المسجلة: {
                          orders.filter(o => (!reportFromDate || o.createdAt >= reportFromDate) && (!reportToDate || o.createdAt <= reportToDate)).length
                        } طلبية
                      </span>
                    </div>

                    <table className="w-full text-right text-xs border border-gray-300 border-collapse">
                      <thead>
                        <tr className="bg-gray-200 font-black">
                          <th className="p-2 border border-gray-300 text-center">رقم الطلب</th>
                          <th className="p-2 border border-gray-300 text-center">التاريخ</th>
                          <th className="p-2 border border-gray-300">العميل والمحافظة</th>
                          <th className="p-2 border border-gray-300">المنتجات المنصرفة</th>
                          <th className="p-2 border border-gray-300 text-center">حالة الطلب</th>
                          <th className="p-2 border border-gray-300 text-left">قيمة المبيعات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders
                          .filter(o => (!reportFromDate || o.createdAt >= reportFromDate) && (!reportToDate || o.createdAt <= reportToDate))
                          .map(order => (
                            <tr key={order.id} className="border-b border-gray-200">
                              <td className="p-2 border border-gray-300 font-mono font-bold text-center">{order.id}</td>
                              <td className="p-2 border border-gray-300 font-mono text-center">{order.createdAt}</td>
                              <td className="p-2 border border-gray-300 font-bold">{order.customerName} ({order.governorate})</td>
                              <td className="p-2 border border-gray-300 text-gray-700">
                                {(order.items || []).map(i => `${i.product.name} (x${i.quantity})`).join('، ')}
                              </td>
                              <td className="p-2 border border-gray-300 text-center font-bold text-gray-800">{order.status}</td>
                              <td className="p-2 border border-gray-300 text-left font-mono font-black">{order.total.toLocaleString()} ج.م</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Printable Signature Footer */}
                <div className="border-t-2 border-gray-900 pt-6 mt-8 grid grid-cols-3 gap-6 text-center text-xs text-gray-800">
                  <div>
                    <span className="font-bold block">أمين المخزن المختص</span>
                    <div className="h-10"></div>
                    <span className="text-gray-500 text-[10px]">التوقيع: .................................</span>
                  </div>
                  <div>
                    <span className="font-bold block">المراجع المحاسبي ورئيس الحسابات</span>
                    <div className="h-10"></div>
                    <span className="text-gray-500 text-[10px]">التوقيع: .................................</span>
                  </div>
                  <div>
                    <span className="font-bold block">اعتماد المدير العام / النائب</span>
                    <div className="h-10"></div>
                    <span className="text-gray-500 text-[10px]">الختم والاعتماد: .................................</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer with Quick Print Callout */}
            <div className="bg-slate-950 p-4 px-6 border-t border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs text-gray-400">
                زر الطباعة يفعل نافذة الطباعة الفعلية الرسمية مباشرة ويدعم حفظ كـ PDF بجودة A4 عالية
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintActiveReport}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة هذا التقرير الآن</span>
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
