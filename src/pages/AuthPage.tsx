import { useState } from 'react';
import { MapPin, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from '../components/Link';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        window.history.pushState({}, '', '/profile');
        window.dispatchEvent(new PopStateEvent('popstate'));
      } else {
        if (!fullName.trim()) {
          setError('Nama lengkap harus diisi');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        window.history.pushState({}, '', '/profile');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 text-gray-700 hover:text-orange-600 transition-colors">
            <MapPin className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Wonderful Indonesia
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? 'Selamat Datang' : 'Daftar Akun'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Masuk ke akun Anda' : 'Buat akun baru untuk melanjutkan'}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                    placeholder="Masukkan nama lengkap"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="Masukkan password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  {isLogin ? (
                    <>
                      <LogIn className="w-5 h-5" />
                      Masuk
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Daftar
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-gray-600 hover:text-orange-600 transition-colors"
            >
              {isLogin ? (
                <>
                  Belum punya akun?{' '}
                  <span className="font-semibold text-orange-600">Daftar</span>
                </>
              ) : (
                <>
                  Sudah punya akun?{' '}
                  <span className="font-semibold text-orange-600">Masuk</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
