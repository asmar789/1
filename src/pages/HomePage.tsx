import { useState, useEffect } from 'react';
import { Search, Car, Home, MapPin, Smartphone, Loader2 } from 'lucide-react';
import { supabase, type Listing } from '../lib/supabase';
import ListingCard from '../components/ListingCard';

interface HomePageProps {
  onListingClick: (listing: Listing) => void;
}

const categories = [
  { id: 'arac', name: 'Arac', icon: Car },
  { id: 'ev', name: 'Ev', icon: Home },
  { id: 'arsa', name: 'Arsa', icon: MapPin },
  { id: 'telefon', name: 'Telefon', icon: Smartphone },
];

export default function HomePage({ onListingClick }: HomePageProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchListings();
  }, [selectedCategory]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter((listing) =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
              Silopi Sahibinden
            </h1>
            <p className="text-orange-100 text-lg">
              Silopi'nin en guvenilir ilan platformu
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ilan ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-300 shadow-lg text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`category-btn min-w-[100px] ${!selectedCategory ? 'border-orange-500 bg-orange-50' : ''}`}
            >
              <span className="text-2xl mb-1">Tumu</span>
              <span className="text-sm font-medium text-gray-700">Tum Ilanlar</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`category-btn min-w-[100px] ${selectedCategory === cat.id ? 'border-orange-500 bg-orange-50' : ''}`}
              >
                <cat.icon className={`w-6 h-6 ${selectedCategory === cat.id ? 'text-orange-500' : 'text-gray-600'} mb-1`} />
                <span className="text-sm font-medium text-gray-700">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Son Eklenen Ilanlar
            </h2>
            <span className="text-sm text-gray-500">
              {filteredListings.length} ilan bulundu
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ilan bulunamadi</h3>
              <p className="text-gray-500">Farkli arama kriterleri deneyin</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredListings.map((listing, index) => (
                <div
                  key={listing.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ListingCard listing={listing} onClick={() => onListingClick(listing)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg">Silopi Sahibinden</span>
                <span className="text-xs text-gray-400">Silopi'nin ilan platformu</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Tum haklari saklidir. {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
