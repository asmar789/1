import { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Image,
  Phone,
  MessageCircle,
  MapPin,
  X,
  Loader2,
  Eye,
  Car,
  Home,
  MapPin as MapPinIcon,
  Smartphone,
} from 'lucide-react';
import { supabase, type Listing } from '../lib/supabase';
import { useToast } from '../context/ToastContext';

const categories = [
  { id: 'arac', name: 'Arac', icon: Car },
  { id: 'ev', name: 'Ev', icon: Home },
  { id: 'arsa', name: 'Arsa', icon: MapPinIcon },
  { id: 'telefon', name: 'Telefon', icon: Smartphone },
];

const categoryLabels: Record<string, string> = {
  arac: 'Arac',
  ev: 'Ev',
  arsa: 'Arsa',
  telefon: 'Telefon',
};

export default function AdminPanelPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    category: 'arac' as Listing['category'],
    images: [''],
    phone: '',
    whatsapp: '',
  });
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      showToast('Ilanlar yuklenemedi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (listing?: Listing) => {
    if (listing) {
      setEditingListing(listing);
      setFormData({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        location: listing.location,
        category: listing.category,
        images: listing.images.length > 0 ? listing.images : [''],
        phone: listing.phone,
        whatsapp: listing.whatsapp,
      });
    } else {
      setEditingListing(null);
      setFormData({
        title: '',
        description: '',
        price: '',
        location: '',
        category: 'arac',
        images: [''],
        phone: '',
        whatsapp: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingListing(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      location: '',
      category: 'arac',
      images: [''],
      phone: '',
      whatsapp: '',
    });
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index: number) => {
    if (formData.images.length === 1) {
      setFormData({ ...formData, images: [''] });
    } else {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData({ ...formData, images: newImages });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const filteredImages = formData.images.filter((img) => img.trim() !== '');

    try {
      if (editingListing) {
        const { error } = await supabase
          .from('listings')
          .update({
            title: formData.title,
            description: formData.description,
            price: formData.price,
            location: formData.location,
            category: formData.category,
            images: filteredImages,
            phone: formData.phone,
            whatsapp: formData.whatsapp,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingListing.id);

        if (error) throw error;
        showToast('Ilan guncellendi', 'success');
      } else {
        const { error } = await supabase.from('listings').insert({
          title: formData.title,
          description: formData.description,
          price: formData.price,
          location: formData.location,
          category: formData.category,
          images: filteredImages,
          phone: formData.phone,
          whatsapp: formData.whatsapp,
        });

        if (error) throw error;
        showToast('Ilan eklendi', 'success');
      }

      closeModal();
      fetchListings();
    } catch (error) {
      console.error('Error saving listing:', error);
      showToast('Ilan kaydedilemedi', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ilani silmek istediginize emin misiniz?')) return;

    try {
      const { error } = await supabase.from('listings').delete().eq('id', id);

      if (error) throw error;
      showToast('Ilan silindi', 'success');
      fetchListings();
    } catch (error) {
      console.error('Error deleting listing:', error);
      showToast('Ilan silinemedi', 'error');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Paneli</h1>
            <p className="text-gray-500 mt-1">Ilanlarinizi yonetin</p>
          </div>
          <button
            onClick={() => openModal()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Yeni Ilan Ekle</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Heniz ilan yok</h3>
            <p className="text-gray-500 mb-6">Ilk ilaninizi ekleyerek baslayin</p>
            <button
              onClick={() => openModal()}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Ilk Ilani Ekle</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ilan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Kategori
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Fiyat
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Konum
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Tarih
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Islemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {listing.images.length > 0 ? (
                              <img
                                src={listing.images[0]}
                                alt={listing.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Image className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate max-w-[200px]">
                              {listing.title}
                            </p>
                            <p className="text-sm text-gray-500 md:hidden">
                              {listing.price}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                          {categoryLabels[listing.category]}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="font-medium text-gray-900">{listing.price}</span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-gray-600">{listing.location}</span>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className="text-gray-500 text-sm">{formatDate(listing.created_at)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openModal(listing)}
                            className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Duzenle"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(listing.id)}
                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingListing ? 'Ilani Duzenle' : 'Yeni Ilan Ekle'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ilan Basligi *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="Ornek: 2020 Model Honda Civic"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aciklama *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field min-h-[120px] resize-none"
                    placeholder="Ilacinin detayli aciklamasini yazin..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fiyat *
                    </label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="input-field"
                      placeholder="Ornek: 250.000 TL"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konum *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="input-field pl-12"
                        placeholder="Ornek: Silopi, Sirnak"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.id as Listing['category'] })}
                        className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                          formData.category === cat.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <cat.icon className={`w-6 h-6 mb-2 ${formData.category === cat.id ? 'text-orange-500' : 'text-gray-500'}`} />
                        <span className={`text-sm font-medium ${formData.category === cat.id ? 'text-orange-500' : 'text-gray-600'}`}>
                          {cat.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fotograf URL'leri
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Fotograf URL'lerini her satira bir tane olacak sekilde ekleyin
                  </p>
                  <div className="space-y-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="relative flex-1">
                          <Image className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="url"
                            value={image}
                            onChange={(e) => handleImageChange(index, e.target.value)}
                            className="input-field pl-12"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addImageField}
                    className="mt-2 text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Baska fotograf ekle</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon Numarasi *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="input-field pl-12"
                        placeholder="0532 123 45 67"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Numarasi *
                    </label>
                    <div className="relative">
                      <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="input-field pl-12"
                        placeholder="0532 123 45 67"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary flex-1 py-3"
                >
                  Iptal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Kaydediliyor...</span>
                    </>
                  ) : (
                    <span>{editingListing ? 'Kaydet' : 'Ilan Ekle'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
