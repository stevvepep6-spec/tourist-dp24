import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, Wallet, User, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Place, Food } from '../types';
import { Link } from '../components/Link';
import { useAuth } from '../contexts/AuthContext';

export function HomePage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'places' | 'foods'>('all');
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [placesRes, foodsRes] = await Promise.all([
      supabase.from('places').select('*').order('rating', { ascending: false }),
      supabase.from('foods').select('*').order('rating', { ascending: false }),
    ]);

    if (placesRes.data) setPlaces(placesRes.data);
    if (foodsRes.data) setFoods(foodsRes.data);
    setLoading(false);
  };

  const filteredPlaces = places.filter(
    (place) =>
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFoods = foods.filter(
    (food) =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showPlaces = activeTab === 'all' || activeTab === 'places';
  const showFoods = activeTab === 'all' || activeTab === 'foods';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-8 h-8 text-orange-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Wonderful Indonesia
              </h1>
            </div>
            {user ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <User className="w-5 h-5" />
                <span>{profile?.full_name || 'Profile'}</span>
              </Link>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <LogIn className="w-5 h-5" />
                <span>Masuk</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Explore Indonesia's Beauty
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Discover breathtaking destinations and authentic Indonesian cuisine
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
              <input
                type="text"
                placeholder="Search places, food, or cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-lg border-2 border-white/20 focus:border-orange-500 focus:outline-none shadow-2xl bg-white/95 backdrop-blur-sm transition-all duration-300 focus:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-orange-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('places')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'places'
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-orange-50'
            }`}
          >
            Places
          </button>
          <button
            onClick={() => setActiveTab('foods')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'foods'
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-orange-50'
            }`}
          >
            Foods
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600"></div>
          </div>
        ) : (
          <>
            {showPlaces && filteredPlaces.length > 0 && (
              <section className="mb-16">
                <h3 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                  <MapPin className="w-8 h-8 text-orange-600" />
                  Tourist Destinations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPlaces.map((place, index) => (
                    <Link
                      key={place.id}
                      to={`/place/${place.id}`}
                      className="group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up">
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={place.image_url}
                            alt={place.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-gray-800">{place.rating}</span>
                          </div>
                          <div className="absolute bottom-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {place.category}
                          </div>
                        </div>
                        <div className="p-6">
                          <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                            {place.name}
                          </h4>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {place.description}
                          </p>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-orange-600 flex-shrink-0" />
                              <span className="line-clamp-1">{place.city}, {place.province}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-orange-600 flex-shrink-0" />
                              <span className="line-clamp-1">{place.operational_hours}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Wallet className="w-4 h-4 text-orange-600 flex-shrink-0" />
                              <span className="font-semibold text-gray-800">{place.price_range}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {showFoods && filteredFoods.length > 0 && (
              <section>
                <h3 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                  <Wallet className="w-8 h-8 text-orange-600" />
                  Indonesian Cuisine
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredFoods.map((food, index) => (
                    <Link
                      key={food.id}
                      to={`/food/${food.id}`}
                      className="group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up">
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={food.image_url}
                            alt={food.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-gray-800">{food.rating}</span>
                          </div>
                          <div className="absolute bottom-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {food.category}
                          </div>
                        </div>
                        <div className="p-6">
                          <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                            {food.name}
                          </h4>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {food.description}
                          </p>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-orange-600 flex-shrink-0" />
                              <span className="line-clamp-1">{food.city}, {food.province}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-orange-600 flex-shrink-0" />
                              <span className="line-clamp-1">{food.operational_hours}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Wallet className="w-4 h-4 text-orange-600 flex-shrink-0" />
                              <span className="font-semibold text-gray-800">{food.price_range}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {((showPlaces && filteredPlaces.length === 0) || (showFoods && filteredFoods.length === 0)) &&
              (filteredPlaces.length === 0 && filteredFoods.length === 0) && (
                <div className="text-center py-20">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl text-gray-600">No results found for "{searchQuery}"</p>
                  <p className="text-gray-500 mt-2">Try a different search term</p>
                </div>
              )}
          </>
        )}
      </div>

      <footer className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg font-semibold mb-2">Wonderful Indonesia</p>
          <p className="text-white/80">Discover the beauty and flavors of Indonesia</p>
        </div>
      </footer>
    </div>
  );
}
