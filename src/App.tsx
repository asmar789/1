import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ListingDetailPage from './pages/ListingDetailPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPanelPage from './pages/AdminPanelPage';
import type { Listing } from './lib/supabase';

type Page = 'home' | 'detail' | 'login' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    if (page !== 'detail') {
      setSelectedListing(null);
    }
  };

  const handleListingClick = (listing: Listing) => {
    setSelectedListing(listing);
    setCurrentPage('detail');
  };

  const handleBackFromDetail = () => {
    setSelectedListing(null);
    setCurrentPage('home');
  };

  const handleLoginSuccess = () => {
    setCurrentPage('admin');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onListingClick={handleListingClick} />;
      case 'detail':
        if (!selectedListing) return <HomePage onListingClick={handleListingClick} />;
        return <ListingDetailPage listing={selectedListing} onBack={handleBackFromDetail} />;
      case 'login':
        return <AdminLoginPage onBack={() => setCurrentPage('home')} onSuccess={handleLoginSuccess} />;
      case 'admin':
        return <AdminPanelPage />;
      default:
        return <HomePage onListingClick={handleListingClick} />;
    }
  };

  const showHeader = currentPage !== 'login';

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen bg-white">
          {showHeader && <Header currentPage={currentPage} onNavigate={handleNavigate} />}
          {renderPage()}
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
