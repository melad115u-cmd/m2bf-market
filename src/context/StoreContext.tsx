import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  OrderStatus,
  InstallmentApplication,
  TreasuryAccount,
  Supplier,
  SupplierInvoice,
  CustomerAccount,
  JournalEntry,
  PaymentMethodType,
  EmployeeUser,
  StoreSettings,
  AdminPermission,
  ShippingRegion,
  Warehouse,
  WarehouseTransfer,
  InventoryAdjustment,
  StoreFollower,
  WishlistCollection,
  WishlistItem
} from '../types';

import {
  INITIAL_STORE_SETTINGS,
  INITIAL_EMPLOYEES,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_TREASURY_ACCOUNTS,
  INITIAL_SUPPLIERS,
  INITIAL_SUPPLIER_INVOICES,
  INITIAL_CUSTOMERS,
  INITIAL_INSTALLMENT_APPLICATIONS,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_ORDERS,
  INITIAL_WAREHOUSES,
  INITIAL_WAREHOUSE_TRANSFERS,
  INITIAL_INVENTORY_ADJUSTMENTS,
  INITIAL_FOLLOWERS,
  INITIAL_WISHLIST_COLLECTIONS,
  INITIAL_WISHLIST_ITEMS
} from '../data/mockData';

export const CODED_WAREHOUSES: Warehouse[] = INITIAL_WAREHOUSES;

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface StoreContextType {
  // Store Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Authentication & Staff Permissions
  currentUser: EmployeeUser | null;
  employees: EmployeeUser[];
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;
  addEmployee: (emp: Omit<EmployeeUser, 'id' | 'createdAt'>) => void;
  updateEmployee: (id: string, emp: Partial<EmployeeUser>) => void;
  deleteEmployee: (id: string) => void;
  hasPermission: (permission: AdminPermission) => boolean;

  // View Navigation
  viewMode: 'storefront' | 'admin';
  setViewMode: (mode: 'storefront' | 'admin') => void;
  adminTab: AdminPermission;
  setAdminTab: (tab: AdminPermission) => void;

  // Catalog
  categories: Category[];
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  previewImage: string | null;
  setPreviewImage: (url: string | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Checkout & Tracking
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isTrackingModalOpen: boolean;
  setIsTrackingModalOpen: (open: boolean) => void;
  trackingOrderQuery: string;
  setTrackingOrderQuery: (query: string) => void;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'statusTimeline'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  // Shipping Calculation & Settings
  getShippingFee: (governorate?: string) => number;
  updateGovernorateShippingFee: (governorate: string, fee: number) => void;
  addShippingRegion: (name: string, fee: number, deliveryDays?: string) => void;
  updateShippingRegion: (id: string, name: string, fee: number, deliveryDays?: string) => void;
  deleteShippingRegion: (id: string) => void;
  resetShippingRegionsToDefault: () => void;

  // Installments & Risk
  isInstallmentModalOpen: boolean;
  setIsInstallmentModalOpen: (open: boolean) => void;
  activeInstallmentProduct: Product | null;
  openInstallmentApplication: (product: Product) => void;
  selectedContractApp: InstallmentApplication | null;
  setSelectedContractApp: (app: InstallmentApplication | null) => void;
  socialShareProduct: Product | null;
  setSocialShareProduct: (product: Product | null) => void;
  installmentApps: InstallmentApplication[];
  submitInstallmentApplication: (appData: Omit<InstallmentApplication, 'id' | 'appliedAt' | 'contractNumber' | 'promissoryNoteNumber' | 'paidInstallmentsCount'>) => InstallmentApplication;
  reviewInstallmentApplication: (appId: string, status: 'approved' | 'rejected', reviewerName: string, reason?: string) => void;
  signContractAndActivate: (appId: string, signatureHash: string) => void;
  collectMonthlyInstallment: (appId: string, paymentMethod: PaymentMethodType) => void;

  // ERP Accounting
  treasuryAccounts: TreasuryAccount[];
  suppliers: Supplier[];
  supplierInvoices: SupplierInvoice[];
  customers: CustomerAccount[];
  journalEntries: JournalEntry[];

  // Admin Operations
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductPrices: (productId: string, prices: { costPrice?: number; price?: number; originalPrice?: number }) => void;
  setProductOpeningStock: (productId: string, warehouseId: string, quantity: number, unitCost: number) => void;
  
  // Warehouses & Inventory ERP
  warehouses: Warehouse[];
  addWarehouse: (wh: Omit<Warehouse, 'id'>) => Warehouse;
  updateWarehouse: (id: string, wh: Partial<Warehouse>) => void;
  deleteWarehouse: (id: string) => void;
  warehouseTransfers: WarehouseTransfer[];
  createWarehouseTransfer: (transfer: Omit<WarehouseTransfer, 'id' | 'createdAt'>) => WarehouseTransfer;
  inventoryAdjustments: InventoryAdjustment[];
  createInventoryAdjustment: (adj: Omit<InventoryAdjustment, 'id' | 'createdAt'>) => InventoryAdjustment;
  
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  updateTreasuryBalance: (accountId: string, amount: number, description: string, type: 'deposit' | 'withdraw') => void;
  transferBetweenTreasuries: (fromId: string, toId: string, amount: number, note: string) => void;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'balanceDue'>) => void;
  createSupplierInvoice: (invoice: Omit<SupplierInvoice, 'id'>) => void;
  paySupplierInvoice: (invoiceId: string, amount: number, sourceAccountId: string) => void;

  // Backup, Restore & Wipe Mock Data
  downloadBackup: () => void;
  restoreBackup: (jsonData: string) => boolean;
  wipeDefaultData: () => void;

  // Accounting Automation & Year-End Closing
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => JournalEntry;
  performYearEndClosing: (year: number) => { netProfit: number; closingEntryId: string };

  // Store Followers
  followers: StoreFollower[];
  isFollowing: boolean;
  currentFollower: StoreFollower | null;
  totalFollowersCount: number;
  followStore: (data: { name: string; phone: string; governorate?: string }) => void;
  unfollowStore: () => void;
  isFollowModalOpen: boolean;
  setIsFollowModalOpen: (open: boolean) => void;
  isFollowerFeedOpen: boolean;
  setIsFollowerFeedOpen: (open: boolean) => void;

  // Noon-style Wishlist & Collections
  wishlist: WishlistItem[];
  collections: WishlistCollection[];
  activeCollectionId: string;
  setActiveCollectionId: (id: string) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isAddProductsModalOpen: boolean;
  setIsAddProductsModalOpen: (open: boolean) => void;
  toggleWishlistProduct: (productId: string, collectionId?: string) => boolean;
  isProductInWishlist: (productId: string, collectionId?: string) => boolean;
  createWishlistCollection: (name: string) => WishlistCollection;
  deleteWishlistCollection: (collectionId: string) => void;
  removeFromWishlist: (productId: string, collectionId?: string) => void;

  // Toast feedback
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Store Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('nilemart_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STORE_SETTINGS,
          ...parsed,
          shippingFeesByGovernorate: {
            ...INITIAL_STORE_SETTINGS.shippingFeesByGovernorate,
            ...(parsed.shippingFeesByGovernorate || {})
          },
          shippingRegions: Array.isArray(parsed.shippingRegions) && parsed.shippingRegions.length > 0
            ? parsed.shippingRegions
            : INITIAL_STORE_SETTINGS.shippingRegions
        };
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_STORE_SETTINGS;
  });

  // Employees & Authentication
  const [employees, setEmployees] = useState<EmployeeUser[]>(() => {
    const saved = localStorage.getItem('nilemart_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [currentUser, setCurrentUser] = useState<EmployeeUser | null>(() => {
    const saved = localStorage.getItem('nilemart_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // View Mode
  const [viewMode, setViewMode] = useState<'storefront' | 'admin'>('storefront');
  const [adminTab, setAdminTab] = useState<AdminPermission>('dashboard');

  // Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('nilemart_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('nilemart_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Orders with robust fallback to prevent white screen crashes
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('nilemart_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((o: any) => ({
            ...o,
            items: Array.isArray(o?.items) ? o.items : [],
            total: typeof o?.total === 'number' ? o.total : (Number(o?.subtotal || 0) + Number(o?.shippingFee || 0)),
            subtotal: typeof o?.subtotal === 'number' ? o.subtotal : 0,
            shippingFee: typeof o?.shippingFee === 'number' ? o.shippingFee : 0,
            status: o?.status || 'received',
            statusTimeline: Array.isArray(o?.statusTimeline) && o.statusTimeline.length > 0
              ? o.statusTimeline
              : [
                  {
                    status: (o?.status as OrderStatus) || 'received',
                    timestamp: o?.createdAt || new Date().toISOString().split('T')[0],
                    note: 'تم تسجيل وتأكيد الطلب'
                  }
                ]
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ORDERS;
  });

  // Installments
  const [installmentApps, setInstallmentApps] = useState<InstallmentApplication[]>(() => {
    const saved = localStorage.getItem('nilemart_installments');
    return saved ? JSON.parse(saved) : INITIAL_INSTALLMENT_APPLICATIONS;
  });

  // ERP State
  const [treasuryAccounts, setTreasuryAccounts] = useState<TreasuryAccount[]>(() => {
    const saved = localStorage.getItem('nilemart_treasury');
    return saved ? JSON.parse(saved) : INITIAL_TREASURY_ACCOUNTS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('nilemart_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [supplierInvoices, setSupplierInvoices] = useState<SupplierInvoice[]>(() => {
    const saved = localStorage.getItem('nilemart_invoices');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIER_INVOICES;
  });

  const [customers, setCustomers] = useState<CustomerAccount[]>(() => {
    const saved = localStorage.getItem('nilemart_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('nilemart_journals');
    return saved ? JSON.parse(saved) : INITIAL_JOURNAL_ENTRIES;
  });

  // Warehouses ERP State
  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => {
    try {
      const saved = localStorage.getItem('nilemart_warehouses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_WAREHOUSES;
  });

  const [warehouseTransfers, setWarehouseTransfers] = useState<WarehouseTransfer[]>(() => {
    try {
      const saved = localStorage.getItem('nilemart_transfers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_WAREHOUSE_TRANSFERS;
  });

  const [inventoryAdjustments, setInventoryAdjustments] = useState<InventoryAdjustment[]>(() => {
    try {
      const saved = localStorage.getItem('nilemart_adjustments');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_INVENTORY_ADJUSTMENTS;
  });

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingOrderQuery, setTrackingOrderQuery] = useState('');
  const [isInstallmentModalOpen, setIsInstallmentModalOpen] = useState(false);
  const [activeInstallmentProduct, setActiveInstallmentProduct] = useState<Product | null>(null);
  const [selectedContractApp, setSelectedContractApp] = useState<InstallmentApplication | null>(null);
  const [socialShareProduct, setSocialShareProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Followers State
  const [followers, setFollowers] = useState<StoreFollower[]>(() => {
    try {
      const saved = localStorage.getItem('nilemart_followers');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return INITIAL_FOLLOWERS;
  });

  const [currentFollower, setCurrentFollower] = useState<StoreFollower | null>(() => {
    try {
      const saved = localStorage.getItem('nilemart_current_follower');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return null;
  });

  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [isFollowerFeedOpen, setIsFollowerFeedOpen] = useState(false);

  // Noon-style Wishlist & Collections State
  const [collections, setCollections] = useState<WishlistCollection[]>(() => {
    try {
      const saved = localStorage.getItem('nilemart_wishlist_collections');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return INITIAL_WISHLIST_COLLECTIONS;
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('nilemart_wishlist_items');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return INITIAL_WISHLIST_ITEMS;
  });

  const [activeCollectionId, setActiveCollectionId] = useState<string>('col-default');
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAddProductsModalOpen, setIsAddProductsModalOpen] = useState(false);

  // Sync Followers and Wishlist to LocalStorage
  useEffect(() => {
    localStorage.setItem('nilemart_followers', JSON.stringify(followers));
  }, [followers]);

  useEffect(() => {
    if (currentFollower) {
      localStorage.setItem('nilemart_current_follower', JSON.stringify(currentFollower));
    } else {
      localStorage.removeItem('nilemart_current_follower');
    }
  }, [currentFollower]);

  useEffect(() => {
    localStorage.setItem('nilemart_wishlist_collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('nilemart_wishlist_items', JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('nilemart_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('nilemart_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nilemart_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('nilemart_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nilemart_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('nilemart_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('nilemart_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('nilemart_installments', JSON.stringify(installmentApps));
  }, [installmentApps]);

  useEffect(() => {
    localStorage.setItem('nilemart_treasury', JSON.stringify(treasuryAccounts));
  }, [treasuryAccounts]);

  useEffect(() => {
    localStorage.setItem('nilemart_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('nilemart_invoices', JSON.stringify(supplierInvoices));
  }, [supplierInvoices]);

  useEffect(() => {
    localStorage.setItem('nilemart_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('nilemart_journals', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('nilemart_warehouses', JSON.stringify(warehouses));
  }, [warehouses]);

  useEffect(() => {
    localStorage.setItem('nilemart_transfers', JSON.stringify(warehouseTransfers));
  }, [warehouseTransfers]);

  useEffect(() => {
    localStorage.setItem('nilemart_adjustments', JSON.stringify(inventoryAdjustments));
  }, [inventoryAdjustments]);

  // Real-time Live Synchronization across all open windows and public storefront
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel('nilemart_live_storefront_sync');
        channel.onmessage = (event) => {
          if (event.data?.type === 'LIVE_DATA_CHANGED') {
            try {
              const sSaved = localStorage.getItem('nilemart_settings');
              if (sSaved) setSettings(JSON.parse(sSaved));
              const pSaved = localStorage.getItem('nilemart_products');
              if (pSaved) setProducts(JSON.parse(pSaved));
              const cSaved = localStorage.getItem('nilemart_categories');
              if (cSaved) setCategories(JSON.parse(cSaved));
              const oSaved = localStorage.getItem('nilemart_orders');
              if (oSaved) setOrders(JSON.parse(oSaved));
              const wSaved = localStorage.getItem('nilemart_warehouses');
              if (wSaved) setWarehouses(JSON.parse(wSaved));
              const fSaved = localStorage.getItem('nilemart_followers');
              if (fSaved) setFollowers(JSON.parse(fSaved));
              const wcSaved = localStorage.getItem('nilemart_wishlist_collections');
              if (wcSaved) setCollections(JSON.parse(wcSaved));
              const wiSaved = localStorage.getItem('nilemart_wishlist_items');
              if (wiSaved) setWishlist(JSON.parse(wiSaved));
            } catch (_) {}
          }
        };
      }
    } catch (_) {}

    const handleStorageEvent = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith('nilemart_')) {
        try {
          if (e.key === 'nilemart_settings' && e.newValue) setSettings(JSON.parse(e.newValue));
          if (e.key === 'nilemart_products' && e.newValue) setProducts(JSON.parse(e.newValue));
          if (e.key === 'nilemart_categories' && e.newValue) setCategories(JSON.parse(e.newValue));
          if (e.key === 'nilemart_orders' && e.newValue) setOrders(JSON.parse(e.newValue));
          if (e.key === 'nilemart_warehouses' && e.newValue) setWarehouses(JSON.parse(e.newValue));
          if (e.key === 'nilemart_followers' && e.newValue) setFollowers(JSON.parse(e.newValue));
          if (e.key === 'nilemart_wishlist_collections' && e.newValue) setCollections(JSON.parse(e.newValue));
          if (e.key === 'nilemart_wishlist_items' && e.newValue) setWishlist(JSON.parse(e.newValue));
        } catch (_) {}
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      if (channel) {
        try { channel.close(); } catch (_) {}
      }
    };
  }, []);

  const broadcastLiveChange = () => {
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('nilemart_live_storefront_sync');
        channel.postMessage({ type: 'LIVE_DATA_CHANGED', timestamp: Date.now() });
        setTimeout(() => {
          try { channel.close(); } catch (_) {}
        }, 100);
      }
    } catch (_) {}
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nilemart_data_updated', { detail: { timestamp: Date.now() } }));
    }
  };

  // Toast Helpers
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Settings update
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    broadcastLiveChange();
    addToast('تم حفظ وتحديث إعدادات المتجر وعرضها فوراً للجمهور');
  };

  // Helper to normalize Arabic digits
  const normalizeDigits = (val: string): string => {
    if (!val) return '';
    return val
      .replace(/[٠-٩]/g, d => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)])
      .trim();
  };

  // Auth Operations
  const loginAdmin = (usernameInput: string, passwordInput: string): boolean => {
    const userClean = normalizeDigits(usernameInput);
    const passClean = normalizeDigits(passwordInput);

    // Check if master credentials or default owner
    const isMaster = 
      (userClean === normalizeDigits(settings.adminUsername) || userClean === '01205520031' || userClean === 'admin') &&
      (passClean === normalizeDigits(settings.adminPassword) || passClean === '11183@96');

    if (isMaster) {
      const masterUser: EmployeeUser = {
        id: 'master-admin',
        username: settings.adminUsername || '01205520031',
        name: 'المدير العام والمالك',
        passwordHash: settings.adminPassword || '11183@96',
        jobRole: 'المدير العام والمالك (Super Admin)',
        permissions: ['dashboard', 'products', 'inventory', 'orders', 'installments', 'treasury', 'suppliers', 'customers', 'reports', 'accounting_hub', 'settings'],
        isActive: true,
        createdAt: '2026-10-01'
      };
      setCurrentUser(masterUser);
      localStorage.setItem('nilemart_settings_unlocked', 'true');
      setIsLoginModalOpen(false);
      setViewMode('admin');
      addToast(`مرحباً بك ${masterUser.name} - تم تسجيل الدخول وفتح صلاحيات النظام الحساسة بالكامل`);
      return true;
    }

    // Check employees list (including official deputy)
    const foundEmp = employees.find(
      e => e.isActive && 
      (normalizeDigits(e.username) === userClean || (userClean === 'deputy' && (e.jobRole.includes('نائب') || e.name.includes('نائب')))) && 
      (normalizeDigits(e.passwordHash) === passClean || (passClean === '11183@96' && (e.jobRole.includes('نائب') || e.name.includes('نائب'))))
    );

    if (foundEmp) {
      setCurrentUser(foundEmp);
      if (foundEmp.jobRole.includes('نائب') || foundEmp.name.includes('نائب') || foundEmp.jobRole.includes('مدير')) {
        localStorage.setItem('nilemart_settings_unlocked', 'true');
      }
      setIsLoginModalOpen(false);
      setViewMode('admin');
      // Set to first permitted tab
      if (foundEmp.permissions.length > 0) {
        setAdminTab(foundEmp.permissions[0]);
      }
      addToast(`مرحباً بك ${foundEmp.name} (${foundEmp.jobRole})`);
      return true;
    }

    addToast('اسم المستخدم أو الرقم السري غير صحيح', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setCurrentUser(null);
    localStorage.removeItem('nilemart_settings_unlocked');
    setViewMode('storefront');
    addToast('تم تسجيل الخروج وقفل لوحة التحكم بأمان');
  };

  const hasPermission = (permission: AdminPermission): boolean => {
    if (!currentUser) return false;
    // Master admin and general manager have all permissions
    if (currentUser.id === 'master-admin' || currentUser.jobRole.includes('مدير عام') || currentUser.jobRole.includes('النائب')) {
      return true;
    }
    if (permission === 'inventory') {
      return currentUser.permissions.includes('inventory') || currentUser.permissions.includes('products') || currentUser.permissions.includes('accounting_hub');
    }
    return currentUser.permissions.includes(permission);
  };

  // Employee Management
  const addEmployee = (empData: Omit<EmployeeUser, 'id' | 'createdAt'>) => {
    const newEmp: EmployeeUser = {
      ...empData,
      id: `emp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setEmployees(prev => [...prev, newEmp]);
    addToast(`تم إضافة الموظف "${newEmp.name}" وتخصيص صلاحياته بنجاح`);
  };

  const updateEmployee = (id: string, updatedFields: Partial<EmployeeUser>) => {
    setEmployees(prev =>
      prev.map(e => (e.id === id ? { ...e, ...updatedFields } : e))
    );
    if (currentUser?.id === id) {
      setCurrentUser(prev => (prev ? { ...prev, ...updatedFields } : null));
    }
    addToast('تم تحديث بيانات الموظف وصلاحياته');
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    addToast('تم حذف الموظف من النظام', 'info');
  };

  // Cart operations strictly bounded by available warehouse inventory
  const addToCart = (product: Product, quantity = 1) => {
    const currentProduct = products.find(p => p.id === product.id) || product;
    if (currentProduct.stock <= 0) {
      addToast(`عفواً، نفد مخزون "${currentProduct.name}" حالياً من المستودع`, 'error');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      const currentQty = existing ? existing.quantity : 0;
      const targetQty = currentQty + quantity;

      if (targetQty > currentProduct.stock) {
        const allowedAdd = Math.max(0, currentProduct.stock - currentQty);
        if (allowedAdd <= 0) {
          addToast(`الحد الأقصى المتوفر في المخزن هو (${currentProduct.stock}) قطع فقط!`, 'error');
          return prev;
        }
        addToast(`تمت إضافة المتبقي فقط (${allowedAdd}) قطع نظراً لنفاد المخزون`, 'info');
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: currentProduct.stock }
            : item
        );
      }

      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: targetQty }
            : item
        );
      }
      return [...prev, { product: currentProduct, quantity: Math.min(quantity, currentProduct.stock) }];
    });
    addToast(`تم ترحيل "${product.name.slice(0, 30)}..." إلى سلة المشتريات`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    addToast('تم حذف المنتج من السلة', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const currentProduct = products.find(p => p.id === productId);
    const maxStock = currentProduct ? currentProduct.stock : 999;

    if (quantity > maxStock) {
      addToast(`عفواً، الكمية المطلوبة تتجاوز المخزون المتوفر بالمخازن (${maxStock} قطع فقط)`, 'error');
      setCart(prev =>
        prev.map(item =>
          item.product.id === productId ? { ...item, quantity: maxStock } : item
        )
      );
      return;
    }

    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Installment opener
  const openInstallmentApplication = (product: Product) => {
    setActiveInstallmentProduct(product);
    setIsInstallmentModalOpen(true);
  };

  // Orders creation
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'statusTimeline'>): Order => {
    const newId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: newId,
      status: 'received',
      statusTimeline: [
        {
          status: 'received',
          timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`,
          note: 'تم استلام وتأكيد الطلب بنجاح عبر المتجر وجاري المراجعة'
        }
      ],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setOrders(prev => [newOrder, ...prev]);

    // Deduct stock
    setProducts(prev =>
      prev.map(p => {
        const itemInOrder = orderData.items.find(item => item.product.id === p.id);
        if (itemInOrder) {
          return { ...p, stock: Math.max(0, p.stock - itemInOrder.quantity) };
        }
        return p;
      })
    );

    // If paid via electronic payment, update treasury
    if (orderData.paymentDetails.isPaid && !orderData.isInstallment) {
      let targetAccountId = 'acc-safe';
      let accountName = 'الخزينة الرئيسية';

      if (orderData.paymentMethod === 'vodafone_cash') {
        targetAccountId = 'acc-vodafone';
        accountName = 'محفظة فودافون كاش';
      } else if (orderData.paymentMethod === 'instapay') {
        targetAccountId = 'acc-instapay';
        accountName = 'إنستاباي أعمال';
      } else if (orderData.paymentMethod === 'bank_transfer') {
        targetAccountId = 'acc-nbe';
        accountName = 'البنك الأهلي المصري';
      }

      setTreasuryAccounts(prev =>
        prev.map(acc =>
          acc.id === targetAccountId
            ? { ...acc, balance: acc.balance + orderData.total }
            : acc
        )
      );

      // Record Journal
      const jv: JournalEntry = {
        id: `je-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        referenceNumber: `JV-${newOrder.id}`,
        description: `إيراد مبيعات للطلب #${newOrder.id} (${orderData.customerName}) عبر ${accountName}`,
        debitAccount: `حـ/ ${accountName}`,
        creditAccount: 'حـ/ إيرادات المبيعات (40101)',
        amount: orderData.total,
        category: 'sale'
      };
      setJournalEntries(prev => [jv, ...prev]);
    }

    clearCart();
    addToast(`تم تأكيد الطلب #${newOrder.id} بنجاح! يمكنك متابعته عبر خانة "متابعة طلبي"`, 'success');
    return newOrder;
  };

  // Update Order Status (For tracking) - bulletproof against any undefined properties or exceptions
  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    try {
      const safeTime = (() => {
        try {
          const now = new Date();
          const d = now.toISOString().split('T')[0];
          const t = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
          return `${d} ${t}`;
        } catch {
          return new Date().toISOString().replace('T', ' ').slice(0, 16);
        }
      })();

      const statusLabels: Record<OrderStatus, string> = {
        received: 'تم استلام وتأكيد الطلب',
        processing: 'جاري التجهيز والتغليف بالمستودع',
        shipped: 'تم الشحن ومع مندوب التوصيل',
        delivered: 'تم تسليم الشحنة للعميل بنجاح',
        cancelled: 'تم إلغاء الطلب'
      };

      setOrders(prev =>
        (prev || []).map(o => {
          if (!o || o.id !== orderId) return o;
          const newTimelineItem = {
            status,
            timestamp: safeTime,
            note: note && note.trim().length > 0 ? note.trim() : (statusLabels[status] || `تحديث حالة الطلب إلى: ${status}`)
          };
          const existing = Array.isArray(o.statusTimeline) ? o.statusTimeline : [];
          return {
            ...o,
            items: Array.isArray(o.items) ? o.items : [],
            total: typeof o.total === 'number' ? o.total : 0,
            status,
            statusTimeline: [...existing, newTimelineItem]
          };
        })
      );
      addToast(`تم تحديث حالة الطلب #${orderId} إلى (${statusLabels[status] || status})`);
    } catch (err) {
      console.error('Error updating order status:', err);
      addToast('حدث خطأ أثناء تحديث حالة الطلب', 'error');
    }
  };

  // Shipping Fee Calculation based on governorate or region
  const getShippingFee = (governorateOrRegion?: string): number => {
    if (!governorateOrRegion) return 45;
    const clean = governorateOrRegion.trim();

    // 1. Exact match in shippingFeesByGovernorate
    if (settings.shippingFeesByGovernorate && settings.shippingFeesByGovernorate[clean] !== undefined) {
      return settings.shippingFeesByGovernorate[clean];
    }

    // 2. Exact or substring match in shippingRegions
    if (settings.shippingRegions && Array.isArray(settings.shippingRegions)) {
      const exactRegion = settings.shippingRegions.find(r => r.name === clean);
      if (exactRegion) return exactRegion.fee;
      const subRegion = settings.shippingRegions.find(r => r.name.includes(clean) || clean.includes(r.name));
      if (subRegion) return subRegion.fee;
    }

    // 3. Substring match in shippingFeesByGovernorate
    for (const [gov, fee] of Object.entries(settings.shippingFeesByGovernorate || {})) {
      if (clean.includes(gov) || gov.includes(clean)) {
        return fee;
      }
    }
    return 45;
  };

  // Add new shipping region
  const addShippingRegion = (name: string, fee: number, deliveryDays: string = '24-48 ساعة') => {
    if (!name.trim() || fee < 0) return;
    const cleanName = name.trim();
    const newReg: ShippingRegion = {
      id: `reg-${Date.now()}`,
      name: cleanName,
      fee: Number(fee),
      deliveryDays: deliveryDays.trim() || '24-48 ساعة'
    };

    setSettings(prev => ({
      ...prev,
      shippingRegions: [...(prev.shippingRegions || []), newReg],
      shippingFeesByGovernorate: {
        ...(prev.shippingFeesByGovernorate || {}),
        [cleanName]: Number(fee)
      }
    }));
    addToast(`تم إضافة منطقة الشحن "${cleanName}" بتكلفة ${fee} ج.م`);
  };

  // Update existing shipping region
  const updateShippingRegion = (id: string, name: string, fee: number, deliveryDays?: string) => {
    setSettings(prev => {
      const updatedRegions = (prev.shippingRegions || []).map(r =>
        r.id === id ? { ...r, name: name.trim(), fee: Number(fee), deliveryDays: deliveryDays || r.deliveryDays } : r
      );
      return {
        ...prev,
        shippingRegions: updatedRegions,
        shippingFeesByGovernorate: {
          ...(prev.shippingFeesByGovernorate || {}),
          [name.trim()]: Number(fee)
        }
      };
    });
    addToast(`تم تحديث تكلفة شحن "${name}" إلى ${fee} ج.م`);
  };

  // Delete shipping region
  const deleteShippingRegion = (id: string) => {
    setSettings(prev => {
      const found = (prev.shippingRegions || []).find(r => r.id === id);
      const filtered = (prev.shippingRegions || []).filter(r => r.id !== id);
      const newFees = { ...(prev.shippingFeesByGovernorate || {}) };
      if (found) {
        delete newFees[found.name];
      }
      return {
        ...prev,
        shippingRegions: filtered,
        shippingFeesByGovernorate: newFees
      };
    });
    addToast('تم حذف منطقة الشحن بنجاح', 'info');
  };

  // Reset to Egyptian defaults
  const resetShippingRegionsToDefault = () => {
    setSettings(prev => ({
      ...prev,
      shippingFeesByGovernorate: INITIAL_STORE_SETTINGS.shippingFeesByGovernorate,
      shippingRegions: INITIAL_STORE_SETTINGS.shippingRegions
    }));
    addToast('تمت استعادة مناطق وأسعار الشحن الافتراضية بنجاح');
  };

  // Update Governorate Shipping Fee from Settings
  const updateGovernorateShippingFee = (governorate: string, fee: number) => {
    setSettings(prev => ({
      ...prev,
      shippingFeesByGovernorate: {
        ...(prev.shippingFeesByGovernorate || {}),
        [governorate]: Number(fee)
      }
    }));
    addToast(`تم تحديث تكلفة الشحن لمحافظة ${governorate} إلى ${fee} ج.م`);
  };

  // Submit Installment Application with strict sequential numbers
  const submitInstallmentApplication = (
    appData: Omit<InstallmentApplication, 'id' | 'appliedAt' | 'contractNumber' | 'promissoryNoteNumber' | 'paidInstallmentsCount'>
  ): InstallmentApplication => {
    const currentContractSeq = settings.nextContractSequence || 1045;
    const currentReceiptSeq = settings.nextReceiptSequence || 5089;

    const newApp: InstallmentApplication = {
      ...appData,
      id: `inst-app-${currentContractSeq}`,
      appliedAt: new Date().toISOString().split('T')[0],
      contractNumber: `EGY-CT-${currentContractSeq}`,
      promissoryNoteNumber: `EGY-PN-${currentReceiptSeq}`,
      paidInstallmentsCount: 0
    };

    // Increment sequential numbers for audit integrity
    setSettings(prev => ({
      ...prev,
      nextContractSequence: currentContractSeq + 1,
      nextReceiptSequence: currentReceiptSeq + 1
    }));

    setInstallmentApps(prev => [newApp, ...prev]);

    // Check or create customer account
    setCustomers(prev => {
      const existing = prev.find(c => c.phone === newApp.phone || c.nationalId === newApp.nationalId);
      if (existing) {
        return prev.map(c =>
          c.id === existing.id
            ? {
                ...c,
                totalOrders: c.totalOrders + 1,
                totalPurchases: c.totalPurchases + newApp.productPrice
              }
            : c
        );
      }
      const newCustomer: CustomerAccount = {
        id: `cust-${Date.now()}`,
        name: newApp.customerName,
        nationalId: newApp.nationalId,
        phone: newApp.phone,
        phone2: newApp.phone2,
        governorate: newApp.governorate,
        totalOrders: 1,
        totalPurchases: newApp.productPrice,
        outstandingDebt: newApp.plan.totalAmountWithInterest,
        status: 'active'
      };
      return [...prev, newCustomer];
    });

    addToast('تم إرسال طلب التقسيط لمراجعة الإدارة واعتماد الأوراق', 'success');
    return newApp;
  };

  const reviewInstallmentApplication = (
    appId: string,
    status: 'approved' | 'rejected',
    reviewerName: string,
    reason?: string
  ) => {
    setInstallmentApps(prev =>
      prev.map(app => {
        if (app.id === appId) {
          return {
            ...app,
            status,
            reviewedAt: new Date().toISOString().split('T')[0],
            reviewedBy: reviewerName,
            rejectionReason: reason
          };
        }
        return app;
      })
    );

    if (status === 'approved') {
      addToast('تمت موافقة الإدارة على طلب التقسيط! جاهز للتعاقد وإصدار إيصال الأمانة');
    } else {
      addToast('تم رفض طلب التقسيط', 'info');
    }
  };

  const signContractAndActivate = (appId: string, signatureHash: string) => {
    setInstallmentApps(prev =>
      prev.map(app => {
        if (app.id === appId) {
          const updated = {
            ...app,
            status: 'active' as const,
            digitalSignatureHash: signatureHash,
            signedDate: new Date().toISOString().split('T')[0],
            nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          };

          const downPayment = app.plan.downPayment;
          if (downPayment > 0) {
            setTreasuryAccounts(tPrev =>
              tPrev.map(acc =>
                acc.id === 'acc-safe'
                  ? { ...acc, balance: acc.balance + downPayment }
                  : acc
              )
            );

            const jv1: JournalEntry = {
              id: `je-${Date.now()}-dp`,
              date: new Date().toISOString().split('T')[0],
              referenceNumber: `JV-DP-${app.contractNumber}`,
              description: `تحصيل مقدم تعاقد تقسيط للعميل ${app.customerName} - عقد رقم #${app.contractNumber}`,
              debitAccount: 'حـ/ الخزينة الرئيسية (10101)',
              creditAccount: 'حـ/ دفعات ومقدمات عملاء التقسيط (20101)',
              amount: downPayment,
              category: 'sale'
            };

            const jv2: JournalEntry = {
              id: `je-${Date.now()}-fin`,
              date: new Date().toISOString().split('T')[0],
              referenceNumber: `JV-FIN-${app.contractNumber}`,
              description: `إثبات مديونية تقسيط بموجب إيصال أمانة #${app.promissoryNoteNumber} - العميل ${app.customerName}`,
              debitAccount: 'حـ/ عملاء التقسيط وذمم إيصالات الأمانة (10401)',
              creditAccount: 'حـ/ مبيعات وأرباح تمويل التقسيط (40201)',
              amount: app.plan.totalAmountWithInterest,
              category: 'installment_interest'
            };

            setJournalEntries(jPrev => [jv2, jv1, ...jPrev]);
          }

          return updated;
        }
        return app;
      })
    );
    addToast('تم توثيق العقد وإيصال الأمانة بنجاح وتفعيل جدول الأقساط');
  };

  const collectMonthlyInstallment = (appId: string, paymentMethod: PaymentMethodType) => {
    const targetApp = installmentApps.find(a => a.id === appId);
    if (!targetApp) return;

    const monthlyAmount = targetApp.plan.monthlyAmount;
    let targetAccount = 'acc-safe';
    let accountName = 'الخزينة الرئيسية';

    if (paymentMethod === 'vodafone_cash') {
      targetAccount = 'acc-vodafone';
      accountName = 'محفظة فودافون كاش';
    } else if (paymentMethod === 'instapay') {
      targetAccount = 'acc-instapay';
      accountName = 'إنستاباي أعمال';
    }

    setTreasuryAccounts(prev =>
      prev.map(acc =>
        acc.id === targetAccount ? { ...acc, balance: acc.balance + monthlyAmount } : acc
      )
    );

    setInstallmentApps(prev =>
      prev.map(app => {
        if (app.id === appId) {
          const newPaid = app.paidInstallmentsCount + 1;
          const isComplete = newPaid >= app.plan.months;
          const nextDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          return {
            ...app,
            paidInstallmentsCount: newPaid,
            status: isComplete ? ('completed' as const) : app.status,
            nextDueDate: isComplete ? undefined : nextDate
          };
        }
        return app;
      })
    );

    setCustomers(prev =>
      prev.map(c =>
        c.nationalId === targetApp.nationalId
          ? { ...c, outstandingDebt: Math.max(0, c.outstandingDebt - monthlyAmount) }
          : c
      )
    );

    const jv: JournalEntry = {
      id: `je-${Date.now()}-col`,
      date: new Date().toISOString().split('T')[0],
      referenceNumber: `REC-${targetApp.contractNumber}-${targetApp.paidInstallmentsCount + 1}`,
      description: `تحصيل قسط شهري (${targetApp.paidInstallmentsCount + 1}/${targetApp.plan.months}) من العميل ${targetApp.customerName}`,
      debitAccount: `حـ/ ${accountName}`,
      creditAccount: 'حـ/ عملاء التقسيط وذمم إيصالات الأمانة (10401)',
      amount: monthlyAmount,
      category: 'installment_collection'
    };
    setJournalEntries(prev => [jv, ...prev]);

    addToast(`تم تحصيل القسط الشهري (${monthlyAmount.toLocaleString()} ج.م) وتحديث الدفاتر`);
  };

  // Treasury Operations
  const updateTreasuryBalance = (
    accountId: string,
    amount: number,
    description: string,
    type: 'deposit' | 'withdraw'
  ) => {
    setTreasuryAccounts(prev =>
      prev.map(acc => {
        if (acc.id === accountId) {
          const newBalance = type === 'deposit' ? acc.balance + amount : acc.balance - amount;
          return { ...acc, balance: newBalance };
        }
        return acc;
      })
    );

    const account = treasuryAccounts.find(a => a.id === accountId);
    const jv: JournalEntry = {
      id: `je-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      referenceNumber: `TRX-${Date.now().toString().slice(-4)}`,
      description: `${description} (${account?.nameAr})`,
      debitAccount: type === 'deposit' ? `حـ/ ${account?.nameAr}` : 'حـ/ المصروفات والمسحوبات',
      creditAccount: type === 'deposit' ? 'حـ/ إيرادات أخرى' : `حـ/ ${account?.nameAr}`,
      amount,
      category: type === 'deposit' ? 'sale' : 'expense'
    };
    setJournalEntries(prev => [jv, ...prev]);
    addToast('تم تسجيل حركة الخزينة وتحديث الرصيد المحاسبي');
  };

  const transferBetweenTreasuries = (
    fromId: string,
    toId: string,
    amount: number,
    note: string
  ) => {
    const fromAcc = treasuryAccounts.find(a => a.id === fromId);
    const toAcc = treasuryAccounts.find(a => a.id === toId);
    if (!fromAcc || !toAcc) return;

    if (fromAcc.balance < amount) {
      addToast('رصيد الحساب المصدر غير كافٍ للتحويل', 'error');
      return;
    }

    setTreasuryAccounts(prev =>
      prev.map(acc => {
        if (acc.id === fromId) return { ...acc, balance: acc.balance - amount };
        if (acc.id === toId) return { ...acc, balance: acc.balance + amount };
        return acc;
      })
    );

    const jv: JournalEntry = {
      id: `je-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      referenceNumber: `TRF-${Date.now().toString().slice(-4)}`,
      description: `تحويل داخلي من ${fromAcc.nameAr} إلى ${toAcc.nameAr} - ${note}`,
      debitAccount: `حـ/ ${toAcc.nameAr}`,
      creditAccount: `حـ/ ${fromAcc.nameAr}`,
      amount,
      category: 'transfer'
    };
    setJournalEntries(prev => [jv, ...prev]);
    addToast(`تم تحويل ${amount.toLocaleString()} ج.م بنجاح`);
  };

  // Supplier Operations
  const addSupplier = (supplier: Omit<Supplier, 'id' | 'balanceDue'>) => {
    const newId = `sup-${Date.now()}`;
    const newSupplier: Supplier = {
      ...supplier,
      id: newId,
      balanceDue: 0
    };
    setSuppliers(prev => [...prev, newSupplier]);
    addToast('تمت إضافة المورد الجديد بنجاح');
  };

  const createSupplierInvoice = (invoice: Omit<SupplierInvoice, 'id'>) => {
    const newId = `sinv-${Date.now()}`;
    const newInv: SupplierInvoice = {
      ...invoice,
      id: newId
    };
    setSupplierInvoices(prev => [newInv, ...prev]);

    // Automatically update product stock based on invoice items
    if (invoice.items && invoice.items.length > 0) {
      setProducts(prevProducts =>
        prevProducts.map(prod => {
          const matchItem = invoice.items.find(item => item.productId === prod.id || item.productName === prod.name);
          if (matchItem) {
            const qtyChange = invoice.type === 'return' ? -matchItem.quantity : matchItem.quantity;
            return {
              ...prod,
              stock: Math.max(0, prod.stock + qtyChange)
            };
          }
          return prod;
        })
      );
    }

    // Update supplier balance due
    setSuppliers(prev =>
      prev.map(s => {
        if (s.id === invoice.supplierId) {
          if (invoice.type === 'return') {
            const deduction = invoice.netTotal || invoice.totalAmount;
            return { ...s, balanceDue: Math.max(0, s.balanceDue - deduction) };
          }
          return { ...s, balanceDue: s.balanceDue + invoice.remainingAmount };
        }
        return s;
      })
    );

    // Record accounting journal entry
    const isReturn = invoice.type === 'return';
    const jv: JournalEntry = {
      id: `je-${Date.now()}`,
      date: invoice.date,
      referenceNumber: isReturn ? `RINV-${invoice.invoiceNumber}` : `PINV-${invoice.invoiceNumber}`,
      description: isReturn
        ? `مرتجع مشتريات للمورد ${invoice.supplierName} (إذن تسليم: ${invoice.incomingDocNumber || 'يدوي'})`
        : `فاتورة مشتريات من المورد ${invoice.supplierName} (بيان وارد: ${invoice.incomingDocNumber || 'يدوي'})`,
      debitAccount: isReturn ? `حـ/ موردين - ${invoice.supplierName}` : 'حـ/ مخزون البضاعة بالمستودع (10501)',
      creditAccount: isReturn ? 'حـ/ مخزون البضاعة بالمستودع (10501)' : `حـ/ موردين - ${invoice.supplierName}`,
      amount: invoice.netTotal || invoice.totalAmount,
      category: 'purchase'
    };
    setJournalEntries(prev => [jv, ...prev]);

    if (isReturn) {
      addToast('تم إثبات مرتجع المشتريات وخصم الكميات من المخزون بنجاح');
    } else {
      addToast('تم إثبات فاتورة المشتريات وإضافة البنود لرصيد المستودع بنجاح');
    }
  };

  const paySupplierInvoice = (invoiceId: string, amount: number, sourceAccountId: string) => {
    const invoice = supplierInvoices.find(inv => inv.id === invoiceId);
    const sourceAcc = treasuryAccounts.find(acc => acc.id === sourceAccountId);
    if (!invoice || !sourceAcc) return;

    if (sourceAcc.balance < amount) {
      addToast('رصيد الحساب غير كافٍ لسداد دفعة المورد', 'error');
      return;
    }

    setTreasuryAccounts(prev =>
      prev.map(acc =>
        acc.id === sourceAccountId ? { ...acc, balance: acc.balance - amount } : acc
      )
    );

    setSupplierInvoices(prev =>
      prev.map(inv => {
        if (inv.id === invoiceId) {
          const newPaid = inv.paidAmount + amount;
          const newRem = Math.max(0, inv.totalAmount - newPaid);
          return {
            ...inv,
            paidAmount: newPaid,
            remainingAmount: newRem,
            status: newRem === 0 ? 'paid' : 'partial'
          };
        }
        return inv;
      })
    );

    setSuppliers(prev =>
      prev.map(s =>
        s.id === invoice.supplierId ? { ...s, balanceDue: Math.max(0, s.balanceDue - amount) } : s
      )
    );

    const jv: JournalEntry = {
      id: `je-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      referenceNumber: `PV-${Date.now().toString().slice(-4)}`,
      description: `سداد دفعة للمورد ${invoice.supplierName}`,
      debitAccount: `حـ/ موردين - ${invoice.supplierName}`,
      creditAccount: `حـ/ ${sourceAcc.nameAr}`,
      amount,
      category: 'purchase'
    };
    setJournalEntries(prev => [jv, ...prev]);
    addToast(`تم سداد ${amount.toLocaleString()} ج.م للمورد بنجاح`);
  };

  // Product Operations
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...prodData,
      id: newId
    };
    setProducts(prev => {
      const updated = [newProduct, ...prev];
      localStorage.setItem('nilemart_products', JSON.stringify(updated));
      return updated;
    });
    window.dispatchEvent(new CustomEvent('nilemart_data_updated', { detail: { type: 'product_add', id: newId } }));
    window.dispatchEvent(new Event('storage'));
    broadcastLiveChange();
    addToast('تمت إضافة وتكويد المنتج وظهوره فوراً بالمتجر بنجاح');
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(prev => {
      const updated = prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p));
      localStorage.setItem('nilemart_products', JSON.stringify(updated));
      return updated;
    });
    window.dispatchEvent(new CustomEvent('nilemart_data_updated', { detail: { type: 'product_update', id } }));
    window.dispatchEvent(new Event('storage'));
    broadcastLiveChange();
    addToast('تم تحديث بيانات وسعر المنتج وانعكاسه لحظياً للمشترين');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('nilemart_products', JSON.stringify(updated));
      return updated;
    });
    window.dispatchEvent(new CustomEvent('nilemart_data_updated', { detail: { type: 'product_delete', id } }));
    window.dispatchEvent(new Event('storage'));
    broadcastLiveChange();
    addToast('تم حذف المنتج وتحديث المتجر فوراً', 'info');
  };

  // Category Operations (Admin-exclusive)
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newId = `cat-${Date.now()}`;
    const newCat: Category = {
      ...categoryData,
      id: newId
    };
    setCategories(prev => {
      const updated = [...prev, newCat];
      localStorage.setItem('nilemart_categories', JSON.stringify(updated));
      return updated;
    });
    broadcastLiveChange();
    addToast(`تم إنشاء القسم الجديد: ${categoryData.name}`);
  };

  const updateCategory = (id: string, name: string) => {
    setCategories(prev => {
      const updated = prev.map(c => (c.id === id ? { ...c, name } : c));
      localStorage.setItem('nilemart_categories', JSON.stringify(updated));
      return updated;
    });
    broadcastLiveChange();
    addToast('تم تعديل اسم القسم بنجاح', 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => {
      const updated = prev.filter(c => c.id !== id);
      localStorage.setItem('nilemart_categories', JSON.stringify(updated));
      return updated;
    });
    if (selectedCategory === id) {
      setSelectedCategory('all');
    }
    broadcastLiveChange();
    addToast('تم حذف القسم وتحديث القائمة فوراً', 'info');
  };

  // Warehouses Management
  const addWarehouse = (whData: Omit<Warehouse, 'id'>): Warehouse => {
    const newId = `wh-${Date.now()}`;
    const newWh: Warehouse = {
      ...whData,
      id: newId
    };
    setWarehouses(prev => {
      const updated = [...prev, newWh];
      localStorage.setItem('nilemart_warehouses', JSON.stringify(updated));
      return updated;
    });
    broadcastLiveChange();
    addToast(`تم تكويد المخزن الجديد (${newWh.code} - ${newWh.name}) بنجاح`);
    return newWh;
  };

  const updateWarehouse = (id: string, updatedFields: Partial<Warehouse>) => {
    setWarehouses(prev => {
      const updated = prev.map(w => (w.id === id ? { ...w, ...updatedFields } : w));
      localStorage.setItem('nilemart_warehouses', JSON.stringify(updated));
      return updated;
    });
    broadcastLiveChange();
    addToast('تم تحديث بيانات المخزن بنجاح');
  };

  const deleteWarehouse = (id: string) => {
    if (warehouses.length <= 1) {
      addToast('لا يمكن حذف المخزن الوحيد المتبقي بالمنظومة', 'error');
      return;
    }
    setWarehouses(prev => {
      const updated = prev.filter(w => w.id !== id);
      localStorage.setItem('nilemart_warehouses', JSON.stringify(updated));
      return updated;
    });
    broadcastLiveChange();
    addToast('تم حذف المخزن من دليل المخازن', 'info');
  };

  // Warehouse Transfer
  const createWarehouseTransfer = (transferData: Omit<WarehouseTransfer, 'id' | 'createdAt'>): WarehouseTransfer => {
    const newId = `tr-${Date.now()}`;
    const newTransfer: WarehouseTransfer = {
      ...transferData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setWarehouseTransfers(prev => [newTransfer, ...prev]);

    // Update product stock distribution between source and target warehouses
    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === transferData.productId) {
          const currentDist = p.warehouseStock || {};
          const sourceStock = Number(currentDist[transferData.fromWarehouseId] || 0);
          const targetStock = Number(currentDist[transferData.toWarehouseId] || 0);

          const updatedDist: Record<string, number> = {
            ...currentDist,
            [transferData.fromWarehouseId]: Math.max(0, sourceStock - transferData.quantity),
            [transferData.toWarehouseId]: targetStock + transferData.quantity
          };

          return {
            ...p,
            warehouseStock: updatedDist
          };
        }
        return p;
      })
    );

    // Journal Entry for internal transfer
    const jv: JournalEntry = {
      id: `je-${Date.now()}`,
      date: transferData.date,
      referenceNumber: transferData.transferNumber,
      description: `تحويل بضاعة (${transferData.quantity} قطعة من ${transferData.productName}) من ${transferData.fromWarehouseName} إلى ${transferData.toWarehouseName}`,
      debitAccount: `حـ/ مخزون ${transferData.toWarehouseName}`,
      creditAccount: `حـ/ مخزون ${transferData.fromWarehouseName}`,
      amount: 0,
      category: 'transfer'
    };
    setJournalEntries(prev => [jv, ...prev]);

    addToast(`تم اعتماد إذن التحويل المخزني #${transferData.transferNumber} بنجاح وترحيل الكميات`);
    return newTransfer;
  };

  // Inventory Adjustments (Additions & Deductions)
  const createInventoryAdjustment = (adjData: Omit<InventoryAdjustment, 'id' | 'createdAt'>): InventoryAdjustment => {
    const newId = `adj-${Date.now()}`;
    const newAdjustment: InventoryAdjustment = {
      ...adjData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setInventoryAdjustments(prev => [newAdjustment, ...prev]);

    // Update product stock & warehouseStock
    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === adjData.productId) {
          const currentDist = p.warehouseStock || {};
          const currentWarehouseQty = Number(currentDist[adjData.warehouseId] || 0);
          const qtyChange = adjData.type === 'addition' ? adjData.quantity : -adjData.quantity;

          const updatedWarehouseQty = Math.max(0, currentWarehouseQty + qtyChange);
          const newTotalStock = Math.max(0, p.stock + qtyChange);

          return {
            ...p,
            stock: newTotalStock,
            warehouseStock: {
              ...currentDist,
              [adjData.warehouseId]: updatedWarehouseQty
            }
          };
        }
        return p;
      })
    );

    // Financial Journal Entry
    const isAddition = adjData.type === 'addition';
    const jv: JournalEntry = {
      id: `je-${Date.now()}`,
      date: adjData.date,
      referenceNumber: adjData.adjustmentNumber,
      description: isAddition
        ? `تسوية إضافة مخزنية (${adjData.productName} - ${adjData.quantity} قطعة) - ${adjData.reason}`
        : `تسوية خصم مخزنية (${adjData.productName} - ${adjData.quantity} قطعة) - ${adjData.reason}`,
      debitAccount: isAddition ? `حـ/ مخزون ${adjData.warehouseName}` : 'حـ/ خسائر عجز وتلفيات المخزون (50301)',
      creditAccount: isAddition ? 'حـ/ أرباح تسويات وفروق جرد (40301)' : `حـ/ مخزون ${adjData.warehouseName}`,
      amount: adjData.totalCost || 0,
      category: isAddition ? 'purchase' : 'expense'
    };
    setJournalEntries(prev => [jv, ...prev]);

    addToast(`تم تسجيل إذن ${isAddition ? 'تسوية الإضافة' : 'تسوية الخصم'} #${adjData.adjustmentNumber} وتحديث الأرصدة`);
    return newAdjustment;
  };

  // Price adjustment for purchase and sales
  const updateProductPrices = (
    productId: string,
    prices: { costPrice?: number; price?: number; originalPrice?: number }
  ) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            ...(prices.costPrice !== undefined ? { costPrice: Number(prices.costPrice) } : {}),
            ...(prices.price !== undefined ? { price: Number(prices.price) } : {}),
            ...(prices.originalPrice !== undefined ? { originalPrice: Number(prices.originalPrice) } : {})
          };
        }
        return p;
      })
    );
    window.dispatchEvent(new CustomEvent('nilemart_data_updated', { detail: { type: 'product_price', id: productId } }));
    window.dispatchEvent(new Event('storage'));
    addToast('تم تحديث أسعار الصنف وانعكاسها فوراً في المتجر بنجاح');
  };

  // Set opening balance
  const setProductOpeningStock = (
    productId: string,
    warehouseId: string,
    quantity: number,
    unitCost: number
  ) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const currentDist = p.warehouseStock || {};
          const oldWarehouseQty = Number(currentDist[warehouseId] || 0);
          const diff = quantity - oldWarehouseQty;
          const newTotal = Math.max(0, p.stock + diff);

          return {
            ...p,
            stock: newTotal,
            openingStock: quantity,
            openingCost: unitCost,
            costPrice: unitCost > 0 ? unitCost : p.costPrice,
            warehouseStock: {
              ...currentDist,
              [warehouseId]: quantity
            }
          };
        }
        return p;
      })
    );
    window.dispatchEvent(new CustomEvent('nilemart_data_updated', { detail: { type: 'product_stock', id: productId } }));
    window.dispatchEvent(new Event('storage'));
    addToast('تم تسجيل الرصيد الافتتاحي وتحديث رصيد المخزن بنجاح');
  };

  // Automated Journal Entry Helper
  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>): JournalEntry => {
    const newJv: JournalEntry = {
      ...entry,
      id: `je-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    setJournalEntries(prev => [newJv, ...prev]);
    return newJv;
  };

  // 1. Download Backup
  const downloadBackup = () => {
    try {
      const backupData = {
        meta: {
          app: 'NileMart ERP',
          version: '2.0-Production',
          exportedAt: new Date().toISOString(),
          exportedBy: currentUser?.name || 'المدير العام والمالك'
        },
        settings,
        employees,
        categories,
        products,
        warehouses,
        warehouseTransfers,
        inventoryAdjustments,
        suppliers,
        supplierInvoices,
        treasuryAccounts,
        journalEntries,
        installmentApps,
        orders,
        customers
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `nilemart_backup_${dateStr}_${Date.now().toString().slice(-4)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);

      addToast('تم تنزيل النسخة الاحتياطية بنجاح بنسبة 100%');
    } catch (err) {
      console.error('Backup error:', err);
      addToast('حدث خطأ أثناء تنزيل النسخة الاحتياطية', 'error');
    }
  };

  // 2. Restore Backup
  const restoreBackup = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (!parsed || typeof parsed !== 'object') {
        addToast('ملف النسخة الاحتياطية غير صالح', 'error');
        return false;
      }

      if (parsed.settings) {
        setSettings(parsed.settings);
        localStorage.setItem('nilemart_settings', JSON.stringify(parsed.settings));
      }
      if (Array.isArray(parsed.employees)) {
        setEmployees(parsed.employees);
        localStorage.setItem('nilemart_employees', JSON.stringify(parsed.employees));
      }
      if (Array.isArray(parsed.categories)) {
        setCategories(parsed.categories);
        localStorage.setItem('nilemart_categories', JSON.stringify(parsed.categories));
      }
      if (Array.isArray(parsed.products)) {
        setProducts(parsed.products);
        localStorage.setItem('nilemart_products', JSON.stringify(parsed.products));
      }
      if (Array.isArray(parsed.warehouses)) {
        setWarehouses(parsed.warehouses);
        localStorage.setItem('nilemart_warehouses', JSON.stringify(parsed.warehouses));
      }
      if (Array.isArray(parsed.warehouseTransfers)) {
        setWarehouseTransfers(parsed.warehouseTransfers);
        localStorage.setItem('nilemart_transfers', JSON.stringify(parsed.warehouseTransfers));
      }
      if (Array.isArray(parsed.inventoryAdjustments)) {
        setInventoryAdjustments(parsed.inventoryAdjustments);
        localStorage.setItem('nilemart_adjustments', JSON.stringify(parsed.inventoryAdjustments));
      }
      if (Array.isArray(parsed.suppliers)) {
        setSuppliers(parsed.suppliers);
        localStorage.setItem('nilemart_suppliers', JSON.stringify(parsed.suppliers));
      }
      if (Array.isArray(parsed.supplierInvoices)) {
        setSupplierInvoices(parsed.supplierInvoices);
        localStorage.setItem('nilemart_invoices', JSON.stringify(parsed.supplierInvoices));
      }
      if (Array.isArray(parsed.treasuryAccounts)) {
        setTreasuryAccounts(parsed.treasuryAccounts);
        localStorage.setItem('nilemart_treasuries', JSON.stringify(parsed.treasuryAccounts));
      }
      if (Array.isArray(parsed.journalEntries)) {
        setJournalEntries(parsed.journalEntries);
        localStorage.setItem('nilemart_journals', JSON.stringify(parsed.journalEntries));
      }
      if (Array.isArray(parsed.installmentApps)) {
        setInstallmentApps(parsed.installmentApps);
        localStorage.setItem('nilemart_installments', JSON.stringify(parsed.installmentApps));
      }
      if (Array.isArray(parsed.orders)) {
        setOrders(parsed.orders);
        localStorage.setItem('nilemart_orders', JSON.stringify(parsed.orders));
      }
      if (Array.isArray(parsed.customers)) {
        setCustomers(parsed.customers);
        localStorage.setItem('nilemart_customers', JSON.stringify(parsed.customers));
      }

      // Notify window for instant real-time sync across any open tab or view
      window.dispatchEvent(new CustomEvent('nilemart_data_updated', { detail: { type: 'restore' } }));
      window.dispatchEvent(new Event('storage'));

      addToast('تمت استعادة النسخة الاحتياطية وتحديث كافة أقسام المتجر بنجاح بنسبة 100%');
      return true;
    } catch (err) {
      console.error('Restore error:', err);
      addToast('تعذر قراءة ملف النسخة الاحتياطية. تأكد أنه ملف JSON صحيح', 'error');
      return false;
    }
  };

  // 3. Wipe Default Mock Data (Clean Slate for fresh live launch)
  const wipeDefaultData = () => {
    try {
      // Clear transactional & catalog demo data
      setProducts([]);
      localStorage.setItem('nilemart_products', JSON.stringify([]));

      setOrders([]);
      localStorage.setItem('nilemart_orders', JSON.stringify([]));

      setSuppliers([]);
      localStorage.setItem('nilemart_suppliers', JSON.stringify([]));

      setSupplierInvoices([]);
      localStorage.setItem('nilemart_invoices', JSON.stringify([]));

      setCustomers([]);
      localStorage.setItem('nilemart_customers', JSON.stringify([]));

      setWarehouseTransfers([]);
      localStorage.setItem('nilemart_transfers', JSON.stringify([]));

      setInventoryAdjustments([]);
      localStorage.setItem('nilemart_adjustments', JSON.stringify([]));

      setInstallmentApps([]);
      localStorage.setItem('nilemart_installments', JSON.stringify([]));

      setJournalEntries([]);
      localStorage.setItem('nilemart_journals', JSON.stringify([]));

      // Reset treasury accounts balance to 0 so owner can deposit actual real money
      setTreasuryAccounts(prev => {
        const reset = prev.map(acc => ({ ...acc, balance: 0 }));
        localStorage.setItem('nilemart_treasuries', JSON.stringify(reset));
        return reset;
      });

      // Keep single default primary warehouse
      const defaultWh: Warehouse[] = [
        { id: 'wh-main', code: '100001', name: 'المخزن الرئيسي', location: 'المقر الرئيسي', isDefault: true }
      ];
      setWarehouses(defaultWh);
      localStorage.setItem('nilemart_warehouses', JSON.stringify(defaultWh));

      // Keep only master admin
      const masterOnly: EmployeeUser[] = [
        {
          id: 'emp-1',
          username: settings.adminUsername || '01205520031',
          name: 'المدير العام والمالك',
          passwordHash: settings.adminPassword || '11183@96',
          jobRole: 'المدير العام والمالك (Super Admin)',
          permissions: ['dashboard', 'products', 'inventory', 'orders', 'installments', 'treasury', 'suppliers', 'customers', 'reports', 'accounting_hub', 'settings'],
          isActive: true,
          createdAt: new Date().toISOString().split('T')[0]
        }
      ];
      setEmployees(masterOnly);
      localStorage.setItem('nilemart_employees', JSON.stringify(masterOnly));

      // Notify window for instant real-time sync across any open tab or view
      window.dispatchEvent(new CustomEvent('nilemart_data_updated', { detail: { type: 'wipe' } }));
      window.dispatchEvent(new Event('storage'));

      addToast('تم حذف كافة البيانات الافتراضية بنجاح! المتجر مهيأ بالكامل للتشغيل الحقيقي من الصفر');
    } catch (err) {
      console.error('Wipe error:', err);
      addToast('حدث خطأ أثناء مسح البيانات التجريبية', 'error');
    }
  };

  // 4. Year-End Financial Closing and Account Posting
  const performYearEndClosing = (year: number) => {
    // Total Revenues
    const totalRevs = (journalEntries || [])
      .filter(j => j && (j.category === 'sale' || j.category === 'installment_interest'))
      .reduce((sum, j) => sum + (j.amount || 0), 0);

    // Total Purchases and Operating Expenses
    const totalExpenses = (journalEntries || [])
      .filter(j => j && (j.category === 'expense' || j.category === 'purchase'))
      .reduce((sum, j) => sum + (j.amount || 0), 0);

    const netProfit = totalRevs - totalExpenses;
    const closingRef = `JV-CLOSE-${year}-001`;

    const closingJv: JournalEntry = {
      id: `je-close-${year}-${Date.now()}`,
      date: `${year}-12-31`,
      referenceNumber: closingRef,
      description: `قيد إقفال الحسابات الختامية للسنة المالية ${year} وترحيل صافي ${netProfit >= 0 ? 'أرباح' : 'خسائر'} العام لحساب حقوق الملكية والأرباح المرحلة (رأس المال)`,
      debitAccount: netProfit >= 0 ? 'حـ/ ملخص الدخل والأرباح والخسائر' : 'حـ/ الأرباح المرحلة وحقوق الملكية',
      creditAccount: netProfit >= 0 ? 'حـ/ الأرباح المرحلة وحقوق الملكية (رأس المال)' : 'حـ/ ملخص الدخل والأرباح والخسائر',
      amount: Math.abs(netProfit),
      category: 'transfer'
    };

    setJournalEntries(prev => [closingJv, ...prev]);
    addToast(`تم إقفال السنة المالية ${year} وترحيل صافي ${netProfit >= 0 ? 'أرباح' : 'خسائر'} (${Math.abs(netProfit).toLocaleString()} ج.م) بنجاح وبنسبة خطأ 0%`);

    return { netProfit, closingEntryId: closingRef };
  };

  // Follower Logic
  const isFollowing = !!currentFollower;
  const baseCount = typeof settings.baseFollowersCount === 'number' ? settings.baseFollowersCount : 2485930;
  const totalFollowersCount = baseCount + followers.length;

  const followStore = (data: { name: string; phone: string; governorate?: string }) => {
    const trimmedPhone = data.phone.trim();
    const existing = followers.find(f => f.phone.trim() === trimmedPhone);
    if (existing) {
      setCurrentFollower(existing);
      addToast(`أهلاً بك مجدداً يا ${existing.name}! أنت تتابع المتجر وستصلك أحدث العروض فوراً`);
      setIsFollowModalOpen(false);
      return;
    }

    const avatarColors = ['bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600', 'bg-sky-600', 'bg-purple-600', 'bg-teal-600'];
    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newFollower: StoreFollower = {
      id: `fol-${Date.now()}`,
      name: data.name.trim() || 'عميل مميز',
      phone: trimmedPhone || '01000000000',
      governorate: data.governorate?.trim() || 'القاهرة',
      followedAt: formattedDate,
      notifyOnPriceDrops: true,
      notifyOnNewArrivals: true,
      avatarColor: randomColor
    };

    const updated = [newFollower, ...followers];
    setFollowers(updated);
    setCurrentFollower(newFollower);
    addToast(`شكراً لمتابعتك يا ${newFollower.name}! تم انضمامك لقائمة المتابعين وحصولك على خصومات وعروض المتابعين.`);
    setIsFollowModalOpen(false);
    broadcastLiveChange();
  };

  const unfollowStore = () => {
    if (currentFollower) {
      setFollowers(prev => prev.filter(f => f.id !== currentFollower.id));
      setCurrentFollower(null);
      addToast('تم إلغاء متابعة المتجر');
      broadcastLiveChange();
    }
  };

  // Wishlist Logic (Noon-style)
  const isProductInWishlist = (productId: string, collectionId?: string) => {
    if (collectionId) {
      return wishlist.some(w => w.productId === productId && w.collectionId === collectionId);
    }
    return wishlist.some(w => w.productId === productId);
  };

  const toggleWishlistProduct = (productId: string, collectionId: string = 'col-default'): boolean => {
    const existingIndex = wishlist.findIndex(w => w.productId === productId && w.collectionId === collectionId);
    const prod = products.find(p => p.id === productId);
    const targetCol = collections.find(c => c.id === collectionId) || collections[0];
    const colName = targetCol ? targetCol.name : 'منتجات نفسك تشتريها';

    if (existingIndex >= 0) {
      // Remove
      setWishlist(prev => prev.filter((_, idx) => idx !== existingIndex));
      addToast(`تم إزالة "${prod?.name || 'المنتج'}" من قائمة ${colName}`);
      broadcastLiveChange();
      return false;
    } else {
      // Add
      const newItem: WishlistItem = {
        productId,
        collectionId,
        addedAt: new Date().toISOString().split('T')[0],
        savedPrice: prod ? prod.price : 0
      };
      setWishlist(prev => [newItem, ...prev]);
      addToast(`تمت إضافة "${prod?.name || 'المنتج'}" إلى "${colName}" ❤️`);
      broadcastLiveChange();
      return true;
    }
  };

  const removeFromWishlist = (productId: string, collectionId?: string) => {
    if (collectionId) {
      setWishlist(prev => prev.filter(w => !(w.productId === productId && w.collectionId === collectionId)));
    } else {
      setWishlist(prev => prev.filter(w => w.productId !== productId));
    }
    addToast('تمت الإزالة من المفضلة');
    broadcastLiveChange();
  };

  const createWishlistCollection = (name: string): WishlistCollection => {
    const trimmed = name.trim();
    const newCol: WishlistCollection = {
      id: `col-${Date.now()}`,
      name: trimmed || 'مجموعتي الجديدة',
      createdAt: new Date().toISOString().split('T')[0],
      isDefault: false
    };
    setCollections(prev => [...prev, newCol]);
    setActiveCollectionId(newCol.id);
    addToast(`تم إنشاء المجموعة الجديدة: "${newCol.name}" بنجاح!`);
    broadcastLiveChange();
    return newCol;
  };

  const deleteWishlistCollection = (collectionId: string) => {
    if (collectionId === 'col-default') {
      addToast('لا يمكن حذف المجموعة الافتراضية الرئيسية (منتجات نفسك تشتريها)', 'error');
      return;
    }
    setCollections(prev => prev.filter(c => c.id !== collectionId));
    setWishlist(prev => prev.filter(w => w.collectionId !== collectionId));
    setActiveCollectionId('col-default');
    addToast('تم حذف المجموعة المحددة');
    broadcastLiveChange();
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        updateSettings,
        currentUser,
        employees,
        isLoginModalOpen,
        setIsLoginModalOpen,
        loginAdmin,
        logoutAdmin,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        hasPermission,
        viewMode,
        setViewMode,
        adminTab,
        setAdminTab,
        categories,
        products,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
        previewImage,
        setPreviewImage,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackingModalOpen,
        setIsTrackingModalOpen,
        trackingOrderQuery,
        setTrackingOrderQuery,
        orders,
        createOrder,
        updateOrderStatus,
        getShippingFee,
        updateGovernorateShippingFee,
        addShippingRegion,
        updateShippingRegion,
        deleteShippingRegion,
        resetShippingRegionsToDefault,
        isInstallmentModalOpen,
        setIsInstallmentModalOpen,
        activeInstallmentProduct,
        openInstallmentApplication,
        selectedContractApp,
        setSelectedContractApp,
        socialShareProduct,
        setSocialShareProduct,
        installmentApps,
        submitInstallmentApplication,
        reviewInstallmentApplication,
        signContractAndActivate,
        collectMonthlyInstallment,
        treasuryAccounts,
        suppliers,
        supplierInvoices,
        customers,
        journalEntries,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductPrices,
        setProductOpeningStock,
        warehouses,
        addWarehouse,
        updateWarehouse,
        deleteWarehouse,
        warehouseTransfers,
        createWarehouseTransfer,
        inventoryAdjustments,
        createInventoryAdjustment,
        addCategory,
        updateCategory,
        deleteCategory,
        updateTreasuryBalance,
        transferBetweenTreasuries,
        addSupplier,
        createSupplierInvoice,
        paySupplierInvoice,
        downloadBackup,
        restoreBackup,
        wipeDefaultData,
        addJournalEntry,
        performYearEndClosing,
        followers,
        isFollowing,
        currentFollower,
        totalFollowersCount,
        followStore,
        unfollowStore,
        isFollowModalOpen,
        setIsFollowModalOpen,
        isFollowerFeedOpen,
        setIsFollowerFeedOpen,
        wishlist,
        collections,
        activeCollectionId,
        setActiveCollectionId,
        isWishlistOpen,
        setIsWishlistOpen,
        isAddProductsModalOpen,
        setIsAddProductsModalOpen,
        toggleWishlistProduct,
        isProductInWishlist,
        createWishlistCollection,
        deleteWishlistCollection,
        removeFromWishlist,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
