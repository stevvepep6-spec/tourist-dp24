import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Star, Clock, Wallet, Navigation } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Food } from '../types';
import { Link } from '../components/Link';

interface FoodDetailPageProps {
  id: string;
}

export function FoodDetailPage({ id }: FoodDetailPageProps) {
  const [food, setFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFood();
  }, [id]);

  const fetchFood = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('foods')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (data) setFood(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600"></div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Food not found</p>
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
              src={food.image_url}
              alt={food.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-block bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
                    {food.category}
                  </div>
                  <h1 className="text-5xl font-bold text-white mb-2">{food.name}</h1>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="w-5 h-5" />
                    <span className="text-lg">{food.city}, {food.province}</span>
                  </div>
                </div>
                <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold text-gray-800">{food.rating}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-red-600 p-2 rounded-xl">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Operational Hours</h3>
                </div>
                <p className="text-gray-700">{food.operational_hours}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-red-600 p-2 rounded-xl">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Price Range</h3>
                </div>
                <p className="text-gray-700 font-semibold">{food.price_range}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-red-600 p-2 rounded-xl">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Location</h3>
                </div>
                <p className="text-gray-700">{food.location}</p>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">About This Food</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{food.description}</p>
            </div>

            {food.latitude && food.longitude && (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Where to Find It</h2>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100">
                  <div className="flex items-center gap-3 mb-4">
                    <Navigation className="w-5 h-5 text-orange-600" />
                    <span className="text-gray-700">
                      Coordinates: {food.latitude}, {food.longitude}
                    </span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${food.latitude},${food.longitude}`}
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
