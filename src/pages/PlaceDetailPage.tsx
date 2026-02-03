import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Star, Clock, Wallet, Navigation, Heart, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Place } from '../types';
import { Link } from '../components/Link';
import { useAuth } from '../contexts/AuthContext';

interface PlaceDetailPageProps {
  id: string;
}

export function PlaceDetailPage({ id }: PlaceDetailPageProps) {
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inHistory, setInHistory] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchPlace();
    if (user) {
      checkFavoriteStatus();
      checkHistoryStatus();
    }
  }, [id, user]);

  const fetchPlace = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('places')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (data) setPlace(data);
    setLoading(false);
  };

  const checkFavoriteStatus = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('item_id', id)
      .eq('item_type', 'place')
      .maybeSingle();

    setIsFavorite(!!data);
  };

  const checkHistoryStatus = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('history')
      .select('id')
      .eq('user_id', user.id)
      .eq('item_id', id)
      .eq('item_type', 'place')
      .maybeSingle();

    setInHistory(!!data);
  };

  const toggleFavorite = async () => {
    if (!user) {
      window.history.pushState({}, '', '/auth');
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }

    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('item_id', id)
        .eq('item_type', 'place');
      setIsFavorite(false);
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, item_id: id, item_type: 'place' });
      setIsFavorite(true);
    }
  };

  const toggleHistory = async () => {
    if (!user) {
      window.history.pushState({}, '', '/auth');
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }

    if (inHistory) {
      await supabase
        .from('history')
        .delete()
        .eq('user_id', user.id)
        .eq('item_id', id)
        .eq('item_type', 'place');
      setInHistory(false);
    } else {
      await supabase
        .from('history')
        .insert({ user_id: user.id, item_id: id, item_type: 'place' });
      setInHistory(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600"></div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Place not found</p>
          <Link to="/" className="text-orange-600 hover:text-orange-700 font-semibold">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Home</span>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
          <div className="relative h-96 overflow-hidden">
            <img
              src={place.image_url}
              alt={place.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-block bg-orange-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
                    {place.category}
                  </div>
                  <h1 className="text-5xl font-bold text-white mb-2">{place.name}</h1>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="w-5 h-5" />
                    <span className="text-lg">{place.city}, {place.province}</span>
                  </div>
                </div>
                <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold text-gray-800">{place.rating}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-orange-600 p-2 rounded-xl">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Operational Hours</h3>
                </div>
                <p className="text-gray-700">{place.operational_hours}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-orange-600 p-2 rounded-xl">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Price Range</h3>
                </div>
                <p className="text-gray-700 font-semibold">{place.price_range}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-orange-600 p-2 rounded-xl">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Location</h3>
                </div>
                <p className="text-gray-700">{place.location}</p>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">About This Place</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{place.description}</p>
            </div>

            {user && (
              <div className="flex gap-4 mb-10">
                <button
                  onClick={toggleFavorite}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isFavorite
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg'
                      : 'bg-white border-2 border-orange-200 text-gray-700 hover:border-orange-400'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                  {isFavorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
                </button>
                <button
                  onClick={toggleHistory}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    inHistory
                      ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg'
                      : 'bg-white border-2 border-orange-200 text-gray-700 hover:border-orange-400'
                  }`}
                >
                  <CheckCircle className={`w-5 h-5 ${inHistory ? 'fill-white' : ''}`} />
                  {inHistory ? 'Sudah Dikunjungi' : 'Tandai Sudah Dikunjungi'}
                </button>
              </div>
            )}

            {place.latitude && place.longitude && (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Location</h2>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100">
                  <div className="flex items-center gap-3 mb-4">
                    <Navigation className="w-5 h-5 text-orange-600" />
                    <span className="text-gray-700">
                      Coordinates: {place.latitude}, {place.longitude}
                    </span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <MapPin className="w-5 h-5" />
                    Open in Google Maps
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
