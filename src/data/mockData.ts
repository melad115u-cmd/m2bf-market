import {
  Category,
  Product,
  TreasuryAccount,
  Supplier,
  SupplierInvoice,
  CustomerAccount,
  JournalEntry,
  InstallmentApplication,
  Order,
  EmployeeUser,
  StoreSettings,
  Warehouse,
  WarehouseTransfer,
  InventoryAdjustment,
  StoreFollower,
  WishlistCollection,
  WishlistItem
} from '../types';

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: 'سوق مصر الكبرى',
  topBannerText: 'عروض حصرية مع أقوى برامج التقسيط الميسر ودعم فوري للدفع بإنستاباي وفودافون كاش ومحافظ المحمول',
  supportPhone: '01205520031',
  supportEmail: 'support@nilemart.eg',
  baseFollowersCount: 2485930, // عداد المتابعين الأساسي الضخم (يقبل حتى 100 مليون فأكثر)
  instapayAddress: 'nilemart@instapay',
  vodafoneCashNumber: '01029384756',
  orangeCashNumber: '01288334455',
  etisalatCashNumber: '01199443322',
  bankName: 'البنك الأهلي المصري (حساب شركات)',
  bankAccountNumber: '1928374650123',
  bankAccountIban: 'EG50000300001928374650123',
  bankAccountHolder: 'شركة سوق مصر الكبرى للتجارة والتوزيع',
  adminUsername: '01205520031',
  adminPassword: '11183@96',
  shippingFeesByGovernorate: {
    'القاهرة': 45,
    'الجيزة': 45,
    'القليوبية': 50,
    'الإسكندرية': 60,
    'الدقهلية (المنصورة)': 60,
    'الغربية (طنطا)': 60,
    'الشرقية (الزقازيق)': 60,
    'المنوفية': 55,
    'البحيرة': 65,
    'كفر الشيخ': 65,
    'دمياط': 70,
    'بورسعيد': 70,
    'الإسماعيلية': 65,
    'السويس': 65,
    'الفيوم': 70,
    'بني سويف': 70,
    'المنيا': 80,
    'أسيوط': 80,
    'سوهاج': 85,
    'قنا': 90,
    'الأقصر': 90,
    'أسوان': 95,
    'البحر الأحمر (الغردقة)': 110,
    'جنوب سيناء (شرم الشيخ)': 110,
    'مرسى مطروح': 95,
    'الوادي الجديد': 120,
    'شمال سيناء': 110
  },
  shippingRegions: [
    { id: 'reg-cairo', name: 'القاهرة الكبرى (القاهرة الجديدة، المعادي، مدينة نصر، الشروق)', fee: 45, deliveryDays: '24 ساعة' },
    { id: 'reg-giza', name: 'الجيزة (الدقي، المهندسين، 6 أكتوبر، الشيخ زايد، الهرم)', fee: 45, deliveryDays: '24 ساعة' },
    { id: 'reg-alex', name: 'الإسكندرية والساحل الشمالي', fee: 60, deliveryDays: '48 ساعة' },
    { id: 'reg-delta', name: 'محافظات الدلتا (المنصورة، طنطا، الزقازيق، المنوفية، القليوبية)', fee: 60, deliveryDays: '48 ساعة' },
    { id: 'reg-canal', name: 'مدن القناة (بورسعيد، الإسماعيلية، السويس)', fee: 65, deliveryDays: '48 ساعة' },
    { id: 'reg-mid-egypt', name: 'شمال ووسط الصعيد (الفيوم، بني سويف، المنيا، أسيوط)', fee: 80, deliveryDays: '2-3 أيام' },
    { id: 'reg-upper-egypt', name: 'جنوب الصعيد (سوهاج، قنا، الأقصر، أسوان)', fee: 95, deliveryDays: '3-4 أيام' },
    { id: 'reg-red-sea', name: 'البحر الأحمر وجنوب سيناء (الغردقة، شرم الشيخ)', fee: 110, deliveryDays: '3-4 أيام' },
    { id: 'reg-matrouh', name: 'مطروح والواحات والوادي الجديد', fee: 110, deliveryDays: '3-5 أيام' }
  ],
  storeLogoUrl: '',
  storeLogoText: 'نيل',
  whatsappNumber: '01205520031',
  nextContractSequence: 1045,
  nextReceiptSequence: 5089,
  defaultInquiryFee: 150,
  defaultInstallmentInterestRate: 15,
  appShareUrl: 'https://ais-pre-bf2eydak6epcocyj37jdvj-877717336206.europe-west2.run.app',
  legalContractTemplate: `عقد بيع بالتقسيط مع حفظ حق الملكية (وفقاً لأحكام القانون المدني المصري)

البند الأول: موضوع التعاقد
باع الطرف الأول وأسقط وتنازل بكافة الضمانات الفعلية والقانونية إلى الطرف الثاني المشتري القابل لذلك البضائع والأجهزة الموضحة بالفاتورة.

البند الثاني: الثمن وطريقة السداد
اتفق الطرفان على أن إجمالي ثمن المبيع بعد إضافة الفوائد والمصاريف الإدارية يقسم على أقساط شهرية متتالية غير قابلة للتجزئة أو التأخير.

البند الثالث: حفظ حق الملكية
تظل ملكية المبيع محبوسة وموقوفة لصالح الطرف الأول البائع ولا تنتقل الملكية للطرف الثاني إلا بعد سداد كامل الثمن وجميع الأقساط والمصروفات.

البند الرابع: التخلف عن السداد
إذا تأخر الطرف الثاني عن سداد أي قسط في ميعاد استحقاقه، تحل باقي الأقساط فوراً ويعتبر العقد مفسوخاً من تلقاء نفسه دون حاجة لتنبيه أو إنذار أو حكم قضائي، مع التزام المشتري بدفع تعويض اتفاقي بواقع 5% شهرياً عن مدة التأخير.

البند الخامس: تضامن الضامن
يقر الضامن المتضامن بأنه كفيل متضامن ومتنازل عن حق التجريد والرجوع، ومسؤول شخصياً بالتضامن والتكافل عن سداد كامل المديونية.`,
  promissoryNoteTemplate: `إيصال أمانة قانوني مشدد (طبقاً لنص المادة 341 من قانون العقوبات المصري)

وصل أمانة بمبلغ مالي مستحق السداد فوراً عند الطلب دون قيد أو شرط، تسلمه الموقع أدناه بصفة أمانة لتسليمه للجهة الدائنة، وفي حال تبديده أو التصرف فيه يعد مبدداً وخائناً للأمانة ومرتكباً للجريمة المنصوص عليها بالمادة 341 عقوبات.`
};

export const INITIAL_EMPLOYEES: EmployeeUser[] = [
  {
    id: 'emp-1',
    username: '01205520031',
    name: 'المدير العام والمالك',
    passwordHash: '11183@96',
    jobRole: 'مدير عام كامل الصلاحيات (Super Admin)',
    permissions: [
      'dashboard',
      'products',
      'orders',
      'installments',
      'treasury',
      'suppliers',
      'customers',
      'reports',
      'accounting_hub',
      'settings'
    ],
    isActive: true,
    createdAt: '2026-10-01'
  },
  {
    id: 'emp-deputy',
    username: 'deputy',
    name: 'النائب الرسمي للمالك والمدير العام',
    passwordHash: '11183@96',
    jobRole: 'النائب الرسمي (كامل الصلاحيات التنفيذية والإدارية)',
    permissions: [
      'dashboard',
      'products',
      'inventory',
      'orders',
      'installments',
      'treasury',
      'suppliers',
      'customers',
      'reports',
      'accounting_hub',
      'settings'
    ],
    isActive: true,
    createdAt: '2026-10-02'
  },
  {
    id: 'emp-2',
    username: 'sales_agent',
    name: 'أحمد صبري (مسؤول المبيعات والطلبيات)',
    passwordHash: '123456',
    jobRole: 'مسؤول مبيعات وشحن',
    permissions: ['products', 'orders', 'customers'],
    isActive: true,
    createdAt: '2026-10-05'
  },
  {
    id: 'emp-3',
    username: 'credit_agent',
    name: 'سارة عبد الله (مسؤولة الائتمان والتقسيط)',
    passwordHash: '123456',
    jobRole: 'أخصائي دراسة ائتمان وعقود تقسيط',
    permissions: ['installments', 'customers'],
    isActive: true,
    createdAt: '2026-10-06'
  },
  {
    id: 'emp-4',
    username: 'accountant',
    name: 'محمد عبد الفتاح (رئيس الحسابات)',
    passwordHash: '123456',
    jobRole: 'محاسب عام وخزينة وبنوك',
    permissions: ['dashboard', 'treasury', 'suppliers', 'reports'],
    isActive: true,
    createdAt: '2026-10-07'
  }
];

// Initial Categories added by admin (Admin can delete or add more anytime)
export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-mobiles', name: 'الموبايلات والتابلت', icon: 'Smartphone' },
  { id: 'cat-appliances', name: 'الأجهزة المنزلية والكهربائية', icon: 'Tv' },
  { id: 'cat-electronics', name: 'اللابتوب والكمبيوتر', icon: 'Laptop' },
  { id: 'cat-fashion', name: 'الملابس والأزياء', icon: 'Shirt' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'آبل آيفون 16 برو ماكس - 256 جيجابايت - تيتانيوم صحراوي',
    category: 'cat-mobiles',
    price: 68500,
    originalPrice: 74900,
    costPrice: 59000,
    stock: 14,
    rating: 4.9,
    ratingCount: 312,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'شاشة Super Retina XDR مقاس 6.9 بوصة مع ProMotion وهيكل من التيتانيوم خفيف الوزن، وزر التحكم في الكاميرا الاحترافي وشريحة A18 Pro الرائدة.',
    brand: 'Apple',
    supplierCode: '100010',
    itemCode: '200101',
    colorCode: '900101',
    openingStock: 14,
    openingCost: 59000,
    warehouseStock: {
      'wh-main': 8,
      'wh-giza': 4,
      'wh-alex': 2,
      'wh-upper': 0
    },
    isInstallmentAvailable: true,
    maxInstallmentMonths: 24,
    minDownPaymentPercent: 10,
    supplierId: 'sup-1',
    tags: ['الأكثر طلباً', 'ضمان محلي'],
    featured: true
  },
  {
    id: 'prod-2',
    name: 'سامسونج جالكسي S25 الترا - سعة 512 جيجابايت مع قلم S-Pen ودعم Galaxy AI',
    category: 'cat-mobiles',
    price: 59999,
    originalPrice: 65000,
    costPrice: 51000,
    stock: 18,
    supplierCode: '100010',
    itemCode: '200102',
    colorCode: '900102',
    openingStock: 18,
    openingCost: 51000,
    warehouseStock: {
      'wh-main': 10,
      'wh-giza': 5,
      'wh-alex': 3,
      'wh-upper': 0
    },
    rating: 4.8,
    ratingCount: 198,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'كاميرا فائقة الدقة 200 ميجابكسل مع تقريب بصري 100x وشاشة Dynamic AMOLED 2X فائقة السطوع تحت الشمس.',
    brand: 'Samsung',
    isInstallmentAvailable: true,
    maxInstallmentMonths: 24,
    minDownPaymentPercent: 10,
    supplierId: 'sup-1',
    tags: ['عروض إكسترا'],
    featured: true
  },
  {
    id: 'prod-3',
    name: 'شاومي ريدمي نوت 14 برو بلس 5G - ذاكرة 256 جيجابايت مع شاحن 120 واط',
    category: 'cat-mobiles',
    price: 17400,
    originalPrice: 19200,
    costPrice: 14800,
    stock: 35,
    supplierCode: '100020',
    itemCode: '200103',
    colorCode: '900103',
    openingStock: 30,
    openingCost: 14800,
    warehouseStock: {
      'wh-main': 20,
      'wh-giza': 8,
      'wh-alex': 5,
      'wh-upper': 2
    },
    rating: 4.6,
    ratingCount: 420,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02596?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'حماية ضد الماء والغبار IP68 وشاشة 1.5K AMOLED منحنية فائقة النقاء مع شاحن 120 واط يشحن الهاتف بالكامل في 19 دقيقة.',
    brand: 'Xiaomi',
    isInstallmentAvailable: false, // لا يوجد تقسيط (كاش فقط للتجربة)
    supplierId: 'sup-2'
  },
  {
    id: 'prod-4',
    name: 'شاشة تورنيدو العربي 65 بوصة 4K UHD سمارت مع ريسيفر داخلي Google TV',
    category: 'cat-appliances',
    price: 21999,
    originalPrice: 25500,
    costPrice: 18500,
    stock: 22,
    supplierCode: '100030',
    itemCode: '200104',
    colorCode: '900104',
    openingStock: 22,
    openingCost: 18500,
    warehouseStock: {
      'wh-main': 12,
      'wh-giza': 6,
      'wh-alex': 4,
      'wh-upper': 0
    },
    rating: 4.7,
    ratingCount: 540,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577979749830-f1d742b96791?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'شاشة العربي بدقة 4K فائقة الوضوح مع نظام Google TV وتحكم صوتي ودعم Netflix وShahid وضمان 3 سنوات.',
    brand: 'Tornado El Araby',
    isInstallmentAvailable: true,
    maxInstallmentMonths: 18,
    minDownPaymentPercent: 0,
    supplierId: 'sup-3'
  },
  {
    id: 'prod-5',
    name: 'تكييف شارب إنفرتر 2.25 حصان بارد/ساخن ديجيتال بلازما كلاستر موفر 60%',
    category: 'cat-appliances',
    price: 43500,
    originalPrice: 47900,
    costPrice: 37000,
    stock: 9,
    rating: 4.9,
    ratingCount: 260,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'تكييف ياباني إنفرتر موفر للكهرباء مع تقنية البلازما كلاستر لتنقية الجو وضمان العربي 5 سنوات.',
    brand: 'Sharp El Araby',
    isInstallmentAvailable: true,
    maxInstallmentMonths: 24,
    minDownPaymentPercent: 15,
    supplierId: 'sup-3'
  },
  {
    id: 'prod-6',
    name: 'لابتوب أبل ماك بوك إير 15 بوصة - شريحة M3 - رام 16 جيجابايت - سعة 512 جيجا SSD',
    category: 'cat-electronics',
    price: 76000,
    originalPrice: 82500,
    costPrice: 66000,
    stock: 8,
    rating: 5.0,
    ratingCount: 88,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'شاشة Liquid Retina قياس 15.3 إنش مع بطارية تدوم حتى 18 ساعة، لوحة مفاتيح Magic Keyboard مريحة وهيكل ألومنيوم فائق الأناقة.',
    brand: 'Apple',
    isInstallmentAvailable: true,
    maxInstallmentMonths: 24,
    minDownPaymentPercent: 20,
    supplierId: 'sup-1'
  },
  {
    id: 'prod-7',
    name: 'جاكيت وتربروف رجالي مبطن فرو كاجوال شتوي مقاوم للأمطار والرياح',
    category: 'cat-fashion',
    price: 1250,
    originalPrice: 1850,
    costPrice: 850,
    stock: 40,
    rating: 4.5,
    ratingCount: 210,
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'خامة ووتربروف أصلية تمنع تسرب المياه والرياح، مع بطانة داخلية سميكة من الفرو الناعم لدفء فائق في الشتاء.',
    brand: 'Defacto Egypt',
    isInstallmentAvailable: false,
    supplierId: 'sup-5'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2026-8801',
    customerName: 'أحمد محمود عبد الرحمن النجار',
    customerPhone: '01002345678',
    customerPhone2: '01229988776',
    customerEmail: 'ahmed.elnaggar@gmail.com',
    shippingAddress: 'عمارة 14 شارع التسعين الشمالي، التجمع الخامس',
    landmark: 'بجوار بنك CIB وأمام مجمع المطاعم',
    governorate: 'القاهرة',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1
      }
    ],
    subtotal: 68500,
    shippingFee: 0,
    discount: 0,
    total: 68500,
    paymentMethod: 'installment',
    paymentDetails: {
      method: 'installment',
      isPaid: true,
      paidAt: '2026-10-02'
    },
    isInstallment: true,
    installmentAppId: 'inst-app-1001',
    status: 'delivered',
    statusTimeline: [
      { status: 'received', timestamp: '2026-10-02 10:30 ص', note: 'تم استلام وتأكيد الطلب وقبول التعاقد' },
      { status: 'processing', timestamp: '2026-10-02 02:15 م', note: 'تم تجهيز الهاتف وفحصه بالمستودع الرئيسي' },
      { status: 'shipped', timestamp: '2026-10-03 09:00 ص', note: 'خرج مع مندوب الشحن للتسليم' },
      { status: 'delivered', timestamp: '2026-10-03 04:45 م', note: 'تم التسليم وتوقيع العقد وإيصال الأمانة بنجاح' }
    ],
    createdAt: '2026-10-02'
  },
  {
    id: 'ORD-2026-8805',
    customerName: 'طارق حسام مصطفى الباز',
    customerPhone: '01223459871',
    customerPhone2: '01001122334',
    customerEmail: 'tarek.elbaz@yahoo.com',
    shippingAddress: 'شارع فوزي معاذ، برج النور، الدور الخامس، سموحة',
    landmark: 'أمام مسجد علي بن أبي طالب ومحطة بنزين مصر للبترول',
    governorate: 'الإسكندرية',
    items: [
      {
        product: INITIAL_PRODUCTS[3],
        quantity: 1
      }
    ],
    subtotal: 21999,
    shippingFee: 0,
    discount: 0,
    total: 21999,
    paymentMethod: 'instapay',
    paymentDetails: {
      method: 'instapay',
      instapayHandle: 'tarek@instapay',
      isPaid: true,
      paidAt: '2026-10-11'
    },
    isInstallment: false,
    status: 'shipped',
    statusTimeline: [
      { status: 'received', timestamp: '2026-10-11 11:00 ص', note: 'تم استلام الطلب وتأكيد سداد إنستاباي' },
      { status: 'processing', timestamp: '2026-10-11 01:30 م', note: 'تم تجهيز الشاشة وتغليفها الآمن' },
      { status: 'shipped', timestamp: '2026-10-12 08:30 ص', note: 'في الطريق مع سيارة الشحن لمحافظة الإسكندرية' }
    ],
    createdAt: '2026-10-11'
  }
];

export const INITIAL_TREASURY_ACCOUNTS: TreasuryAccount[] = [
  {
    id: 'acc-safe',
    code: '10101',
    name: 'Main Safe Cash',
    nameAr: 'الخزينة الرئيسية (نقدية بالدرج والمقر)',
    type: 'safe_cash',
    balance: 148500,
    currency: 'EGP'
  },
  {
    id: 'acc-nbe',
    code: '10201',
    name: 'National Bank of Egypt (NBE)',
    nameAr: 'البنك الأهلي المصري - حساب جاري الشركات',
    type: 'bank_nbe',
    accountNumber: 'EG50000300001928374650123',
    balance: 582400,
    currency: 'EGP'
  },
  {
    id: 'acc-vodafone',
    code: '10301',
    name: 'Vodafone Cash Merchant',
    nameAr: 'محفظة فودافون كاش للتجار (01029384756)',
    type: 'vodafone_cash',
    accountNumber: '01029384756',
    balance: 89350,
    currency: 'EGP'
  },
  {
    id: 'acc-instapay',
    code: '10302',
    name: 'InstaPay Egypt Business',
    nameAr: 'إنستاباي أعمال (nilemart@instapay)',
    type: 'instapay_merchant',
    accountNumber: 'nilemart@instapay',
    balance: 245000,
    currency: 'EGP'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'شركة راية لتوزيع الإلكترونيات والتكنولوجيا',
    companyName: 'Raya Distribution S.A.E',
    phone: '0238276000',
    email: 'distribution@rayacorp.com',
    taxNumber: '100-294-812',
    commercialReg: '14892 الجيزة',
    balanceDue: 215000,
    address: 'القرية الذكية، طريق الإسكندرية الصحراوي',
    category: 'الهواتف الذكية'
  },
  {
    id: 'sup-3',
    name: 'مجموعة العربي للتجارة والصناعة (El Araby Group)',
    companyName: 'El-Araby Group for Trade & Industry',
    phone: '19319',
    email: 'support@elarabygroup.com',
    taxNumber: '302-119-940',
    commercialReg: '10293 المنوفية',
    balanceDue: 380000,
    address: 'قويسنا المنطقة الصناعية / القاهرة',
    category: 'الأجهزة الكهربائية وتورنيدو وشارب'
  }
];

export const INITIAL_SUPPLIER_INVOICES: SupplierInvoice[] = [
  {
    id: 'sinv-101',
    type: 'purchase',
    supplierId: 'sup-3',
    supplierName: 'مجموعة العربي للتجارة والصناعة',
    invoiceNumber: 'ARABY-INV-2026-891',
    incomingDocNumber: 'REC-ARABY-891',
    employeePin: '11183',
    employeeName: 'كريم سامي - مشتريات',
    date: '2026-10-01',
    items: [
      {
        serialNumber: 1,
        productId: 'prod-4',
        productName: 'شاشة تورنيدو العربي 65 بوصة',
        warehouseId: 'wh-main',
        warehouseName: 'المخزن الرئيسي (القاهرة الكبرى)',
        quantity: 15,
        unitPrice: 18500,
        discountPercent: 0,
        priceAfterDiscount: 18500,
        lineTotal: 277500
      }
    ],
    subtotal: 277500,
    discountAllowed: 0,
    vatRate: 0,
    vatAmount: 0,
    netTotal: 277500,
    totalAmount: 277500,
    paidAmount: 150000,
    remainingAmount: 127500,
    status: 'partial',
    dueDate: '2026-10-30'
  }
];

export const INITIAL_CUSTOMERS: CustomerAccount[] = [
  {
    id: 'cust-1',
    name: 'أحمد محمود عبد الرحمن النجار',
    nationalId: '29304150102938',
    phone: '01002345678',
    phone2: '01229988776',
    governorate: 'القاهرة - التجمع الخامس',
    totalOrders: 3,
    totalPurchases: 94500,
    outstandingDebt: 45000,
    status: 'active'
  },
  {
    id: 'cust-2',
    name: 'طارق حسام مصطفى الباز',
    nationalId: '29508101402837',
    phone: '01223459871',
    governorate: 'الإسكندرية - سموحة',
    totalOrders: 2,
    totalPurchases: 32000,
    outstandingDebt: 0,
    status: 'vip'
  }
];

export const INITIAL_INSTALLMENT_APPLICATIONS: InstallmentApplication[] = [
  {
    id: 'inst-app-1001',
    orderId: 'ORD-2026-8801',
    customerName: 'أحمد محمود عبد الرحمن النجار',
    nationalId: '29304150102938',
    phone: '01002345678',
    phone2: '01229988776',
    email: 'ahmed.elnaggar@gmail.com',
    address: 'عمارة 14 شارع التسعين الشمالي، التجمع الخامس',
    landmark: 'بجوار بنك CIB',
    governorate: 'القاهرة',
    jobTitle: 'مهندس برمجيات أول',
    employer: 'Vodafone Intelligent Solutions',
    monthlyIncome: 38000,
    guarantorName: 'محمود عبد الرحمن النجار (الوالد)',
    guarantorPhone: '01099887711',
    guarantorNationalId: '25803120101928',
    guarantorRelation: 'والد العميل',
    productId: 'prod-1',
    productName: 'آبل آيفون 16 برو ماكس - 256 جيجابايت',
    productPrice: 68500,
    plan: {
      months: 12,
      downPayment: 13700,
      totalFinanced: 54800,
      totalAmountWithInterest: 61376,
      monthlyAmount: 5114,
      interestRate: 0.12,
      administrativeFee: 500
    },
    status: 'active',
    appliedAt: '2026-10-02',
    reviewedAt: '2026-10-03',
    reviewedBy: 'المدير العام',
    documents: {
      nationalIdFront: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      nationalIdBack: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      incomeProof: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      utilityBill: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
    },
    contractNumber: 'EG-LGL-2026-00481',
    promissoryNoteNumber: 'EGY-BOND-99021-3P',
    digitalSignatureHash: 'SHA256:8f4c9a2d1e0b57e934a123f8c7e90123ab456cd789ef0123456789abcdef0123',
    signedDate: '2026-10-03',
    paidInstallmentsCount: 1,
    nextDueDate: '2026-11-03'
  }
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'je-1',
    date: '2026-10-02',
    referenceNumber: 'JV-2026-001',
    description: 'تحصيل مقدم تقسيط نقدياً بالخزينة لطلب آيفون 16 برو ماكس #ORD-2026-8801',
    debitAccount: 'حـ/ الخزينة الرئيسية (10101)',
    creditAccount: 'حـ/ دفعات العملاء المقدمة (20101)',
    amount: 13700,
    category: 'sale'
  },
  {
    id: 'je-2',
    date: '2026-10-11',
    referenceNumber: 'JV-2026-002',
    description: 'تحصيل مبيعات متجر كاش عبر إنستاباي لطلب شاشة تورنيدو #ORD-2026-8805',
    debitAccount: 'حـ/ إنستاباي مصر للتجار (10302)',
    creditAccount: 'حـ/ إيراد مبيعات فورية (40101)',
    amount: 21999,
    category: 'sale'
  }
];

export const INITIAL_WAREHOUSES: Warehouse[] = [
  { id: 'wh-main', code: '100001', name: 'المخزن الرئيسي (القاهرة الكبرى)', location: 'المنطقة اللوجستية - التجمع الخامس', isDefault: true },
  { id: 'wh-giza', code: '100002', name: 'مستودع الجيزة والمنطقة الصناعية (6 أكتوبر)', location: 'المنطقة الصناعية الثالثة' },
  { id: 'wh-alex', code: '100003', name: 'مستودع الإسكندرية والوجه البحري', location: 'العامرية - الطريق الصحراوي' },
  { id: 'wh-upper', code: '100004', name: 'مستودع الصعيد والوجه القبلي (أسيوط/سوهاج)', location: 'أسيوط الجديدة' }
];

export const INITIAL_WAREHOUSE_TRANSFERS: WarehouseTransfer[] = [
  {
    id: 'tr-1',
    transferNumber: 'TR-2026-001',
    date: '2026-10-08',
    fromWarehouseId: 'wh-main',
    fromWarehouseName: 'المخزن الرئيسي (القاهرة الكبرى)',
    toWarehouseId: 'wh-giza',
    toWarehouseName: 'مستودع الجيزة والمنطقة الصناعية (6 أكتوبر)',
    productId: 'prod-1',
    productName: 'آبل آيفون 16 برو ماكس - 256 جيجابايت',
    quantity: 3,
    employeeName: 'محمد عبد الفتاح',
    employeePin: '1234',
    notes: 'تحويل لتغذية فرع ومستودع 6 أكتوبر لتلبية طلبيات غرب القاهرة',
    createdAt: '2026-10-08'
  },
  {
    id: 'tr-2',
    transferNumber: 'TR-2026-002',
    date: '2026-10-12',
    fromWarehouseId: 'wh-main',
    fromWarehouseName: 'المخزن الرئيسي (القاهرة الكبرى)',
    toWarehouseId: 'wh-alex',
    toWarehouseName: 'مستودع الإسكندرية والوجه البحري',
    productId: 'prod-2',
    productName: 'سامسونج جالكسي S25 الترا - سعة 512 جيجابايت',
    quantity: 4,
    employeeName: 'أحمد صبري',
    employeePin: '5678',
    notes: 'تحويل مخزون لتغطية تسليمات الإسكندرية والبحيرة',
    createdAt: '2026-10-12'
  }
];

export const INITIAL_INVENTORY_ADJUSTMENTS: InventoryAdjustment[] = [
  {
    id: 'adj-1',
    adjustmentNumber: 'ADJ-IN-001',
    type: 'addition',
    date: '2026-10-05',
    warehouseId: 'wh-main',
    warehouseName: 'المخزن الرئيسي (القاهرة الكبرى)',
    productId: 'prod-3',
    productName: 'شاومي ريدمي نوت 14 برو بلس 5G',
    quantity: 5,
    unitCost: 14800,
    totalCost: 74000,
    reason: 'تسوية جرد دوري - بضاعة زائدة مطابقة لمحضر الفحص',
    employeeName: 'محمد عبد الفتاح',
    notes: 'إضافة معتمدة بعد مضاهاة فواتير المورد الواردة',
    createdAt: '2026-10-05'
  },
  {
    id: 'adj-2',
    adjustmentNumber: 'ADJ-OUT-001',
    type: 'deduction',
    date: '2026-10-09',
    warehouseId: 'wh-giza',
    warehouseName: 'مستودع الجيزة والمنطقة الصناعية (6 أكتوبر)',
    productId: 'prod-4',
    productName: 'شاشة تورنيدو العربي 65 بوصة 4K UHD',
    quantity: 1,
    unitCost: 18500,
    totalCost: 18500,
    reason: 'تسوية خصم - كسر بالشاشة أثناء مناولة داخلية بمستودع 6 أكتوبر',
    employeeName: 'أحمد صبري',
    notes: 'تم عمل محضر تلف وتوجيهها للمطالبة التأمينية',
    createdAt: '2026-10-09'
  }
];

// Initial Real Store Followers
export const INITIAL_FOLLOWERS: StoreFollower[] = [
  {
    id: 'fol-1',
    name: 'م. أحمد الشناوي',
    phone: '01011223344',
    governorate: 'القاهرة',
    followedAt: '2026-10-20 14:32',
    notifyOnPriceDrops: true,
    notifyOnNewArrivals: true,
    avatarColor: 'bg-indigo-600'
  },
  {
    id: 'fol-2',
    name: 'د. سارة عبد الرحمن',
    phone: '01223344556',
    governorate: 'الإسكندرية',
    followedAt: '2026-10-21 11:15',
    notifyOnPriceDrops: true,
    notifyOnNewArrivals: true,
    avatarColor: 'bg-emerald-600'
  },
  {
    id: 'fol-3',
    name: 'محمود كمال البدري',
    phone: '01144556677',
    governorate: 'الجيزة (6 أكتوبر)',
    followedAt: '2026-10-22 18:40',
    notifyOnPriceDrops: true,
    notifyOnNewArrivals: true,
    avatarColor: 'bg-amber-600'
  },
  {
    id: 'fol-4',
    name: 'مروة الشربيني',
    phone: '01099887766',
    governorate: 'الدقهلية (المنصورة)',
    followedAt: '2026-10-23 09:20',
    notifyOnPriceDrops: true,
    notifyOnNewArrivals: false,
    avatarColor: 'bg-rose-600'
  },
  {
    id: 'fol-5',
    name: 'طارق عبد الوهاب',
    phone: '01555667788',
    governorate: 'الغربية (طنطا)',
    followedAt: '2026-10-24 10:05',
    notifyOnPriceDrops: true,
    notifyOnNewArrivals: true,
    avatarColor: 'bg-sky-600'
  }
];

// Noon-style Initial Wishlist Collections
export const INITIAL_WISHLIST_COLLECTIONS: WishlistCollection[] = [
  {
    id: 'col-default',
    name: 'منتجات نفسك تشتريها',
    createdAt: '2026-10-01',
    isDefault: true
  }
];

export const INITIAL_WISHLIST_ITEMS: WishlistItem[] = [
  {
    productId: 'prod-1',
    collectionId: 'col-default',
    addedAt: '2026-10-23 12:00',
    savedPrice: 53999
  }
];

