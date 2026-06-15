import { useState } from 'react';
import { ArrowLeft, Phone, MessageCircle, MapPin, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Listing } from '../lib/supabase';

interface ListingDetailPageProps {
  listing: Listing;
  onBack: () => void;
}

const categoryLabels: Record<string, string> = {
  arac: 'Arac',
  ev: 'Ev',
  arsa: 'Arsa',
  telefon: 'Telefon',
};

const categoryColors: Record<string, string> = {
  arac: 'bg-blue-100 text-blue-700',
  ev: 'bg-green-100 text-green-700',
  arsa: 'bg-yellow-100 text-yellow-700',
  telefon: 'bg-purple-100 text-purple-700',
};

export default function ListingDetailPage({ listing, onBack }: ListingDetailPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${listing.phone}`;
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Merhaba, ilan hakkinda bilgi almak istiyorum.');
    window.open(`https://wa.me/${listing.whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Geri Don</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <div
                className="relative aspect-[4/3] cursor-pointer"
                onClick={() => setIsLightboxOpen(true)}
              >
                {listing.images.length > 0 ? (
                  <img
                    src={listing.images[currentImageIndex]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <span className="text-gray-400">Fotograf yok</span>
                  </div>
                )}

                {listing.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage();
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage();
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                  </>
                )}

                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[listing.category]}`}>
                    {categoryLabels[listing.category]}
                  </span>
                </div>
              </div>

              {listing.images.length > 1 && (
                <div className="p-4 border-t border-gray-100">
                  <div className="flex gap-2 overflow-x-auto">
                    {listing.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                          currentImageIndex === index ? 'ring-2 ring-orange-500' : ''
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${listing.title} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {listing.title}
              </h1>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl md:text-4xl font-bold text-orange-500">
                  {listing.price}
                </span>
              </div>

              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Konum</p>
                    <p className="font-medium text-gray-900">{listing.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Ilan Tarihi</p>
                    <p className="font-medium text-gray-900">{formatDate(listing.created_at)}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={handlePhoneClick}
                  className="btn-phone flex-1 flex items-center justify-center gap-2 py-3"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">Telefon ile Ara</span>
                </button>
                <button
                  onClick={handleWhatsAppClick}
                  className="btn-whatsapp flex-1 flex items-center justify-center gap-2 py-3"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">WhatsApp ile Yaz</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md mt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Aciklama</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {listing.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isLightboxOpen && listing.images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevImage();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>

          <img
            src={listing.images[currentImageIndex]}
            alt={listing.title}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextImage();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {listing.images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentImageIndex === index ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
