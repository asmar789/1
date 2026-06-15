import { useState } from 'react';
import { Lock, Mail, Loader2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface AdminLoginPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function AdminLoginPage({ onBack, onSuccess }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      showToast('Basarili giris yapildi', 'success');
      onSuccess();
    } else {
      showToast(result.error || 'Giris basarisiz', 'error');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Girisi</h1>
            <p className="text-gray-400 text-sm">
              Ilan yonetmek icin giris yapin
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-12"
                    placeholder="admin@silopi.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-12"
                    placeholder="Sifrenizi girin"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Giris yapiliyor...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Giris Yap</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full mt-3 btn-secondary py-3"
            >
              Ana Sayafaya Don
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Sadece yetkili kullanicilar giris yapabilir
        </p>
      </div>
    </div>
  );
}
