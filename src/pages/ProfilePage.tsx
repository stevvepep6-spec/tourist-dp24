import { useState, useEffect } from 'react';
import { User, Heart, History, LogOut, MapPin, Star, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Place, Food } from '../types';
import { Link } from '../components/Link';

interface FavoriteWithDetails {
  id: string;
  item_type: 'place' | 'food';
  item: Place | Food;
}

interface HistoryWithDetails {
  id: string;
  item_type: 'place' | 'food';
  visited_at: string;
  item: Place | Food;
}

export function ProfilePage() {
  const { user, profile, signOut, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>('favorites');
  const [favorites, setFavorites] = useState<FavoriteWithDetails[]>([]);
  const [history, setHistory] = useState<HistoryWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (!user) {
      window.history.pushState({}, '', '/auth');
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }
    if (profile) {
      setEditName(profile.full_name);
    }
    fetchData();
  }, [user, profile]);

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    await Promise.all([fetchFavorites(), fetchHistory()]);
    setLoading(false);
  };

  const fetchFavorites = async () => {
    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (data) {
      const favoritesWithDetails = await Promise.all(
        data.map(async (fav) => {
          const table = fav.item_type === 'place' ? 'places' : 'foods';
          const { data: item } = await supabase
            .from(table)
            .select('*')
            .eq('id', fav.item_id)
            .maybeSingle();

          return {
            id: fav.id,
            item_type: fav.item_type,
            item: item,
          };
        })
      );

      setFavorites(favoritesWithDetails.filter((f) => f.item));
    }
  };

  const fetchHistory = async () => {
    const { data } = await supabase
      .from('history')
      .select('*')
      .eq('user_id', user?.id)
      .order('visited_at', { ascending: false });

    if (data) {
      const historyWithDetails = await Promise.all(
        data.map(async (hist) => {
          const table = hist.item_type === 'place' ? 'places' : 'foods';
          const { data: item } = await supabase
            .from(table)
            .select('*')
            .eq('id', hist.item_id)
            .maybeSingle();

          return {
            id: hist.id,
            item_type: hist.item_type,
            visited_at: hist.visited_at,
            item: item,
          };
        })
      );

      setHistory(historyWithDetails.filter((h) => h.item));
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;

    await updateProfile({ full_name: editName });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(profile?.full_name || '');
    setIsEditing(false);
  };

  const removeFavorite = async (id: string) => {
    await supabase.from('favorites').delete().eq('id', id);
    setFavorites(favorites.filter((f) => f.id !== id));
  };

  const removeHistory = async (id: string) => {
    await supabase.from('history').delete().eq('id', id);
    setHistory(history.filter((h) => h.id !== id));
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors">
              <MapPin className="w-8 h-8 text-orange-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Wonderful Indonesia
              </h1>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 px-8 py-12">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/50">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="text-white">
                  {isEditing ? (
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-4 py-2 rounded-xl text-gray-800 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-white"
                        placeholder="Nama lengkap"
                      />
                      <button
                        onClick={handleSaveProfile}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-3xl font-bold">{profile.full_name || 'User'}</h2>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  <p className="text-white/90 text-lg">{profile.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                <LogOut className="w-5 h-5" />
                Keluar
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="flex gap-4 mb-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
                  activeTab === 'favorites'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-orange-600'
                }`}
              >
                <Heart className="w-5 h-5" />
                Favorit ({favorites.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
                  activeTab === 'history'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-orange-600'
                }`}
              >
                <History className="w-5 h-5" />
                Riwayat ({history.length})
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-600"></div>
              </div>
            ) : (
              <>
                {activeTab === 'favorites' && (
                  <div>
                    {favorites.length === 0 ? (
                      <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-xl text-gray-600 mb-2">Belum ada favorit</p>
                        <p className="text-gray-500">Tandai destinasi atau makanan favorit Anda</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {favorites.map((fav) => (
                          <div
                            key={fav.id}
                            className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl overflow-hidden border border-orange-100 hover:shadow-lg transition-all duration-300"
                          >
                            <Link
                              to={`/${fav.item_type}/${fav.item.id}`}
                              className="block"
                            >
                              <div className="relative h-48">
                                <img
                                  src={fav.item.image_url}
                                  alt={fav.item.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-full flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-semibold text-gray-800">{fav.item.rating}</span>
                                </div>
                              </div>
                              <div className="p-4">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{fav.item.name}</h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                  {fav.item.description}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4 text-orange-600" />
                                  <span>{fav.item.city}, {fav.item.province}</span>
                                </div>
                              </div>
                            </Link>
                            <div className="px-4 pb-4">
                              <button
                                onClick={() => removeFavorite(fav.id)}
                                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
                              >
                                <X className="w-4 h-4" />
                                Hapus dari Favorit
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'history' && (
                  <div>
                    {history.length === 0 ? (
                      <div className="text-center py-12">
                        <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-xl text-gray-600 mb-2">Belum ada riwayat</p>
                        <p className="text-gray-500">Riwayat kunjungan Anda akan muncul di sini</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {history.map((hist) => (
                          <div
                            key={hist.id}
                            className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl overflow-hidden border border-orange-100 hover:shadow-lg transition-all duration-300"
                          >
                            <Link
                              to={`/${hist.item_type}/${hist.item.id}`}
                              className="block"
                            >
                              <div className="relative h-48">
                                <img
                                  src={hist.item.image_url}
                                  alt={hist.item.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-full flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-semibold text-gray-800">{hist.item.rating}</span>
                                </div>
                              </div>
                              <div className="p-4">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{hist.item.name}</h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                  {hist.item.description}
                                </p>
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-4 h-4 text-orange-600" />
                                    <span>{hist.item.city}, {hist.item.province}</span>
                                  </div>
                                  <span className="text-gray-500">
                                    {new Date(hist.visited_at).toLocaleDateString('id-ID')}
                                  </span>
                                </div>
                              </div>
                            </Link>
                            <div className="px-4 pb-4">
                              <button
                                onClick={() => removeHistory(hist.id)}
                                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
                              >
                                <X className="w-4 h-4" />
                                Hapus dari Riwayat
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
