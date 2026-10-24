import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Storefront } from './components/Storefront';
import { AdminPortal } from './components/AdminPortal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SocialShareModal } from './components/SocialShareModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { InstallmentApplicationModal } from './components/InstallmentApplicationModal';
import { LegalContractModal } from './components/LegalContractModal';
import { GlobalPrintModal } from './components/GlobalPrintModal';
import { WishlistModal } from './components/WishlistModal';
import { FollowStoreModal } from './components/FollowStoreModal';
import { FollowerFeedModal } from './components/FollowerFeedModal';
import { ToastContainer } from './components/ToastContainer';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppContent() {
  const { viewMode, currentUser } = useStore();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-['Cairo',sans-serif] selection:bg-amber-400 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar />

      {/* Main View: Storefront vs Admin ERP (Protected by Auth) */}
      {viewMode === 'admin' && currentUser ? <AdminPortal /> : <Storefront />}

      {/* Application Modals */}
      <AdminLoginModal />
      <OrderTrackingModal />
      <ImageLightboxModal />
      <ProductDetailModal />
      <SocialShareModal />
      <CartDrawer />
      <CheckoutModal />
      <InstallmentApplicationModal />
      <LegalContractModal />
      <GlobalPrintModal />
      <WishlistModal />
      <FollowStoreModal />
      <FollowerFeedModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </ErrorBoundary>
  );
}
