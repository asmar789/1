import { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-lg leading-tight">Silopi</span>
                <span className="text-xs text-orange-500 font-medium -mt-0.5">Sahibinden</span>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'home' ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              Ana Sayfa
            </button>
            {isAuthenticated && (
              <button
                onClick={() => onNavigate('admin')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'admin' ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                Admin Paneli
              </button>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Admin</span>
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-gray-600 hover:text-red-500 font-medium transition-colors"
                >
                  Cikis Yap
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Admin Giris</span>
              </button>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <nav className="flex flex-col p-4 gap-2">
            <button
              onClick={() => {
                onNavigate('home');
                setIsMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'home' ? 'bg-orange-50 text-orange-500' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Ana Sayfa
            </button>
            {isAuthenticated && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'admin' ? 'bg-orange-50 text-orange-500' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Admin Paneli
              </button>
            )}
            <div className="h-px bg-gray-100 my-2" />
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                  onNavigate('home');
                }}
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                Cikis Yap
              </button>
            ) : (
              <button
                onClick={() => {
                  onNavigate('login');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 bg-gray-900 text-white rounded-lg transition-colors"
              >
                Admin Giris
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
