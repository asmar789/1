import { Phone, MessageCircle, MapPin, Calendar } from 'lucide-react';
import type { Listing } from '../lib/supabase';

interface ListingCardProps {
  listing: Listing;
  onClick: () => void;
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

export default function ListingCard({ listing, onClick }: ListingCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${listing.phone}`;
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent('Merhaba, ilan hakkinda bilgi almak istiyorum.');
    window.open(`https://wa.me/${listing.whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div
      onClick={onClick}
      className="card cursor-pointer group"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-gray-400 text-sm">Fotograf yok</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[listing.category]}`}>
            {categoryLabels[listing.category]}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
          {listing.title}
        </h3>

        <p className="text-orange-500 font-bold text-xl mb-3">
          {listing.price}
        </p>

        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <MapPin className="w-4 h-4 text-orange-400" />
            <span>{listing.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Calendar className="w-4 h-4 text-orange-400" />
            <span>{formatDate(listing.created_at)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePhoneClick}
            className="btn-phone flex-1 flex items-center justify-center gap-2 text-sm"
          >
            <Phone className="w-4 h-4" />
            <span>Ara</span>
          </button>
          <button
            onClick={handleWhatsAppClick}
            className="btn-whatsapp flex-1 flex items-center justify-center gap-2 text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
