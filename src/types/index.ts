export type CategoryId = string;

export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  icon?: string;
  badge?: string;
  itemCount?: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number; // السعر بعد الخصم (أو السعر الحالي)
  originalPrice?: number; // السعر قبل الخصم
  costPrice: number;
  stock: number;
  rating: number;
  ratingCount: number;
  image: string; // الصورة الرئيسية
  images: string[]; // صور متعددة للتنقل والتكبير
  description: string;
  brand: string;
  isInstallmentAvailable: boolean;
  installmentInterestRate?: number; // نسبة الفائدة السنوية أو الإجمالية للتقسيط
  inquiryFee?: number; // مصاريف الاستعلام والتحري الميداني
  maxInstallmentMonths?: number;
  minDownPaymentPercent?: number; // نسبة المقدم الأدنى المطلوب
  supplierId?: string;
  supplierCode?: string; // كود المورد أو الشركة الموردة (حتى 6 أرقام)
  itemCode?: string; // كود الصنف (حتى 6 أرقام)
  colorCode?: string; // كود لون الصنف (حتى 6 أرقام)
  warehouseStock?: Record<string, number>; // توزيع الرصيد على المخازن المختلفة (warehouseId -> qty)
  openingStock?: number; // الرصيد الافتتاحي
  openingCost?: number; // تكلفة الرصيد الافتتاحي
  tags?: string[];
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethodType = 
  | 'instapay'
  | 'vodafone_cash' 
  | 'orange_cash'
  | 'etisalat_cash'
  | 'bank_transfer'
  | 'cash_on_delivery' 
  | 'installment';

export interface PaymentDetails {
  method: PaymentMethodType;
  walletNumber?: string;
  instapayHandle?: string;
  bankAccountRef?: string;
  paidAt?: string;
  isPaid: boolean;
}

export interface InstallmentPlan {
  months: number;
  monthlyAmount: number;
  downPayment: number;
  totalFinanced: number;
  totalAmountWithInterest: number;
  interestRate: number;
  administrativeFee: number;
}

export type InstallmentStatus = 'pending_review' | 'approved' | 'rejected' | 'active' | 'completed';

export interface InstallmentDocuments {
  nationalIdFront: string;
  nationalIdBack: string;
  guarantorIdFront?: string;
  guarantorIdBack?: string;
  incomeProof: string;
  utilityBill: string;
  clientPersonalPhoto?: string;
}

export interface InstallmentApplication {
  id: string;
  orderId: string;
  customerName: string;
  nationalId: string;
  phone: string;
  phone2?: string;
  email?: string;
  birthDate?: string;
  address: string;
  landmark: string;
  governorate: string;
  city?: string;
  jobTitle: string;
  employer: string;
  workPhone?: string;
  monthlyIncome: number;
  guarantorName: string;
  guarantorPhone: string;
  guarantorNationalId: string;
  guarantorRelation: string;
  guarantorAddress?: string;
  guarantorJob?: string;
  productId: string;
  productName: string;
  productPrice: number;
  plan: InstallmentPlan;
  status: InstallmentStatus;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  riskScore?: 'low' | 'medium' | 'high';
  documents: InstallmentDocuments;
  contractNumber: string;
  promissoryNoteNumber: string;
  digitalSignatureHash?: string;
  customerSignatureData?: string; // التوقيع الرقمي الفعلي
  signedDate?: string;
  paidInstallmentsCount: number;
  nextDueDate?: string;
}

export type OrderStatus = 'received' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderTimelineItem {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerPhone2?: string; // تليفون إضافي اختياري
  customerEmail?: string; // إيميل اختياري
  shippingAddress: string;
  landmark: string; // علامة مميزة بالمكان (إلزامي)
  governorate: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethodType;
  paymentDetails: PaymentDetails;
  isInstallment: boolean;
  installmentAppId?: string;
  waybillNumber?: string; // رقم بوليصة الشحن المتسلسل
  courierName?: string; // شركة الشحن أو المندوب
  status: OrderStatus;
  statusTimeline: OrderTimelineItem[];
  createdAt: string;
}

// Shipping region configuration
export interface ShippingRegion {
  id: string;
  name: string; // اسم المنطقة أو المحافظة
  fee: number; // تكلفة الشحن بالجنيه المصري
  deliveryDays?: string; // مدة التوصيل المتوقعة
}

// Accounting & ERP
export type TreasuryType = 'safe_cash' | 'bank_nbe' | 'bank_misr' | 'vodafone_cash' | 'orange_cash' | 'etisalat_cash' | 'instapay_merchant';

export interface TreasuryAccount {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  type: TreasuryType;
  accountNumber?: string;
  balance: number;
  currency: 'EGP';
}

export interface Supplier {
  id: string;
  name: string;
  companyName: string;
  phone: string;
  email?: string;
  taxNumber?: string;
  commercialReg?: string;
  balanceDue: number;
  address: string;
  category: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  location?: string;
  isDefault?: boolean;
}

export interface WarehouseTransfer {
  id: string;
  transferNumber: string; // رقم إذن التحويل (تلقائي)
  date: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  productId: string;
  productName: string;
  quantity: number;
  employeeName?: string;
  employeePin?: string;
  notes?: string;
  createdAt: string;
}

export interface InventoryAdjustment {
  id: string;
  adjustmentNumber: string; // رقم إذن التسوية (تلقائي)
  type: 'addition' | 'deduction'; // تسوية إضافة أو تسوية خصم
  date: string;
  warehouseId: string;
  warehouseName: string;
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  reason: string; // سبب التسوية (جرد، تلف، هالك، عجز، بضاعة زائدة، هدايا)
  employeeName?: string;
  notes?: string;
  createdAt: string;
}

export interface SupplierInvoiceItem {
  serialNumber: number;
  productId: string;
  productName: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number; // نسبة الخصم
  priceAfterDiscount: number; // السعر بعد الخصم
  lineTotal: number; // الإجمالي
}

export interface SupplierInvoice {
  id: string;
  type: 'purchase' | 'return'; // فاتورة مشتريات أو مرتجع مشتريات
  supplierId: string;
  supplierName: string;
  invoiceNumber: string; // تلقائي
  incomingDocNumber?: string; // رقم بيان الوارد / إذن التسليم يدوي من المورد
  employeePin?: string; // الرقم السري للموظف المدخل
  employeeName?: string; // اسم الموظف الذي أدخل الفاتورة
  date: string;
  items: SupplierInvoiceItem[];
  subtotal: number;
  discountAllowed: number; // الخصم المسموح به
  vatRate: number; // نسبة ضريبة القيمة المضافة (مثل 14%)
  vatAmount: number; // قيمة الضريبة
  netTotal: number; // صافي الفاتورة الإجمالي
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'paid' | 'partial' | 'unpaid';
  dueDate: string;
  notes?: string;
}

export interface CustomerAccount {
  id: string;
  name: string;
  nationalId?: string;
  phone: string;
  phone2?: string;
  governorate: string;
  totalOrders: number;
  totalPurchases: number;
  outstandingDebt: number;
  status: 'active' | 'blocked' | 'vip';
}

export interface JournalEntry {
  id: string;
  date: string;
  referenceNumber: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  category: 'sale' | 'purchase' | 'installment_interest' | 'expense' | 'transfer' | 'installment_collection' | 'closing';
}

// Employee Roles & Permissions
export type AdminPermission = 
  | 'dashboard' 
  | 'products' 
  | 'inventory'
  | 'orders' 
  | 'installments' 
  | 'treasury' 
  | 'suppliers' 
  | 'customers' 
  | 'reports' 
  | 'accounting_hub'
  | 'settings';

export interface EmployeeUser {
  id: string;
  username: string; // Phone number or handle
  name: string;
  passwordHash: string; // Verification
  jobRole: string; // e.g. 'مدير عام', 'مسؤول مبيعات', 'أخصائي ائتمان', 'محاسب'
  permissions: AdminPermission[];
  isActive: boolean;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string; // e.g. "سوق مصر الكبرى" or custom
  topBannerText: string;
  supportPhone: string;
  supportEmail: string;
  // Payment credentials shown to customer
  instapayAddress: string;
  vodafoneCashNumber: string;
  orangeCashNumber: string;
  etisalatCashNumber: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountIban: string;
  bankAccountHolder: string;
  // Master Admin Credentials
  adminUsername: string; // Default: '01205520031'
  adminPassword: string; // Default: '11183@96'
  // Store Branding & Identity
  storeLogoUrl?: string; // رابط الشعار الخاص بالمتجر
  storeLogoText?: string; // الرمز أو النص المختصر للشعار (افتراضي: نيل)
  whatsappNumber?: string; // رقم الواتساب لخدمة العملاء (إذا تم حذفه يختفي الباركود من الرئيسية)
  // Governorate & Region Shipping Fees
  shippingFeesByGovernorate: Record<string, number>;
  shippingRegions: ShippingRegion[];
  // Legal Contract & Promissory Note Templates
  legalContractTemplate?: string;
  promissoryNoteTemplate?: string;
  nextContractSequence: number; // تسلسل رقم العقد
  nextReceiptSequence: number; // تسلسل رقم إيصال الأمانة
  defaultInquiryFee: number; // مصاريف الاستعلام الافتراضية
  defaultInstallmentInterestRate: number; // نسبة فائدة التقسيط السنوية الافتراضية (%)
  appShareUrl?: string; // رابط تطبيق المتجر لمشاركته على السوشيال ميديا (يحدده المالك في الإعدادات)
  baseFollowersCount?: number; // عداد المتابعين الأساسي حتى 100 مليون أو أكثر
}

// Store Followers & Customers Community
export interface StoreFollower {
  id: string;
  name: string;
  phone: string;
  governorate?: string;
  followedAt: string;
  notifyOnPriceDrops: boolean;
  notifyOnNewArrivals: boolean;
  avatarColor?: string;
}

// Noon-style Wishlist & Custom Collections
export interface WishlistCollection {
  id: string;
  name: string; // e.g. "منتجات نفسك تشتريها" or custom
  createdAt: string;
  isDefault?: boolean;
}

export interface WishlistItem {
  productId: string;
  collectionId: string;
  addedAt: string;
  savedPrice: number; // to detect price drops!
}
