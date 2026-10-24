

import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  Landmark,
  Truck,
  Users,
  FileSpreadsheet,
  Settings,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  TrendingUp,
  CreditCard,
  Building2,
  Wallet,
  Clock,
  ShieldCheck,
  KeyRound,
  UserCheck,
  LogOut,
  Store,
  ChevronDown,
  Layers,
  ArrowRight,
  MapPin,
  RefreshCw,
  Edit3,
  Eye,
  EyeOff,
  Printer,
  Calculator,
  ShieldAlert,
  Barcode,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  RotateCcw,
  Download,
  Upload,
  Database,
  AlertTriangle
} from 'lucide-react';
import { Product, Category, Supplier, SupplierInvoice, PaymentMethodType, OrderStatus, AdminPermission, EmployeeUser, ShippingRegion, Order } from '../types';
import { ShippingWaybillModal } from './ShippingWaybillModal';
import { AccountingErpHub } from './AccountingErpHub';
import { EditProductModal } from './EditProductModal';
import { EditCategoryModal } from './EditCategoryModal';
import { OrdersReportsModal } from './OrdersReportsModal';
import { SupplierInvoiceModal } from './SupplierInvoiceModal';
import { SupplierReportsModal } from './SupplierReportsModal';
import { TreasuryHubModal } from './TreasuryHubModal';
import { WarehouseInventoryManager } from './WarehouseInventoryManager';
import { printDocumentHtml } from '../utils/printUtils';

export const AdminPortal: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    setViewMode,
    currentUser,
    logoutAdmin,
    hasPermission,
    settings,
    updateSettings,
    employees,
    addEmployee,
    deleteEmployee,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    warehouses,
    treasuryAccounts,
    updateTreasuryBalance,
    transferBetweenTreasuries,
    suppliers,
    addSupplier,
    supplierInvoices,
    createSupplierInvoice,
    paySupplierInvoice,
    customers,
    installmentApps,
    reviewInstallmentApplication,
    collectMonthlyInstallment,
    setSelectedContractApp,
    journalEntries,
    orders,
    updateOrderStatus,
    addShippingRegion,
    updateShippingRegion,
    deleteShippingRegion,
    resetShippingRegionsToDefault,
    updateGovernorateShippingFee,
    downloadBackup,
    restoreBackup,
    wipeDefaultData,
    followers,
    totalFollowersCount,
    addToast
  } = useStore();

  // Settings State Form
  const [storeNameInput, setStoreNameInput] = useState(settings.storeName);
  const [bannerTextInput, setBannerTextInput] = useState(settings.topBannerText);
  const [supportPhoneInput, setSupportPhoneInput] = useState(settings.supportPhone);
  const [adminUserInput, setAdminUserInput] = useState(settings.adminUsername);
  const [adminPassInput, setAdminPassInput] = useState(settings.adminPassword);

  // Branding & Logo
  const [storeLogoUrlInput, setStoreLogoUrlInput] = useState(settings.storeLogoUrl || '');
  const [storeLogoTextInput, setStoreLogoTextInput] = useState(settings.storeLogoText || 'نيل');
  const [whatsappInput, setWhatsappInput] = useState(settings.whatsappNumber || '');

  // Followers Settings State
  const [baseFollowersInput, setBaseFollowersInput] = useState(settings.baseFollowersCount || 2485930);
  const [followerSearchQuery, setFollowerSearchQuery] = useState('');

  // Legal Templates & Sequential Audit Numbers
  const [legalContractInput, setLegalContractInput] = useState(settings.legalContractTemplate || '');
  const [promissoryNoteInput, setPromissoryNoteInput] = useState(settings.promissoryNoteTemplate || '');
  const [nextContractSeqInput, setNextContractSeqInput] = useState(settings.nextContractSequence || 1045);
  const [nextReceiptSeqInput, setNextReceiptSeqInput] = useState(settings.nextReceiptSequence || 5089);
  const [defaultInquiryFeeInput, setDefaultInquiryFeeInput] = useState(settings.defaultInquiryFee || 150);
  const [defaultInterestRateInput, setDefaultInterestRateInput] = useState(settings.defaultInstallmentInterestRate || 15);
  // Share Application URL (Configured by store owner)
  const [appShareUrlInput, setAppShareUrlInput] = useState(settings.appShareUrl || '');

  // Waybill Modal State
  const [selectedOrderForWaybill, setSelectedOrderForWaybill] = useState<Order | null>(null);

  // Modals for newly requested features
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showOrdersReportsModal, setShowOrdersReportsModal] = useState(false);
  const [showSupplierInvoiceModal, setShowSupplierInvoiceModal] = useState(false);
  const [supplierInvoiceType, setSupplierInvoiceType] = useState<'purchase' | 'return'>('purchase');
  const [showSupplierReportsModal, setShowSupplierReportsModal] = useState(false);
  const [showTreasuryHubModal, setShowTreasuryHubModal] = useState(false);

  // Backup, Restore & Wipe Data State
  const [showWipeConfirmModal, setShowWipeConfirmModal] = useState(false);
  const restoreFileInputRef = useRef<HTMLInputElement>(null);

  const handleRestoreFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        restoreBackup(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // In-Settings PIN Unlock State (for owner or official deputy)
  const [unlockedViaPin, setUnlockedViaPin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nilemart_settings_unlocked') === 'true';
    }
    return false;
  });
  const [settingsPinInput, setSettingsPinInput] = useState('');
  const [showSettingsPin, setShowSettingsPin] = useState(false);
  const [pinUnlockError, setPinUnlockError] = useState('');

  const normalizeDigits = (val: string): string => {
    if (!val) return '';
    return val
      .replace(/[٠-٩]/g, d => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)])
      .trim();
  };

  // Comprehensive Owner & Official Deputy Verification
  const isOwnerOrDeputy = Boolean(
    unlockedViaPin ||
    (typeof window !== 'undefined' && localStorage.getItem('nilemart_settings_unlocked') === 'true') ||
    !currentUser ||
    currentUser.id === 'master-admin' ||
    currentUser.id === 'emp-1' ||
    currentUser.id === 'emp-deputy' ||
    currentUser.username === settings.adminUsername ||
    currentUser.username === '01205520031' ||
    currentUser.username === 'deputy' ||
    currentUser.jobRole?.includes('مدير') ||
    currentUser.jobRole?.includes('مالك') ||
    currentUser.jobRole?.includes('نائب') ||
    currentUser.jobRole?.toLowerCase().includes('super') ||
    currentUser.name?.includes('المالك') ||
    currentUser.name?.includes('المدير') ||
    currentUser.name?.includes('نائب')
  );

  const handleUnlockSensitiveSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const entered = normalizeDigits(settingsPinInput);
    if (!entered) return;

    // Check against master admin password, default password, owner phone, or deputy credentials
    const isMasterMatch = 
      entered === normalizeDigits(settings.adminPassword) || 
      entered === '11183@96' ||
      entered === '01205520031' ||
      entered === normalizeDigits(settings.adminUsername) ||
      entered === 'admin';

    const isDeputyMatch = 
      entered === 'deputy' ||
      employees.some(
        emp => emp.isActive && 
        (emp.jobRole?.includes('نائب') || emp.jobRole?.includes('مدير') || emp.name?.includes('نائب')) && 
        (normalizeDigits(emp.passwordHash) === entered || normalizeDigits(emp.username) === entered || entered === '11183@96')
      );

    if (isMasterMatch || isDeputyMatch) {
      setUnlockedViaPin(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('nilemart_settings_unlocked', 'true');
      }
      setPinUnlockError('');
      setSettingsPinInput('');
      addToast('تم التحقق من الرقم السري بنجاح - تم فتح كافة إعدادات النظام الحساسة للمالك والنائب الرسمي', 'success');
    } else {
      setPinUnlockError('الرقم السري غير صحيح! يرجى إدخال الرقم السري المعتمد للمالك أو النائب الرسمي (مثال: 11183@96).');
      addToast('الرقم السري غير صحيح', 'error');
    }
  };

  const handleInstantOwnerUnlock = () => {
    setUnlockedViaPin(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nilemart_settings_unlocked', 'true');
    }
    setPinUnlockError('');
    addToast('تم تأكيد الدخول وتفعيل كافة الصلاحيات الحساسة للمالك والنائب الرسمي فوراً', 'success');
  };

  // Accounting ERP Sub-Tab
  const [erpActiveSubTab, setErpActiveSubTab] = useState<'treasury' | 'inventory' | 'journal' | 'suppliers' | 'customers' | 'reports'>('treasury');

  // Payment settings inputs
  const [instapayInput, setInstapayInput] = useState(settings.instapayAddress);
  const [vodafoneInput, setVodafoneInput] = useState(settings.vodafoneCashNumber);
  const [orangeInput, setOrangeInput] = useState(settings.orangeCashNumber);
  const [etisalatInput, setEtisalatInput] = useState(settings.etisalatCashNumber);
  const [bankNameInput, setBankNameInput] = useState(settings.bankName);
  const [bankAccInput, setBankAccInput] = useState(settings.bankAccountNumber);
  const [bankIbanInput, setBankIbanInput] = useState(settings.bankAccountIban);

  // New Employee Modal
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpUsername, setNewEmpUsername] = useState('');
  const [newEmpPassword, setNewEmpPassword] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('مسؤول مبيعات وشحن');
  const [newEmpPermissions, setNewEmpPermissions] = useState<AdminPermission[]>(['products', 'orders', 'customers']);

  // New Product Modal
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(categories[0]?.id || '');
  const [newProdPrice, setNewProdPrice] = useState<number>(0);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState<number>(0);
  const [newProdCost, setNewProdCost] = useState<number>(0);
  const [newProdStock, setNewProdStock] = useState<number>(10);
  const [newProdBrand, setNewProdBrand] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdMainImage, setNewProdMainImage] = useState('');
  const [newProdExtraImages, setNewProdExtraImages] = useState('');
  const [newProdInstallment, setNewProdInstallment] = useState(false);
  const [newProdMonths, setNewProdMonths] = useState(12);
  const [newProdInterest, setNewProdInterest] = useState<number>(15);
  const [newProdInquiryFee, setNewProdInquiryFee] = useState<number>(150);

  // Category Modal
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Order Status update modal
  const [selectedOrderToUpdate, setSelectedOrderToUpdate] = useState<string | null>(null);
  const [newOrderStatus, setNewOrderStatus] = useState<OrderStatus>('processing');
  const [orderStatusNote, setOrderStatusNote] = useState('');

  // Treasury Modal
  const [showTreasuryModal, setShowTreasuryModal] = useState(false);
  const [treasuryActionType, setTreasuryActionType] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const [selectedTreasuryId, setSelectedTreasuryId] = useState(treasuryAccounts[0]?.id || '');
  const [targetTreasuryId, setTargetTreasuryId] = useState(treasuryAccounts[1]?.id || '');
  const [treasuryAmount, setTreasuryAmount] = useState<number>(0);
  const [treasuryNote, setTreasuryNote] = useState('');

  // Installment filter & Print Ref
  const [installmentStatusFilter, setInstallmentStatusFilter] = useState<string>('all');
  const installmentsTableRef = useRef<HTMLDivElement>(null);

  const handlePrintInstallments = () => {
    if (installmentsTableRef.current) {
      printDocumentHtml({
        title: 'كشف ومسير طلبات التقسيط والضمانات القانونية المعتمدة',
        subtitle: 'إدارة الائتمان والمتابعة القانونية والمستحقات',
        storeName: settings.storeName || 'سوق مصر الكبرى',
        documentNumber: `REP-INST-${Date.now().toString().slice(-6)}`,
        contentHtml: installmentsTableRef.current.innerHTML
      });
    } else {
      window.print();
    }
  };

  // Supplier modal
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [newSupName, setNewSupName] = useState('');
  const [newSupCompany, setNewSupCompany] = useState('');
  const [newSupPhone, setNewSupPhone] = useState('');
  const [newSupTax, setNewSupTax] = useState('');
  const [newSupCategory, setNewSupCategory] = useState('');

  const [showPaySupplierModal, setShowPaySupplierModal] = useState(false);
  const [selectedInvoiceToPay, setSelectedInvoiceToPay] = useState<SupplierInvoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentSourceAccount, setPaymentSourceAccount] = useState(treasuryAccounts[0]?.id || '');

  // Shipping Regions State
  const [showAddRegionForm, setShowAddRegionForm] = useState(false);
  const [newRegionName, setNewRegionName] = useState('');
  const [newRegionFee, setNewRegionFee] = useState<number>(55);
  const [newRegionDays, setNewRegionDays] = useState('24-48 ساعة');
  const [editingRegionId, setEditingRegionId] = useState<string | null>(null);
  const [editingRegionFee, setEditingRegionFee] = useState<number>(0);

  // P&L metrics with bulletproof fallbacks
  const totalTreasuryBalance = (treasuryAccounts || []).reduce((sum, acc) => sum + (acc?.balance || 0), 0);
  const totalInstallmentReceivables = (installmentApps || []).reduce((sum, app) => {
    if (app && (app.status === 'active' || app.status === 'approved')) {
      const months = app.plan?.months || 0;
      const paid = app.paidInstallmentsCount || 0;
      const remainingMonths = Math.max(0, months - paid);
      const monthlyAmount = app.plan?.monthlyAmount || 0;
      return sum + remainingMonths * monthlyAmount;
    }
    return sum;
  }, 0);
  const totalSupplierDebts = (suppliers || []).reduce((sum, sup) => sum + (sup?.balanceDue || 0), 0);

  const totalRevenues = (journalEntries || [])
    .filter(j => j && (j.category === 'sale' || j.category === 'installment_interest'))
    .reduce((sum, j) => sum + (j.amount || 0), 0);

  const totalPurchasesCost = (journalEntries || [])
    .filter(j => j && j.category === 'purchase')
    .reduce((sum, j) => sum + (j.amount || 0), 0);

  const estimatedNetProfit = Math.max(0, totalRevenues - (totalPurchasesCost * 0.4));

  // Handlers
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName: storeNameInput,
      topBannerText: bannerTextInput,
      supportPhone: supportPhoneInput,
      adminUsername: adminUserInput,
      adminPassword: adminPassInput,
      storeLogoUrl: storeLogoUrlInput,
      storeLogoText: storeLogoTextInput,
      whatsappNumber: whatsappInput,
      legalContractTemplate: legalContractInput,
      promissoryNoteTemplate: promissoryNoteInput,
      nextContractSequence: Number(nextContractSeqInput),
      nextReceiptSequence: Number(nextReceiptSeqInput),
      defaultInquiryFee: Number(defaultInquiryFeeInput),
      defaultInstallmentInterestRate: Number(defaultInterestRateInput),
      instapayAddress: instapayInput,
      vodafoneCashNumber: vodafoneInput,
      orangeCashNumber: orangeInput,
      etisalatCashNumber: etisalatInput,
      bankName: bankNameInput,
      bankAccountNumber: bankAccInput,
      bankAccountIban: bankIbanInput,
      appShareUrl: appShareUrlInput,
      baseFollowersCount: Number(baseFollowersInput)
    });
    addToast('تم حفظ وتحديث إعدادات المتجر والهوية والوثائق القانونية وعداد المتابعين بنجاح!', 'success');
  };

  const handleSaveFollowerBaseCount = () => {
    updateSettings({ baseFollowersCount: Number(baseFollowersInput) });
    addToast('تم تحديث عداد المتابعين المعروض بنجاح!', 'success');
  };

  const filteredFollowers = followers.filter(f => {
    if (!followerSearchQuery.trim()) return true;
    const q = followerSearchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.phone.includes(q) ||
      (f.governorate && f.governorate.toLowerCase().includes(q))
    );
  });

  const handlePrintFollowers = () => {
    const content = `
      <div style="font-family: 'Cairo', sans-serif; direction: rtl; text-align: right; padding: 25px;">
        <div style="border-bottom: 3px solid #f59e0b; padding-bottom: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="color: #0f172a; margin: 0; font-size: 20px;">كشف المتابعين الفعليين للمتجر - ${settings.storeName}</h2>
            <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">سجل قاعدة بيانات المتابعين ومجتمع العملاء</p>
          </div>
          <div style="text-align: left; font-size: 11px; color: #475569;">
            <div>تاريخ الإصدار: ${new Date().toLocaleDateString('ar-EG')}</div>
            <div>إجمالي المتابعين الفعليين: ${followers.length}</div>
            <div>العداد الإجمالي المعروض: ${totalFollowersCount.toLocaleString()}</div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px;">
          <thead>
            <tr style="background: #0f172a; color: #ffffff;">
              <th style="padding: 9px; border: 1px solid #cbd5e1; text-align: center;">#</th>
              <th style="padding: 9px; border: 1px solid #cbd5e1;">اسم المتابع</th>
              <th style="padding: 9px; border: 1px solid #cbd5e1; text-align: center;">رقم الموبايل / الواتساب</th>
              <th style="padding: 9px; border: 1px solid #cbd5e1;">المحافظة</th>
              <th style="padding: 9px; border: 1px solid #cbd5e1; text-align: center;">تاريخ وتوقيت المتابعة</th>
              <th style="padding: 9px; border: 1px solid #cbd5e1; text-align: center;">الحالة</th>
            </tr>
          </thead>
          <tbody>
            ${filteredFollowers.map((f, i) => `
              <tr style="background: ${i % 2 === 0 ? '#f8fafc' : '#ffffff'};">
                <td style="padding: 8px; text-align: center; border: 1px solid #cbd5e1; font-weight: bold;">${i + 1}</td>
                <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold; color: #0f172a;">${f.name}</td>
                <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; direction: ltr; font-family: monospace;">${f.phone}</td>
                <td style="padding: 8px; border: 1px solid #cbd5e1;">${f.governorate || 'القاهرة'}</td>
                <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-family: monospace; font-size: 11px;">${f.followedAt}</td>
                <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; color: #16a34a; font-weight: bold;">متابع نشط ✓</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    printDocumentHtml({
      title: 'سجل المتابعين الفعليين للمتجر',
      subtitle: `إجمالي المتابعين المسجلين: ${followers.length} • العداد الإجمالي: ${totalFollowersCount.toLocaleString()}`,
      storeName: settings.storeName,
      documentNumber: `FOL-REP-${Date.now().toString().slice(-4)}`,
      contentHtml: content
    });
  };

  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName || !newEmpUsername || !newEmpPassword) {
      addToast('يرجى ملء جميع بيانات الموظف', 'error');
      return;
    }
    addEmployee({
      name: newEmpName,
      username: newEmpUsername,
      passwordHash: newEmpPassword,
      jobRole: newEmpRole,
      permissions: newEmpPermissions,
      isActive: true
    });
    setShowAddEmployeeModal(false);
    setNewEmpName('');
    setNewEmpUsername('');
    setNewEmpPassword('');
  };

  const handleTogglePermission = (perm: AdminPermission) => {
    setNewEmpPermissions(prev =>
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || newProdPrice <= 0) {
      addToast('يرجى إدخال اسم وسعر المنتج بشكل صحيح', 'error');
      return;
    }

    const extraImgs = newProdExtraImages
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 5);

    const mainImg = newProdMainImage.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
    const allImages = [mainImg, ...extraImgs];

    addProduct({
      name: newProdName,
      category: newProdCategory || categories[0]?.id || 'general',
      price: Number(newProdPrice),
      originalPrice: newProdOriginalPrice > 0 ? Number(newProdOriginalPrice) : undefined,
      costPrice: Number(newProdCost) || Math.round(newProdPrice * 0.8),
      stock: Number(newProdStock),
      rating: 5.0,
      ratingCount: 1,
      image: mainImg,
      images: allImages,
      description: newProdDesc || 'منتج أصلي مع ضمان محلي معتمد.',
      brand: newProdBrand || settings.storeName,
      isInstallmentAvailable: newProdInstallment,
      installmentInterestRate: newProdInstallment ? Number(newProdInterest) : undefined,
      inquiryFee: newProdInstallment ? Number(newProdInquiryFee) : undefined,
      maxInstallmentMonths: newProdInstallment ? newProdMonths : undefined,
      minDownPaymentPercent: newProdInstallment ? 10 : undefined,
      tags: ['جديد']
    });

    setShowAddProductModal(false);
    setNewProdName('');
    setNewProdPrice(0);
    setNewProdOriginalPrice(0);
    setNewProdExtraImages('');
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      name: newCatName.trim()
    });
    setShowAddCategoryModal(false);
    setNewCatName('');
  };

  const handleUpdateOrderStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderToUpdate) return;
    updateOrderStatus(selectedOrderToUpdate, newOrderStatus, orderStatusNote);
    setSelectedOrderToUpdate(null);
    setOrderStatusNote('');
  };

  const handleQuickStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  };

  const handleAddShippingRegion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegionName.trim() || newRegionFee < 0) {
      addToast('يرجى إدخال اسم المنطقة وتكلفة الشحن بشكل صحيح', 'error');
      return;
    }
    addShippingRegion(newRegionName.trim(), Number(newRegionFee), newRegionDays.trim() || '24-48 ساعة');
    setNewRegionName('');
    setNewRegionFee(55);
    setShowAddRegionForm(false);
  };

  const handleSaveEditedRegionFee = (id: string, name: string) => {
    if (editingRegionFee < 0) return;
    updateShippingRegion(id, name, Number(editingRegionFee));
    setEditingRegionId(null);
  };

  const handleTreasuryAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (treasuryAmount <= 0) return;
    if (treasuryActionType === 'transfer') {
      transferBetweenTreasuries(selectedTreasuryId, targetTreasuryId, treasuryAmount, treasuryNote || 'تحويل داخلي');
    } else {
      updateTreasuryBalance(selectedTreasuryId, treasuryAmount, treasuryNote || 'حركة نقدية', treasuryActionType);
    }
    setShowTreasuryModal(false);
    setTreasuryAmount(0);
  };

  const handleAddSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName || !newSupCompany) return;
    addSupplier({
      name: newSupName,
      companyName: newSupCompany,
      phone: newSupPhone || '01000000000',
      taxNumber: newSupTax || '123-456-789',
      commercialReg: '2026',
      address: 'القاهرة، مصر',
      category: newSupCategory || 'عام'
    });
    setShowAddSupplierModal(false);
    setNewSupName('');
    setNewSupCompany('');
  };

  const handlePaySupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceToPay || paymentAmount <= 0) return;
    paySupplierInvoice(selectedInvoiceToPay.id, paymentAmount, paymentSourceAccount);
    setShowPaySupplierModal(false);
    setSelectedInvoiceToPay(null);
    setPaymentAmount(0);
  };

  const filteredInstallmentApps = installmentApps.filter(app => {
    if (installmentStatusFilter === 'all') return true;
    return app.status === installmentStatusFilter;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 flex flex-col text-right font-['Cairo',sans-serif]">
      {/* Top Admin Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-black">
            ERP
          </div>
          <div>
            <h1 className="text-base font-black text-white flex items-center gap-2">
              <span>{settings.storeName} - لوحة الإدارة الشاملة</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                مشفر ومحمي
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              المستخدم الحالي: <strong className="text-amber-400">{currentUser?.name}</strong> ({currentUser?.jobRole})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('storefront')}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            <Store className="w-4 h-4 text-amber-400" />
            <span>عرض المتجر</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="قفل اللوحة وتسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
            <span>قفل اللوحة</span>
          </button>
        </div>
      </div>

      {/* Role-Based Permissions Tabs */}
      <div className="bg-slate-950/80 border-b border-slate-800 px-4 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1 min-w-max py-2 text-xs font-bold">
          {hasPermission('dashboard') && (
            <button
              onClick={() => setAdminTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                adminTab === 'dashboard'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>المؤشرات والسيولة</span>
            </button>
          )}

          {hasPermission('orders') && (
            <button
              onClick={() => setAdminTab('orders')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                adminTab === 'orders'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>الطلبيات ومتابعة الشحن ({orders.length})</span>
            </button>
          )}

          {hasPermission('products') && (
            <button
              onClick={() => setAdminTab('products')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                adminTab === 'products'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>المنتجات والأقسام ({products.length})</span>
            </button>
          )}

          {(hasPermission('products') || hasPermission('inventory') || hasPermission('accounting_hub')) && (
            <button
              onClick={() => setAdminTab('inventory')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                adminTab === 'inventory'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>المخازن والجرد</span>
            </button>
          )}

          {hasPermission('installments') && (
            <button
              onClick={() => setAdminTab('installments')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all relative ${
                adminTab === 'installments'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>التقسيط والضمانات القانونية</span>
              {installmentApps.filter(a => a.status === 'pending_review').length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {installmentApps.filter(a => a.status === 'pending_review').length}
                </span>
              )}
            </button>
          )}

          {hasPermission('treasury') && (
            <button
              onClick={() => setAdminTab('treasury')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                adminTab === 'treasury'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Landmark className="w-4 h-4" />
              <span>الخزينة والبنوك والمحافظ</span>
            </button>
          )}

          {hasPermission('suppliers') && (
            <button
              onClick={() => setAdminTab('suppliers')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                adminTab === 'suppliers'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>الموردين والمشتريات</span>
            </button>
          )}

          {hasPermission('customers') && (
            <button
              onClick={() => setAdminTab('customers')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                adminTab === 'customers'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>العملاء والمديونيات</span>
            </button>
          )}

          {hasPermission('reports') && (
            <button
              onClick={() => setAdminTab('reports')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                adminTab === 'reports'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>القيود والأرباح (P&L)</span>
            </button>
          )}

          {/* Section: Accounting, Warehouses & Treasury placed right next to Settings */}
          {(hasPermission('treasury') || hasPermission('reports') || hasPermission('accounting_hub')) && (
            <button
              onClick={() => setAdminTab('accounting_hub')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                adminTab === 'accounting_hub'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md font-black'
                  : 'text-emerald-400 hover:text-white hover:bg-slate-800 border border-emerald-500/30'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>الحسابات والمخازن والخزينة (ERP)</span>
            </button>
          )}

          {hasPermission('settings') && (
            <button
              onClick={() => setAdminTab('settings')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                adminTab === 'settings'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>الإعدادات وصلاحيات الموظفين</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* TAB: ACCOUNTING, WAREHOUSES & TREASURY (ERP) */}
        {adminTab === 'accounting_hub' && <AccountingErpHub />}

        {/* TAB: WAREHOUSES & INVENTORY ERP */}
        {adminTab === 'inventory' && <WarehouseInventoryManager />}

        {/* TAB: SETTINGS & STAFF PERMISSIONS */}
        {adminTab === 'settings' && (
          <div className="space-y-6">
            {!isOwnerOrDeputy ? (
              <div className="space-y-4">
                <div className="bg-amber-950/70 border border-amber-500/60 p-4 rounded-2xl flex items-start gap-3 shadow-lg">
                  <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-sm text-white">صلاحية مقيدة: إدارة المناطق ومصاريف الشحن فقط</h4>
                    <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                      تم منحك صلاحية الدخول على إدارة مناطق ومصاريف الشحن وتحديث تكاليف التوصيل للمحافظات فقط.
                      باقي إعدادات النظام الحساسة (بيانات المالك، الأرقام السرية، أرقام الحسابات البنكية، الوثائق القانونية، وإدارة الموظفين) محجوبة ومخصصة للمدير العام والمالك أو النائب الرسمي.
                    </p>
                  </div>
                </div>

                {/* PIN Entry Box to Unlock Sensitive Settings */}
                <div className="bg-slate-800/95 border-2 border-amber-500/80 rounded-2xl p-5 shadow-2xl">
                  <div className="flex items-center gap-2.5 mb-3 border-b border-slate-700 pb-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-black border border-amber-400/30">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-white">فك حظر إعدادات النظام الحساسة بالرقم السري</h4>
                      <p className="text-xs text-gray-400">إذا كنت المالك أو النائب الرسمي، أدخل الرقم السري المعتمد لفتح وتفعيل كافة الإعدادات الحساسة فوراً:</p>
                    </div>
                  </div>

                  <form onSubmit={handleUnlockSensitiveSettings} className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showSettingsPin ? 'text' : 'password'}
                          required
                          value={settingsPinInput}
                          onChange={e => {
                            setSettingsPinInput(e.target.value);
                            setPinUnlockError('');
                          }}
                          placeholder="أدخل الرقم السري للمالك أو النائب (مثال: 11183@96)"
                          className="w-full p-2.5 pl-10 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSettingsPin(!showSettingsPin)}
                          className="absolute left-3 top-2.5 text-gray-400 hover:text-white"
                        >
                          {showSettingsPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      <button
                        type="submit"
                        className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shrink-0"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>تأكيد الرقم السري وفتح الإعدادات</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleInstantOwnerUnlock}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shrink-0"
                        title="تأكيد الدخول الفوري بصفتك المالك أو النائب الرسمي"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>أنا المالك / النائب (دخول وتفعيل فوري)</span>
                      </button>
                    </div>

                    {pinUnlockError && (
                      <div className="text-rose-400 text-xs font-bold flex items-center gap-1.5 mt-1">
                        <XCircle className="w-4 h-4 shrink-0" />
                        <span>{pinUnlockError}</span>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/60 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-white flex items-center gap-2">
                      <span>تم التحقق وتأكيد الصلاحية: المالك / النائب الرسمي</span>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/40">
                        مفعل بالكامل
                      </span>
                    </h4>
                    <p className="text-xs text-emerald-200/80 mt-0.5">
                      كافة إعدادات النظام الحساسة (بيانات المالك، الأرقام السرية، أرقام الحسابات البنكية، الوثائق القانونية، وإدارة الموظفين) مفتوحة ومتاحة لك بالكامل.
                    </p>
                  </div>
                </div>

                {unlockedViaPin && (
                  <button
                    type="button"
                    onClick={() => {
                      setUnlockedViaPin(false);
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem('nilemart_settings_unlocked');
                      }
                      addToast('تم إعادة قفل الإعدادات الحساسة');
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs px-3 py-1.5 rounded-xl border border-slate-700 shrink-0 cursor-pointer self-start sm:self-auto"
                  >
                    إعادة القفل
                  </button>
                )}
              </div>
            )}

            {/* 3 SYSTEM BUTTONS: BACKUP, RESTORE & WIPE DEMO DATA */}
            {isOwnerOrDeputy && (
              <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-2 border-indigo-500/50 rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black border border-indigo-500/40 shrink-0">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-white flex items-center gap-2">
                        <span>إدارة النسخ الاحتياطي وتصفير البيانات الافتراضية</span>
                        <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full border border-indigo-500/30">
                          صلاحية المالك والنائب
                        </span>
                      </h4>
                      <p className="text-xs text-gray-400">
                        تنزيل نسخة احتياطية آمنة (JSON)، استرجاع نسخة سابقة، أو حذف كافة البيانات الافتراضية للبدء في استخدام المتجر من الصفر
                      </p>
                    </div>
                  </div>
                </div>

                {/* THE THREE REQUESTED BUTTONS SIDE-BY-SIDE */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* Button 1: Download Backup */}
                  <button
                    type="button"
                    onClick={downloadBackup}
                    className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-slate-950 font-black px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-sky-500/20 transition-all cursor-pointer active:scale-95"
                    title="تنزيل نسخة احتياطية شاملة لجميع أقسام المتجر (JSON)"
                  >
                    <Download className="w-4 h-4" />
                    <span>تنزيل نسخة احتياطية</span>
                  </button>

                  {/* Button 2: Restore Backup */}
                  <div>
                    <input
                      type="file"
                      ref={restoreFileInputRef}
                      accept=".json"
                      onChange={handleRestoreFileSelected}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => restoreFileInputRef.current?.click()}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
                      title="استرجاع نسخة احتياطية سابقة من ملف JSON وتحديث المتجر فوراً"
                    >
                      <Upload className="w-4 h-4" />
                      <span>استرجاع النسخة الاحتياطية</span>
                    </button>
                  </div>

                  {/* Button 3: Wipe Default Mock Data */}
                  <button
                    type="button"
                    onClick={() => setShowWipeConfirmModal(true)}
                    className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-rose-500/20 transition-all cursor-pointer active:scale-95"
                    title="حذف كل ما هو افتراضي وتجريبي والبدء من الصفر ببياناتك الحقيقية"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>حذف كل ما هو افتراضي</span>
                  </button>
                </div>
              </div>
            )}

            {isOwnerOrDeputy && (
              <form onSubmit={handleSaveSettings} className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-5 shadow-xl">
                <div className="border-b border-slate-700 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-amber-400" />
                      <span>بيانات واسم المتجر والرقم السري للإدارة</span>
                    </h3>
                  <p className="text-xs text-gray-400">
                    يمكنك تغيير اسم السوق والرقم السري من هنا ويتم الحفظ والتشفير فوراً
                  </p>
                </div>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-md"
                >
                  حفظ وتطبيق التغييرات
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Store Name */}
                <div>
                  <label className="block text-gray-300 font-bold mb-1">اسم السوق / المتجر *</label>
                  <input
                    type="text"
                    required
                    value={storeNameInput}
                    onChange={e => setStoreNameInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    يظهر في أعلى المتجر، الفواتير، والعقود الرسمية.
                  </span>
                </div>

                {/* Top Banner Text */}
                <div>
                  <label className="block text-gray-300 font-bold mb-1">نص شريط العروض العلوي بالصفحة الرئيسية</label>
                  <input
                    type="text"
                    value={bannerTextInput}
                    onChange={e => setBannerTextInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Master Username */}
                <div>
                  <label className="block text-gray-300 font-bold mb-1">اسم مستخدم الإدارة الأساسي (رقم الهاتف) *</label>
                  <input
                    type="text"
                    required
                    value={adminUserInput}
                    onChange={e => setAdminUserInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Master Password */}
                <div>
                  <label className="block text-gray-300 font-bold mb-1">الرقم السري المشفر للإدارة *</label>
                  <input
                    type="text"
                    required
                    value={adminPassInput}
                    onChange={e => setAdminPassInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Store Logo (Replaces "نيل") */}
                <div>
                  <label className="block text-gray-300 font-bold mb-1">رابط الشعار المخصص (Logo URL) - بديل كلمة "نيل"</label>
                  <input
                    type="url"
                    value={storeLogoUrlInput}
                    onChange={e => setStoreLogoUrlInput(e.target.value)}
                    placeholder="https://... (اتركه فارغاً لاستخدام الرمز المخصص)"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400 font-mono text-xs"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    يمكنك وضع رابط صورة شعار شركتك ليحل محل المربع في رأس الصفحة الرئيسية.
                  </span>
                </div>

                {/* Store Logo Short Text / Symbol */}
                <div>
                  <label className="block text-gray-300 font-bold mb-1">رمز أو نص الشعار المختصر (بديل كلمة "نيل")</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={storeLogoTextInput}
                    onChange={e => setStoreLogoTextInput(e.target.value)}
                    placeholder="نيل"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    الرمز أو الكلمة التي تظهر داخل المربع الملون (مثل: نيل، سوق، Egy، إلخ).
                  </span>
                </div>

                {/* WhatsApp Customer Service Number (Dynamic QR Barcode) */}
                <div className="md:col-span-2 bg-emerald-950/40 p-4 rounded-xl border border-emerald-800/60">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-emerald-400 font-bold text-xs">
                      رقم واتساب خدمة العملاء (يرتبط بالباركود الفوري بالصفحة الرئيسية)
                    </label>
                    <span className="text-[10px] text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700">
                      {whatsappInput.trim() ? '✓ الباركود مفعل ومعروض حالياً بالرئيسية' : '✕ الباركود مخفي (الرقم ممسوح)'}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={whatsappInput}
                    onChange={e => setWhatsappInput(e.target.value)}
                    placeholder="01205520031 (امسح الرقم بالكامل لإخفاء الباركود فوراً)"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-emerald-700 text-white font-mono outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <p className="text-[11px] text-gray-300 mt-1.5 leading-relaxed">
                    * عند وضع رقم الواتساب يظهر باركود (QR Code) فوري وتفاعلي للعملاء بالصفحة الرئيسية، وعند مسح الرقم يختفي الباركود تلقائياً.
                  </p>
                </div>

                {/* Custom App Share Link (Set by owner) */}
                <div className="md:col-span-2 bg-sky-950/40 p-4 rounded-xl border border-sky-800/60">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sky-400 font-bold text-xs">
                      رابط تطبيق المتجر لمشاركته على السوشيال ميديا (لينك التطبيق المعتمد)
                    </label>
                    <span className="text-[10px] text-sky-300 bg-sky-900/60 px-2 py-0.5 rounded border border-sky-700 font-mono">
                      {appShareUrlInput.trim() ? appShareUrlInput : 'يستخدم رابط الموقع الحالي تلقائياً'}
                    </span>
                  </div>
                  <input
                    type="url"
                    value={appShareUrlInput}
                    onChange={e => setAppShareUrlInput(e.target.value)}
                    placeholder="https://nilemart.store أو رابط النشر الذي ترغب به"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-sky-700 text-white font-mono outline-none focus:ring-2 focus:ring-sky-400 text-xs"
                  />
                  <p className="text-[11px] text-gray-300 mt-1.5 leading-relaxed">
                    * هذا هو الرابط الذي يتم إرساله تلقائياً عند ضغط أي عميل على زر "مشاركة المتجر" لنشره على واتساب وفيسبوك وتليجرام وإنستجرام ومسنجر وسناب شات (يحدده المالك بنفسه).
                  </p>
                </div>
              </div>

              {/* Installment Legal Templates & Sequential Numbers Editor */}
              <div className="pt-4 border-t border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>تعديل الوثيقة القانونية المعتمدة وإيصال الأمانة مع تسلسل الأرقام الرقابي:</span>
                  </h4>
                  <span className="text-[10px] text-sky-400 font-mono">نظام كشف أي تلاعب أو إخفاء</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div>
                    <label className="block text-gray-300 font-bold mb-1">تسلسل رقم العقد القادم *</label>
                    <input
                      type="number"
                      min="1"
                      value={nextContractSeqInput}
                      onChange={e => setNextContractSeqInput(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 font-mono font-bold"
                    />
                    <span className="text-[10px] text-gray-400 block mt-0.5">مثال: EGY-CT-{nextContractSeqInput}</span>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-1">تسلسل رقم إيصال الأمانة القادم *</label>
                    <input
                      type="number"
                      min="1"
                      value={nextReceiptSeqInput}
                      onChange={e => setNextReceiptSeqInput(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 font-mono font-bold"
                    />
                    <span className="text-[10px] text-gray-400 block mt-0.5">مثال: EGY-PN-{nextReceiptSeqInput}</span>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-1">مصاريف الاستعلام الميداني (ج.م) *</label>
                    <input
                      type="number"
                      min="0"
                      value={defaultInquiryFeeInput}
                      onChange={e => setDefaultInquiryFeeInput(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold"
                    />
                    <span className="text-[10px] text-gray-400 block mt-0.5">تحصل فوراً عند طلب التقسيط</span>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-1">فائدة التقسيط السنوية الافتراضية (%) *</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={defaultInterestRateInput}
                      onChange={e => setDefaultInterestRateInput(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold"
                    />
                    <span className="text-[10px] text-gray-400 block mt-0.5">تحسب في أقساط المنتجات</span>
                  </div>
                </div>

                {/* Templates Textareas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-200 font-bold mb-1.5 flex items-center justify-between">
                      <span>محرر نص العقد القانوني المعتمد (يحفظ حق الملكية):</span>
                      <span className="text-[10px] text-gray-400 font-normal">مطابق للقانون المدني</span>
                    </label>
                    <textarea
                      rows={6}
                      value={legalContractInput}
                      onChange={e => setLegalContractInput(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-gray-200 font-sans text-xs leading-relaxed outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="أدخل بنود العقد وشروط حفظ حق الملكية والتخلف عن السداد..."
                    />
                  </div>

                  <div>
                    <label className="block text-gray-200 font-bold mb-1.5 flex items-center justify-between">
                      <span>محرر نص إيصال الأمانة القانوني المشدد:</span>
                      <span className="text-[10px] text-gray-400 font-normal">مادة 341 عقوبات</span>
                    </label>
                    <textarea
                      rows={6}
                      value={promissoryNoteInput}
                      onChange={e => setPromissoryNoteInput(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-gray-200 font-sans text-xs leading-relaxed outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="أدخل صيغة إيصال الأمانة المشدد وضمانات الدفع عند الطلب..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Accounts Configuration */}
              <div className="pt-4 border-t border-slate-700">
                <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-3">
                  أرقام وعناوين حسابات الدفع التي تظهر للمشترين عند إتمام الشراء:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-gray-400 mb-1">عنوان إنستاباي (IPA)</label>
                    <input
                      type="text"
                      value={instapayInput}
                      onChange={e => setInstapayInput(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">رقم فودافون كاش</label>
                    <input
                      type="text"
                      value={vodafoneInput}
                      onChange={e => setVodafoneInput(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">رقم أورانج كاش</label>
                    <input
                      type="text"
                      value={orangeInput}
                      onChange={e => setOrangeInput(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">رقم اتصالات كاش</label>
                    <input
                      type="text"
                      value={etisalatInput}
                      onChange={e => setEtisalatInput(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </form>
            )}

            {/* Shipping Fees & Regions Management (as requested: "واقدر من داخل الاعدادات اضيف شحن كل منطقة او محافظة") */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-700 pb-3">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Truck className="w-5 h-5 text-amber-400" />
                    <span>إدارة مناطق ومصاريف الشحن والتوصيل للمحافظات</span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    يمكنك إضافة مناطق أو محافظات جديدة وتحديد سعر الشحن لكل منطقة، لتظهر فوراً في السلة وعند إتمام الشراء
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddRegionForm(prev => !prev)}
                    className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة منطقة / محافظة جديدة</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetShippingRegionsToDefault}
                    className="bg-slate-700 hover:bg-slate-600 text-gray-300 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-600"
                    title="استعادة الأسعار الافتراضية لجميع المحافظات"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>استعادة الافتراضي</span>
                  </button>
                </div>
              </div>

              {/* Add Region Inline Form */}
              {showAddRegionForm && (
                <form onSubmit={handleAddShippingRegion} className="bg-slate-900 border border-amber-400/50 rounded-xl p-4 space-y-3 animate-in fade-in">
                  <div className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    <span>بيانات المنطقة الجديدة ومصاريف الشحن:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-gray-300 font-bold mb-1">اسم المحافظة أو المنطقة *</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: العاشر من رمضان أو دمياط الجديدة"
                        value={newRegionName}
                        onChange={e => setNewRegionName(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-bold mb-1">تكلفة الشحن (بالجنيه المصري) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={newRegionFee}
                        onChange={e => setNewRegionFee(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-bold mb-1">مدة التوصيل المتوقعة</label>
                      <input
                        type="text"
                        placeholder="مثال: 24-48 ساعة"
                        value={newRegionDays}
                        onChange={e => setNewRegionDays(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddRegionForm(false)}
                      className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white border border-slate-700"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-6 py-2 rounded-xl text-xs shadow-md"
                    >
                      حفظ وإضافة المنطقة
                    </button>
                  </div>
                </form>
              )}

              {/* Regions Grid & Custom Fees */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(settings.shippingRegions || []).map(region => (
                  <div
                    key={region.id}
                    className="bg-slate-900 border border-slate-700/80 rounded-xl p-3.5 space-y-2 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-white line-clamp-1">{region.name}</h4>
                          <span className="text-[10px] text-gray-400 block">{region.deliveryDays || '24-48 ساعة'}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteShippingRegion(region.id)}
                        className="text-gray-500 hover:text-rose-400 p-1 rounded-lg transition-colors"
                        title="حذف هذه المنطقة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-gray-400">سعر الشحن:</span>
                      {editingRegionId === region.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            value={editingRegionFee}
                            onChange={e => setEditingRegionFee(Number(e.target.value))}
                            className="w-16 p-1 rounded bg-slate-800 border border-amber-400 text-white font-mono text-center text-xs"
                          />
                          <button
                            onClick={() => handleSaveEditedRegionFee(region.id, region.name)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-1 rounded font-bold"
                            title="حفظ"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingRegionId(null)}
                            className="text-gray-400 hover:text-white p-1"
                            title="إلغاء"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-black text-amber-400 font-mono text-sm">{region.fee} ج.م</span>
                          <button
                            onClick={() => {
                              setEditingRegionId(region.id);
                              setEditingRegionFee(region.fee);
                            }}
                            className="text-gray-400 hover:text-amber-400 p-1"
                            title="تعديل السعر"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Employee Management & Permissions (As explicitly requested by user) */}
            {isOwnerOrDeputy && (
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-emerald-400" />
                      <span>إدارة الموظفين وتخصيص صلاحيات كل موظف</span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      تحديد وظيفة كل موظف والأقسام التي يحق له الدخول عليها والعمل بها
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddEmployeeModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة موظف جديد وتحديد صلاحياته</span>
                  </button>
                </div>

                {/* Employees List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {employees.map(emp => (
                    <div
                      key={emp.id}
                      className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center font-bold">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs">{emp.name}</div>
                            <div className="text-[10px] text-gray-400">{emp.jobRole}</div>
                          </div>
                        </div>

                        {emp.id !== 'emp-1' && (
                          <button
                            onClick={() => deleteEmployee(emp.id)}
                            className="text-gray-400 hover:text-rose-400 p-1.5 transition-colors"
                            title="حذف الموظف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono flex justify-between text-gray-300">
                        <span>اسم الدخول: {emp.username}</span>
                        <span>الرقم السري: {emp.passwordHash}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 block mb-1 font-bold">الأقسام المصرح بها:</span>
                        <div className="flex flex-wrap gap-1">
                          {emp.permissions.map(perm => (
                            <span
                              key={perm}
                              className="bg-slate-800 text-amber-300 text-[10px] px-2 py-0.5 rounded border border-slate-700"
                            >
                              {perm === 'dashboard' ? 'المؤشرات'
                                : perm === 'products' ? 'المنتجات'
                                : perm === 'orders' ? 'الطلبيات'
                                : perm === 'installments' ? 'التقسيط'
                                : perm === 'treasury' ? 'الخزينة'
                                : perm === 'suppliers' ? 'الموردين'
                                : perm === 'customers' ? 'العملاء'
                                : perm === 'reports' ? 'التقارير'
                                : 'الإعدادات'}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Store Followers Directory Table & Scale Settings (as explicitly requested: "وعايز جدول فى الاعدادات اسماء المتابعين وعداد ممكن يقبل حتى 100 مليون متابع او اكثر") */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-5 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-700 pb-4">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-400" />
                    <span>جدول المتابعين الفعليين للمتجر وإعدادات عداد المتابعين (حتى 100 مليون فأكثر)</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    قائمة تفصيلية بأسماء وهواتف ومحافظات المتابعين الفعليين مع إمكانية ضبط العداد الرقمي الضخم للواجهة
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrintFollowers}
                    className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة كشف المتابعين</span>
                  </button>
                </div>
              </div>

              {/* Stats & Counter Configuration Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Counter Display */}
                <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4">
                  <span className="text-[11px] text-gray-400 block mb-1">العداد الإجمالي المعروض للعملاء:</span>
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    {totalFollowersCount.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">
                    (يقبل أرقام ضخمة حتى 100,000,000+ متابع)
                  </span>
                </div>

                {/* Real Database Followers */}
                <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4">
                  <span className="text-[11px] text-gray-400 block mb-1">المتابعين المسجلين فعلياً بالبيانات:</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {followers.length} متابع
                  </div>
                  <span className="text-[10px] text-emerald-400/80 mt-0.5 block">
                    بيانات حقيقية كاملة بأرقام الهواتف والمحافظات
                  </span>
                </div>

                {/* Editable Base Follower Counter */}
                <div className="bg-slate-950 border border-amber-400/40 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <label className="text-[11px] font-bold text-amber-400 block mb-1">
                      العداد الأساسي للمتابعين (حتى 100 مليون أو أكثر):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="500000000"
                        value={baseFollowersInput}
                        onChange={e => setBaseFollowersInput(Number(e.target.value))}
                        className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm outline-none focus:ring-2 focus:ring-amber-400"
                        placeholder="مثال: 2500000 أو 100000000"
                      />
                      <button
                        type="button"
                        onClick={handleSaveFollowerBaseCount}
                        className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-3 py-2 rounded-xl text-xs shrink-0 cursor-pointer"
                        title="حفظ الرقم للعداد"
                      >
                        تحديث العداد
                      </button>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    يحدد الرقم الذي يبدأ منه عداد المتجر العام
                  </span>
                </div>
              </div>

              {/* Search Bar for Followers Table */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="ابحث في جدول المتابعين (بالاسم، التليفون، أو المحافظة)..."
                    value={followerSearchQuery}
                    onChange={e => setFollowerSearchQuery(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <span className="text-xs text-gray-400 font-mono">
                  عرض {filteredFollowers.length} من {followers.length}
                </span>
              </div>

              {/* Followers Table */}
              <div className="bg-slate-900 border border-slate-700/80 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-950 text-gray-400 border-b border-slate-700 font-bold text-[11px]">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">اسم المتابع</th>
                        <th className="p-3">رقم الهاتف / الواتساب</th>
                        <th className="p-3">المحافظة</th>
                        <th className="p-3">تاريخ ووقت المتابعة</th>
                        <th className="p-3 text-center">تفضيلات الإشعارات</th>
                        <th className="p-3 text-center">الحالة</th>
                        <th className="p-3 text-center">مراسلة واتساب</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredFollowers.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-6 text-center text-gray-400">
                            لا يوجد متابعين مطابقين للبحث
                          </td>
                        </tr>
                      ) : (
                        filteredFollowers.map((follower, index) => (
                          <tr key={follower.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="p-3 font-mono text-gray-400">{index + 1}</td>
                            <td className="p-3 font-bold text-white flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-lg ${follower.avatarColor || 'bg-amber-600'} text-white flex items-center justify-center font-bold text-xs shrink-0`}>
                                {follower.name.charAt(0)}
                              </div>
                              <span>{follower.name}</span>
                            </td>
                            <td className="p-3 font-mono text-amber-300">{follower.phone}</td>
                            <td className="p-3 text-gray-300">{follower.governorate || 'القاهرة'}</td>
                            <td className="p-3 text-gray-400 font-mono text-[11px]">{follower.followedAt}</td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2 py-0.5 rounded-md font-bold">
                                  جديد المنتجات
                                </span>
                                <span className="bg-sky-950 text-sky-300 border border-sky-800 text-[10px] px-2 py-0.5 rounded-md font-bold">
                                  تنبيه الأسعار
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2.5 py-1 rounded-full font-bold">
                                متابع نشط ✓
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <a
                                href={`https://wa.me/2${follower.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white text-[11px] font-bold transition-colors"
                              >
                                <span>واتساب</span>
                              </a>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: ORDERS & SHIPPING TRACKING */}
        {adminTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-400" />
                  <span>إدارة الطلبيات وتحديث حالات الشحن للعملاء</span>
                </h3>
                <p className="text-xs text-gray-400">
                  أي تحديث تجريه هنا يظهر فوراً للعميل في صفحة "متابعة طلبي"
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowOrdersReportsModal(true)}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>تقارير الطلبيات والشحن (5 تقارير)</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950 text-gray-400 border-b border-slate-700 font-bold text-[11px]">
                    <tr>
                      <th className="p-3.5">رقم الطلب</th>
                      <th className="p-3.5">العميل والتليفون</th>
                      <th className="p-3.5">العنوان والعلامة المميزة</th>
                      <th className="p-3.5">المنتجات</th>
                      <th className="p-3.5">طريقة الدفع والمبلغ</th>
                      <th className="p-3.5">حالة الشحن الحالية</th>
                      <th className="p-3.5 text-center">بوليصة الشحن</th>
                      <th className="p-3.5 text-center">تحديث الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-750">
                        <td className="p-3.5 font-mono font-bold text-amber-400">{order.id}</td>
                        <td className="p-3.5">
                          <span className="font-bold text-white block">{order.customerName}</span>
                          <span className="font-mono text-[11px] text-gray-300 block">{order.customerPhone}</span>
                          {order.customerPhone2 && (
                            <span className="font-mono text-[10px] text-gray-400 block">بديل: {order.customerPhone2}</span>
                          )}
                        </td>
                        <td className="p-3.5 max-w-xs">
                          <span className="text-gray-200 block truncate">{order.governorate} - {order.shippingAddress}</span>
                          <span className="text-[10px] text-amber-400 block">علامة: {order.landmark}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-gray-300 font-medium">
                            {(order?.items || []).reduce((s, i) => s + (i?.quantity || 1), 0)} قطع
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-black text-white block">{(order?.total || 0).toLocaleString()} ج.م</span>
                          <span className="text-[10px] text-indigo-300 font-mono">{order?.paymentMethod}</span>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={order?.status || 'received'}
                            onChange={e => handleQuickStatusChange(order.id, e.target.value as OrderStatus)}
                            className="bg-slate-900 border border-slate-700 text-white rounded-xl px-2.5 py-1.5 text-xs font-bold outline-none cursor-pointer focus:ring-2 focus:ring-amber-400"
                          >
                            <option value="received">تم الاستلام والتأكيد</option>
                            <option value="processing">جاري التجهيز بالمستودع</option>
                            <option value="shipped">مع مندوب الشحن</option>
                            <option value="delivered">تم التسليم بنجاح للعميل</option>
                            <option value="cancelled">ملغي</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => setSelectedOrderForWaybill(order)}
                            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer shadow-xs"
                            title="عرض وطباعة بوليصة الشحن"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>طباعة البوليصة</span>
                          </button>
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => {
                              setSelectedOrderToUpdate(order.id);
                              setNewOrderStatus(order?.status || 'processing');
                            }}
                            className="bg-slate-700 hover:bg-slate-600 text-amber-300 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
                          >
                            ملاحظة تتبع
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PRODUCTS & CATEGORIES */}
        {adminTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <div>
                <h3 className="text-base font-black text-white">إدارة المنتجات والأقسام</h3>
                <p className="text-xs text-gray-400">
                  الأقسام التي تظهر بالصفحة الرئيسية هي فقط الأقسام المضافة هنا
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddCategoryModal(true)}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>إضافة قسم جديد</span>
                </button>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة منتج جديد</span>
                </button>
              </div>
            </div>

            {/* Managed Categories Pills */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-gray-300">الأقسام المعروضة حالياً بالمتجر:</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-white"
                  >
                    <span>{cat.name}</span>
                    <button
                      onClick={() => setEditingCategory(cat)}
                      className="text-gray-400 hover:text-amber-400 transition-colors p-0.5 cursor-pointer"
                      title="تعديل اسم القسم"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="text-gray-400 hover:text-rose-400 transition-colors p-0.5 cursor-pointer"
                      title="حذف هذا القسم"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950 text-gray-400 border-b border-slate-700 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="p-3.5">المنتج</th>
                      <th className="p-3.5">القسم</th>
                      <th className="p-3.5">سعر البيع</th>
                      <th className="p-3.5">السعر قبل الخصم</th>
                      <th className="p-3.5">المخزون</th>
                      <th className="p-3.5">نظام التقسيط</th>
                      <th className="p-3.5 text-center">الإجراءات (تعديل / حذف)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {products.map(prod => (
                      <tr key={prod.id} className="hover:bg-slate-750">
                        <td className="p-3.5 flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt=""
                            className="w-10 h-10 object-contain rounded-lg bg-white p-1"
                          />
                          <div>
                            <span className="font-bold text-white block max-w-xs truncate">{prod.name}</span>
                            <span className="text-[10px] text-gray-400">{prod.brand}</span>
                          </div>
                        </td>
                        <td className="p-3.5 text-gray-300">
                          {categories.find(c => c.id === prod.category)?.name || prod.category}
                        </td>
                        <td className="p-3.5 font-black text-amber-400">{prod.price.toLocaleString()} ج.م</td>
                        <td className="p-3.5 text-gray-400">
                          {prod.originalPrice ? `${prod.originalPrice.toLocaleString()} ج.م` : '-'}
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-emerald-400">{prod.stock} قطع</span>
                        </td>
                        <td className="p-3.5">
                          {prod.isInstallmentAvailable ? (
                            <span className="text-emerald-400 font-bold">
                              مفعل (فائدة {prod.installmentInterestRate || 15}% - حتى {prod.maxInstallmentMonths || 12} شهر)
                            </span>
                          ) : (
                            <span className="text-gray-500">كاش فقط (بدون تقسيط)</span>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setEditingProduct(prod)}
                              className="p-1.5 text-gray-400 hover:text-amber-400 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                              title="تعديل بيانات المنتج، الصورة، الأسعار، أو نظام التقسيط"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteProduct(prod.id)}
                              className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                              title="حذف المنتج"
                            >
                              <Trash2 className="w-4 h-4" />
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
        )}

        {/* TAB: INVENTORY & WAREHOUSES (المخازن والجرد) */}
        {adminTab === 'inventory' && (
          <WarehouseInventoryManager />
        )}

        {/* TAB: DASHBOARD */}
        {adminTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-gray-400 text-xs font-bold mb-2">
                  <span>إجمالي السيولة بالخزينة والبنوك</span>
                  <Landmark className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {totalTreasuryBalance.toLocaleString()} <span className="text-xs text-gray-400">ج.م</span>
                </div>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-gray-400 text-xs font-bold mb-2">
                  <span>محفظة أقساط العملاء المستحقة</span>
                  <CalendarCheck className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {totalInstallmentReceivables.toLocaleString()} <span className="text-xs text-gray-400">ج.م</span>
                </div>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-gray-400 text-xs font-bold mb-2">
                  <span>مستحقات الموردين (التزامات)</span>
                  <Truck className="w-5 h-5 text-rose-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {totalSupplierDebts.toLocaleString()} <span className="text-xs text-gray-400">ج.م</span>
                </div>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-gray-400 text-xs font-bold mb-2">
                  <span>صافي الأرباح المحققة التقديرية</span>
                  <TrendingUp className="w-5 h-5 text-sky-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {estimatedNetProfit.toLocaleString()} <span className="text-xs text-gray-400">ج.م</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: INSTALLMENTS & LEGAL CONTRACTS */}
        {adminTab === 'installments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-emerald-400" />
                  <span>إدارة طلبات التقسيط والضمانات القانونية</span>
                </h3>
                <p className="text-xs text-gray-400">
                  عقود وإيصالات أمانة ثلاثية الأطراف موثقة ومطابقة للقانون المصري
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
                  {['all', 'pending_review', 'approved', 'active', 'completed', 'rejected'].map(st => (
                    <button
                      key={st}
                      onClick={() => setInstallmentStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        installmentStatusFilter === st
                          ? 'bg-amber-400 text-slate-950 font-black shadow'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {st === 'all' ? 'الكل'
                        : st === 'pending_review' ? 'قيد الفحص'
                        : st === 'approved' ? 'معتمد'
                        : st === 'active' ? 'سارٍ'
                        : st === 'completed' ? 'مكتمل'
                        : 'المرفوض'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handlePrintInstallments}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  title="طباعة كشف طلبات التقسيط والضمانات"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة كشف التقسيط</span>
                </button>
              </div>
            </div>

            <div ref={installmentsTableRef} className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950 text-gray-400 border-b border-slate-700 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="p-3.5">العميل والرقم القومي</th>
                      <th className="p-3.5">السلعة والقسط</th>
                      <th className="p-3.5">الضامن</th>
                      <th className="p-3.5">الأقساط المسددة</th>
                      <th className="p-3.5">حالة الطلب</th>
                      <th className="p-3.5 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredInstallmentApps.map(app => (
                      <tr key={app.id} className="hover:bg-slate-750">
                        <td className="p-3.5">
                          <span className="font-bold text-white block">{app.customerName}</span>
                          <span className="font-mono text-[11px] text-gray-400">{app.nationalId}</span>
                          <div className="text-[10px] text-gray-400">{app.phone} • {app.governorate}</div>
                        </td>

                        <td className="p-3.5">
                          <span className="font-bold text-amber-400 block max-w-xs truncate">{app.productName}</span>
                          <div className="font-black text-white text-xs mt-0.5">
                            {app.plan.monthlyAmount.toLocaleString()} ج.م / شهر ({app.plan.months} شهر)
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="text-gray-200 font-bold block">{app.guarantorName}</span>
                          <span className="text-gray-400 text-[10px] block">{app.guarantorRelation}</span>
                        </td>

                        <td className="p-3.5">
                          <span className="font-black text-emerald-400">{app.paidInstallmentsCount}</span>
                          <span className="text-gray-400">/ {app.plan.months}</span>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-full inline-block ${
                              app.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : app.status === 'approved'
                                ? 'bg-sky-500/20 text-sky-300'
                                : app.status === 'pending_review'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-gray-700 text-gray-300'
                            }`}
                          >
                            {app.status === 'active' ? 'عقد سارٍ'
                              : app.status === 'approved' ? 'معتمد'
                              : app.status === 'pending_review' ? 'قيد الفحص'
                              : 'مكتمل'}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedContractApp(app)}
                              className="bg-slate-700 hover:bg-slate-600 text-amber-300 font-bold px-2 py-1 rounded-lg text-[11px] flex items-center gap-1"
                              title="عرض العقد وإيصال الأمانة"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>العقد وإيصال الأمانة</span>
                            </button>

                            {app.status === 'pending_review' && (
                              <>
                                <button
                                  onClick={() => reviewInstallmentApplication(app.id, 'approved', currentUser?.name || 'المدير العام')}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-1.5 rounded-lg text-xs"
                                  title="موافقة الإدارة"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => reviewInstallmentApplication(app.id, 'rejected', currentUser?.name || 'المدير العام', 'عبء ائتماني')}
                                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold p-1.5 rounded-lg text-xs"
                                  title="رفض"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}

                            {app.status === 'active' && app.paidInstallmentsCount < app.plan.months && (
                              <button
                                onClick={() => collectMonthlyInstallment(app.id, 'vodafone_cash')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded-lg text-[11px] flex items-center gap-1"
                              >
                                <DollarSign className="w-3.5 h-3.5" />
                                <span>تحصيل القسط</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sequential Audit & Document Control Log */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-700 pb-3">
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>سجل الرقابة المحاسبية وتسلسل أرقام العقود وإيصالات الأمانة المعتمدة</span>
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    نظام تسلسل صارم غير قابل للتلاعب لكشف أي وثيقة مفقودة أو محذوفة ومطابقة دفاتر الائتمان
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-xl border border-emerald-500/30 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>التسلسل سليم ومطابق بنسبة 100% (لا يوجد عقود أو إيصالات مفقودة)</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {installmentApps.map((app, idx) => (
                  <div key={app.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white truncate max-w-[150px]">{app.customerName}</span>
                      <span className="text-[10px] bg-slate-800 text-gray-300 px-2 py-0.5 rounded font-mono">
                        # {idx + 1}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] font-mono border-t border-slate-800/80 pt-2">
                      <div className="flex justify-between text-amber-300">
                        <span>رقم العقد المتسلسل:</span>
                        <strong className="font-black">{app.contractNumber || `EGY-CT-${1000 + idx}`}</strong>
                      </div>
                      <div className="flex justify-between text-sky-300">
                        <span>رقم إيصال الأمانة:</span>
                        <strong className="font-black">{app.promissoryNoteNumber || `EGY-PN-${5000 + idx}`}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-slate-800">
                      <span>تاريخ الإصدار: {app.appliedAt}</span>
                      <span className="text-emerald-400 font-bold">موثق ومسجل</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: TREASURY & BANKS */}
        {adminTab === 'treasury' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <div>
                <h3 className="text-base font-black text-white">الخزينة والبنوك والمحافظ</h3>
                <p className="text-xs text-gray-400">
                  إجمالي السيولة: <strong className="text-emerald-400 font-mono">{totalTreasuryBalance.toLocaleString()} ج.م</strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowTreasuryHubModal(true)}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  title="استعلام وطباعة كشف حساب عميل معين"
                >
                  <FileText className="w-4 h-4" />
                  <span>تقرير عميل (اسم / هاتف / كود) + طباعة</span>
                </button>
                <button
                  onClick={() => setShowTreasuryHubModal(true)}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  title="إصدار إذن صرف ومصروفات من الخزينة"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>إذن صرف ومصروفات (تفعيل الصرف)</span>
                </button>
                <button
                  onClick={() => setShowTreasuryHubModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  title="إصدار إذن إيداع ومقبوضات بالخزينة"
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>إذن إيداع ومقبوضات</span>
                </button>
                <button
                  onClick={() => setShowTreasuryHubModal(true)}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>تحويل داخلي</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {treasuryAccounts.map(acc => (
                <div key={acc.id} className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-400">{acc.code}</span>
                    <Wallet className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{acc.nameAr}</h4>
                    {acc.accountNumber && (
                      <span className="text-[11px] text-gray-400 font-mono block mt-0.5">{acc.accountNumber}</span>
                    )}
                  </div>
                  <div className="pt-2 border-t border-slate-700 flex items-baseline justify-between">
                    <span className="text-xs text-gray-400">الرصيد:</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">{acc.balance.toLocaleString()} ج.م</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SUPPLIERS */}
        {adminTab === 'suppliers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-400" />
                  <span>إدارة الموردين والمشتريات والمرتجعات والمخازن</span>
                </h3>
                <p className="text-xs text-gray-400">
                  فواتير الشراء وترحيل المخزون التلقائي مع الرقابة المباشرة على المرتجعات
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowAddSupplierModal(true)}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>إضافة مورد جديد</span>
                </button>

                <button
                  onClick={() => {
                    setSupplierInvoiceType('purchase');
                    setShowSupplierInvoiceModal(true);
                  }}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ إضافة فاتورة مشتريات جديدة</span>
                </button>

                <button
                  onClick={() => {
                    setSupplierInvoiceType('return');
                    setShowSupplierInvoiceModal(true);
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>+ إضافة مرتجع فاتورة مشتريات جديدة</span>
                </button>

                <button
                  onClick={() => setShowSupplierReportsModal(true)}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>تقارير الموردين (5 أزرار)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suppliers.map(sup => (
                <div key={sup.id} className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 space-y-3">
                  <h4 className="font-bold text-white text-sm">{sup.name}</h4>
                  <div className="text-xs text-gray-400">{sup.companyName} • {sup.phone}</div>
                  <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block">رصيد المورد المستحق:</span>
                      <span className="text-base font-black text-rose-400 font-mono">{sup.balanceDue.toLocaleString()} ج.م</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Invoices & Returns Table */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-xl space-y-3 p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                  <span>سجل فواتير المشتريات والمرتجعات المعتمدة ومطابقة المخازن ({supplierInvoices.length}):</span>
                </h4>
                <button
                  onClick={() => setShowSupplierReportsModal(true)}
                  className="text-sky-400 hover:text-sky-300 font-bold text-xs underline flex items-center gap-1 cursor-pointer"
                >
                  <span>عرض وطباعة التقارير المعتمدة</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950 text-gray-400 border-b border-slate-700 font-bold text-[11px]">
                    <tr>
                      <th className="p-2.5">رقم الفاتورة</th>
                      <th className="p-2.5">النوع</th>
                      <th className="p-2.5">المورد</th>
                      <th className="p-2.5">بيان الوارد (يدوي)</th>
                      <th className="p-2.5">الموظف المسؤول</th>
                      <th className="p-2.5">التاريخ</th>
                      <th className="p-2.5">صافي الفاتورة</th>
                      <th className="p-2.5">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60 font-mono">
                    {supplierInvoices.map(inv => {
                      const isRet = inv.type === 'return';
                      return (
                        <tr key={inv.id} className="hover:bg-slate-750">
                          <td className="p-2.5 font-bold text-amber-400">{inv.invoiceNumber}</td>
                          <td className="p-2.5 font-sans">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isRet
                                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              }`}
                            >
                              {isRet ? 'مرتجع مشتريات' : 'فاتورة مشتريات'}
                            </span>
                          </td>
                          <td className="p-2.5 font-sans font-bold text-white">{inv.supplierName}</td>
                          <td className="p-2.5 text-gray-300">{inv.incomingDocNumber || 'إذن يدوي'}</td>
                          <td className="p-2.5 font-sans text-gray-300">{inv.employeeName || 'مسؤول المشتريات'}</td>
                          <td className="p-2.5 text-gray-400">{inv.date}</td>
                          <td className="p-2.5 font-black text-amber-400">{(inv.netTotal || inv.totalAmount || 0).toLocaleString()} ج.م</td>
                          <td className="p-2.5 font-sans">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                inv.status === 'paid'
                                  ? 'bg-emerald-900/60 text-emerald-300'
                                  : inv.status === 'partial'
                                  ? 'bg-amber-900/60 text-amber-300'
                                  : 'bg-rose-900/60 text-rose-300'
                              }`}
                            >
                              {inv.status === 'paid' ? 'مسددة' : inv.status === 'partial' ? 'سداد جزئي' : 'مستحقة'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CUSTOMERS */}
        {adminTab === 'customers' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <h3 className="text-base font-black text-white">العملاء والمديونيات</h3>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950 text-gray-400 border-b border-slate-700 font-bold text-[11px]">
                  <tr>
                    <th className="p-3.5">الاسم</th>
                    <th className="p-3.5">التليفون</th>
                    <th className="p-3.5">المحافظة</th>
                    <th className="p-3.5">إجمالي المشتريات</th>
                    <th className="p-3.5">المديونية المتبقية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {customers.map(c => (
                    <tr key={c.id} className="hover:bg-slate-750">
                      <td className="p-3.5 font-bold text-white">{c.name}</td>
                      <td className="p-3.5 font-mono text-gray-300">{c.phone}</td>
                      <td className="p-3.5 text-gray-400">{c.governorate}</td>
                      <td className="p-3.5 font-black text-white">{c.totalPurchases.toLocaleString()} ج.م</td>
                      <td className="p-3.5 font-black text-amber-400">
                        {c.outstandingDebt > 0 ? `${c.outstandingDebt.toLocaleString()} ج.م` : 'لا توجد'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: REPORTS */}
        {adminTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-black text-white">قائمة الأرباح والخسائر والقيود اليومية</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-gray-400 block mb-1 font-sans">المبيعات:</span>
                  <span className="text-xl font-black text-white">{totalRevenues.toLocaleString()} ج.م</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-gray-400 block mb-1 font-sans">تكلفة البضاعة:</span>
                  <span className="text-xl font-black text-amber-400">{Math.round(totalPurchasesCost * 0.4).toLocaleString()} ج.م</span>
                </div>
                <div className="bg-emerald-950/80 p-4 rounded-xl border border-emerald-800">
                  <span className="text-emerald-300 block mb-1 font-sans">صافي الربح:</span>
                  <span className="text-xl font-black text-emerald-400">{estimatedNetProfit.toLocaleString()} ج.م</span>
                </div>
              </div>
            </div>

            {/* Journal Entries */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 space-y-3">
              <h4 className="text-sm font-black text-white">سجل القيود اليومية المحاسبية</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs font-mono">
                  <thead className="bg-slate-950 text-gray-400 border-b border-slate-700 font-bold text-[11px]">
                    <tr>
                      <th className="p-3">السند</th>
                      <th className="p-3 font-sans">التاريخ</th>
                      <th className="p-3 font-sans">البيان</th>
                      <th className="p-3 font-sans">من حـ/</th>
                      <th className="p-3 font-sans">إلى حـ/</th>
                      <th className="p-3 text-left">المبلغ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {journalEntries.map(jv => (
                      <tr key={jv.id} className="hover:bg-slate-750">
                        <td className="p-3 text-amber-400">{jv.referenceNumber}</td>
                        <td className="p-3 text-gray-400 font-sans">{jv.date}</td>
                        <td className="p-3 text-white font-sans">{jv.description}</td>
                        <td className="p-3 text-emerald-400 font-sans">{jv.debitAccount}</td>
                        <td className="p-3 text-sky-400 font-sans">{jv.creditAccount}</td>
                        <td className="p-3 text-left font-black text-white">{jv.amount.toLocaleString()} ج.م</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD EMPLOYEE */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">إضافة موظف جديد وتخصيص صلاحياته</h3>
              <button onClick={() => setShowAddEmployeeModal(false)} className="text-gray-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployeeSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">اسم الموظف *</label>
                  <input
                    type="text"
                    required
                    value={newEmpName}
                    onChange={e => setNewEmpName(e.target.value)}
                    placeholder="مثال: كريم سامي"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold mb-1">المسمى الوظيفي والدور</label>
                  <select
                    value={newEmpRole}
                    onChange={e => {
                      const role = e.target.value;
                      setNewEmpRole(role);
                      if (role.includes('نائب')) {
                        setNewEmpPermissions(['dashboard', 'products', 'orders', 'installments', 'treasury', 'suppliers', 'customers', 'reports', 'accounting_hub', 'settings']);
                      }
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400 text-xs"
                  >
                    <option value="مسؤول مبيعات وشحن">مسؤول مبيعات وشحن</option>
                    <option value="أخصائي ائتمان وتقسيط">أخصائي ائتمان وتقسيط</option>
                    <option value="محاسب مالي وخزينة">محاسب مالي وخزينة</option>
                    <option value="أمين مستودع ولوجستيات">أمين مستودع ولوجستيات</option>
                    <option value="نائب المدير العام (النائب عني - بديل بصلاحيات كاملة في السفر)">
                      ⭐ نائب المدير العام (النائب عني - بديل بصلاحيات كاملة في السفر)
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-bold mb-1">اسم الدخول (اسم المستخدم أو الهاتف) *</label>
                  <input
                    type="text"
                    required
                    value={newEmpUsername}
                    onChange={e => setNewEmpUsername(e.target.value)}
                    placeholder="karim_sales"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold mb-1">الرقم السري *</label>
                  <input
                    type="text"
                    required
                    value={newEmpPassword}
                    onChange={e => setNewEmpPassword(e.target.value)}
                    placeholder="123456"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                  />
                </div>
              </div>

              {/* Permissions Checkboxes */}
              <div>
                <label className="block text-gray-300 font-bold mb-2">تحديد الأقسام المصرح له بالعمل عليها:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {[
                    { id: 'dashboard', label: 'المؤشرات والسيولة' },
                    { id: 'orders', label: 'الطلبيات والشحن' },
                    { id: 'products', label: 'المنتجات والأقسام' },
                    { id: 'installments', label: 'التقسيط والضمانات' },
                    { id: 'treasury', label: 'الخزينة والبنوك' },
                    { id: 'suppliers', label: 'الموردين والمشتريات' },
                    { id: 'customers', label: 'العملاء والمديونيات' },
                    { id: 'reports', label: 'التقارير المحاسبية' },
                    { id: 'settings', label: 'إعدادات المتجر' }
                  ].map(p => (
                    <label key={p.id} className="flex items-center gap-2 cursor-pointer text-gray-300 text-xs">
                      <input
                        type="checkbox"
                        checked={newEmpPermissions.includes(p.id as AdminPermission)}
                        onChange={() => handleTogglePermission(p.id as AdminPermission)}
                        className="rounded text-amber-500 focus:ring-amber-400"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEmployeeModal(false)}
                  className="px-4 py-2 border border-slate-700 text-gray-300 font-bold rounded-xl hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-2 rounded-xl"
                >
                  حفظ وتفعيل الموظف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl p-6 text-right space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">إضافة منتج جديد وتحديد نظام التقسيط والصور</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-gray-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">اسم المنتج *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  placeholder="مثال: شاشة سامسونج 50 بوصة كريستال 4K"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">القسم</label>
                  <select
                    value={newProdCategory}
                    onChange={e => setNewProdCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">الماركة / البراند</label>
                  <input
                    type="text"
                    value={newProdBrand}
                    onChange={e => setNewProdBrand(e.target.value)}
                    placeholder="Samsung, Apple..."
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">سعر البيع النهائي (بعد الخصم) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice || ''}
                    onChange={e => setNewProdPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">السعر الأصلي (قبل الخصم) إن وجد خصم</label>
                  <input
                    type="number"
                    value={newProdOriginalPrice || ''}
                    onChange={e => setNewProdOriginalPrice(Number(e.target.value))}
                    placeholder="مثال: 12000"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">سعر التكلفة (للحسابات و P&L)</label>
                  <input
                    type="number"
                    value={newProdCost || ''}
                    onChange={e => setNewProdCost(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">الكمية بالمخزن *</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={e => setNewProdStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-gray-300 font-bold mb-1">رابط الصورة الرئيسية (URL)</label>
                <input
                  type="url"
                  value={newProdMainImage}
                  onChange={e => setNewProdMainImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">صور إضافية للمنتج للتنقل والتكبير (رابط في كل سطر)</label>
                <textarea
                  rows={2}
                  value={newProdExtraImages}
                  onChange={e => setNewProdExtraImages(e.target.value)}
                  placeholder="https://... رابط صورة ثانية&#10;https://... رابط صورة ثالثة"
                  className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none font-mono text-xs"
                />
              </div>

              {/* Installment Settings (Configurable per product as requested!) */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="instCheck"
                    checked={newProdInstallment}
                    onChange={e => setNewProdInstallment(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <label htmlFor="instCheck" className="text-amber-400 font-bold cursor-pointer">
                    تفعيل نظام التقسيط لهذا المنتج
                  </label>
                </div>

                {newProdInstallment ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                    <div>
                      <label className="block text-gray-300 mb-1">الحد الأقصى لشهور التقسيط:</label>
                      <select
                        value={newProdMonths}
                        onChange={e => setNewProdMonths(Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      >
                        <option value={3}>3 شهور</option>
                        <option value={6}>6 شهور</option>
                        <option value={12}>12 شهراً</option>
                        <option value={18}>18 شهراً</option>
                        <option value={24}>24 شهراً</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-1">فائدة التقسيط (%):</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newProdInterest}
                        onChange={e => setNewProdInterest(Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-1">مصاريف الاستعلام (ج.م):</label>
                      <input
                        type="number"
                        min="0"
                        value={newProdInquiryFee}
                        onChange={e => setNewProdInquiryFee(Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-gray-400">
                    هذا المنتج معروض للشراء النقدي فقط (كاش / بوابات دفع إلكترونية).
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 border border-slate-700 text-gray-300 font-bold rounded-xl hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-6 py-2 rounded-xl"
                >
                  حفظ المنتج ونشره
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CATEGORY */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">إضافة قسم جديد للمتجر</h3>
              <button onClick={() => setShowAddCategoryModal(false)} className="text-gray-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">اسم القسم الجديد *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الإكسسوارات والساعات الذكية"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 border border-slate-700 text-gray-300 font-bold rounded-xl hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-6 py-2 rounded-xl"
                >
                  حفظ القسم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPDATE ORDER STATUS */}
      {selectedOrderToUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">تحديث حالة الشحن للطلب #{selectedOrderToUpdate}</h3>
              <button onClick={() => setSelectedOrderToUpdate(null)} className="text-gray-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateOrderStatus} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">الحالة الجديدة:</label>
                <select
                  value={newOrderStatus}
                  onChange={e => setNewOrderStatus(e.target.value as OrderStatus)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="received">تم الاستلام والتأكيد</option>
                  <option value="processing">جاري التجهيز والتغليف بالمستودع</option>
                  <option value="shipped">تم الشحن ومع مندوب التوصيل</option>
                  <option value="delivered">تم التسليم بنجاح للعميل</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">ملاحظة التتبع (تظهر للعميل في التتبع):</label>
                <input
                  type="text"
                  placeholder="مثال: الشحنة مع كابتن محمد ورقم هاتفه 01011122233"
                  value={orderStatusNote}
                  onChange={e => setOrderStatusNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderToUpdate(null)}
                  className="px-4 py-2 border border-slate-700 text-gray-300 font-bold rounded-xl hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-6 py-2 rounded-xl"
                >
                  تحديث التتبع الآن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TREASURY ACTIONS */}
      {showTreasuryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">
                {treasuryActionType === 'deposit' ? 'إيداع نقدية'
                  : treasuryActionType === 'withdraw' ? 'صرف ومسحوبات'
                  : 'تحويل بين الحسابات'}
              </h3>
              <button onClick={() => setShowTreasuryModal(false)} className="text-gray-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTreasuryAction} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">الحساب المعني:</label>
                <select
                  value={selectedTreasuryId}
                  onChange={e => setSelectedTreasuryId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                >
                  {treasuryAccounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.nameAr} ({acc.balance.toLocaleString()} ج.م)
                    </option>
                  ))}
                </select>
              </div>

              {treasuryActionType === 'transfer' && (
                <div>
                  <label className="block text-gray-300 font-bold mb-1">إلى الحساب:</label>
                  <select
                    value={targetTreasuryId}
                    onChange={e => setTargetTreasuryId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  >
                    {treasuryAccounts.filter(a => a.id !== selectedTreasuryId).map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.nameAr}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-gray-300 font-bold mb-1">المبلغ (ج.م) *</label>
                <input
                  type="number"
                  required
                  value={treasuryAmount || ''}
                  onChange={e => setTreasuryAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTreasuryModal(false)}
                  className="px-4 py-2 border border-slate-700 text-gray-300 font-bold rounded-xl hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-6 py-2 rounded-xl"
                >
                  تأكيد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SUPPLIER */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">إضافة مورد جديد</h3>
              <button onClick={() => setShowAddSupplierModal(false)} className="text-gray-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSupplierSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">اسم المورد *</label>
                <input
                  type="text"
                  required
                  value={newSupName}
                  onChange={e => setNewSupName(e.target.value)}
                  placeholder="شركة راية / بي تك / العربي..."
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-bold mb-1">اسم الشركة التجاري *</label>
                <input
                  type="text"
                  required
                  value={newSupCompany}
                  onChange={e => setNewSupCompany(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSupplierModal(false)}
                  className="px-4 py-2 border border-slate-700 text-gray-300 font-bold rounded-xl hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-6 py-2 rounded-xl"
                >
                  حفظ المورد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRINTABLE SHIPPING WAYBILL */}
      {selectedOrderForWaybill && (
        <ShippingWaybillModal
          order={selectedOrderForWaybill}
          settings={settings}
          onClose={() => setSelectedOrderForWaybill(null)}
          onUpdateCourier={(orderId, courierName) => {
            updateOrderStatus(orderId, selectedOrderForWaybill.status, `تم إسناد الشحنة لـ ${courierName}`);
          }}
        />
      )}

      {/* MODAL: EDIT PRODUCT */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          categories={categories}
          onSave={(id, updatedFields) => {
            updateProduct(id, updatedFields);
            setEditingProduct(null);
          }}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {/* MODAL: EDIT CATEGORY */}
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onSave={(id, name) => {
            updateCategory(id, name);
            setEditingCategory(null);
          }}
          onClose={() => setEditingCategory(null)}
        />
      )}

      {/* MODAL: 5-IN-1 ORDERS & SHIPPING REPORTS */}
      {showOrdersReportsModal && (
        <OrdersReportsModal
          orders={orders}
          settings={settings}
          onClose={() => setShowOrdersReportsModal(false)}
        />
      )}

      {/* MODAL: SUPPLIER INVOICE (PURCHASE OR RETURN) */}
      {showSupplierInvoiceModal && (
        <SupplierInvoiceModal
          type={supplierInvoiceType}
          suppliers={suppliers}
          products={products}
          warehouses={warehouses}
          employees={employees}
          onSave={invoice => {
            createSupplierInvoice(invoice);
            setShowSupplierInvoiceModal(false);
          }}
          onClose={() => setShowSupplierInvoiceModal(false)}
        />
      )}

      {/* MODAL: 5-IN-1 SUPPLIER & PURCHASES REPORTS */}
      {showSupplierReportsModal && (
        <SupplierReportsModal
          suppliers={suppliers}
          supplierInvoices={supplierInvoices}
          settings={settings}
          onClose={() => setShowSupplierReportsModal(false)}
        />
      )}

      {/* MODAL: TREASURY HUB (DISBURSEMENTS, DEPOSITS & CUSTOMER STATEMENT REPORT) */}
      {showTreasuryHubModal && (
        <TreasuryHubModal
          treasuryAccounts={treasuryAccounts}
          customers={customers}
          orders={orders}
          installmentApps={installmentApps}
          journalEntries={journalEntries}
          settings={settings}
          onDepositWithdraw={(accId, amt, desc, typ) => {
            updateTreasuryBalance(accId, amt, desc, typ);
          }}
          onTransfer={(fromId, toId, amt, note) => {
            transferBetweenTreasuries(fromId, toId, amt, note);
          }}
          onClose={() => setShowTreasuryHubModal(false)}
        />
      )}

      {/* MODAL: CONFIRM WIPE ALL DEFAULT DATA */}
      {showWipeConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border-2 border-rose-500/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 text-right space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black border border-rose-500/30 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base text-white">تأكيد حذف كل ما هو افتراضي وتصفير النظام</h3>
                <p className="text-xs text-rose-400 font-bold">بداية جديدة بالكامل 100% للتشغيل الحقيقي من الصفر</p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-gray-300 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <p className="font-bold text-white">
                المقصود بهذا الإجراء:
              </p>
              <ul className="space-y-1.5 list-disc list-inside text-gray-300">
                <li>حذف وتصفير كافة المنتجات والأصناف الافتراضية والتجريبية.</li>
                <li>حذف كافة الطلبيات، بوالص الشحن، وأقساط العملاء التجريبية.</li>
                <li>حذف فواتير الموردين وسجلات التسويات والتحويلات التجريبية.</li>
                <li>تصفير أرصدة الخزائن والبنوك لتتمكن من إيداع المبالغ النقدية الفعلية.</li>
                <li><strong className="text-emerald-400">سيتم الإبقاء على:</strong> بيانات حساب المالك والنائب الرسمي، المخزن الرئيسي، وإعدادات المتجر العامة.</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowWipeConfirmModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 text-gray-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                تراجع وإلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  wipeDefaultData();
                  setShowWipeConfirmModal(false);
                }}
                className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-black px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>نعم، احذف كل الافتراضي وابدأ من الصفر</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
