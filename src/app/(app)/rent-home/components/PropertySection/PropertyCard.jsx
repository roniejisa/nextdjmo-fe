// components/PropertyCard.jsx
import { MapPin, Star, Eye, Heart, Share2 } from "lucide-react";

const PropertyCard = ({ property, glassClasses, textPrimaryClasses, textSecondaryClasses }) => {
  console.log(property)
  return (
    <div
      className={`${glassClasses} rounded-3xl overflow-hidden hover:scale-105 transition-all duration-500 group hover:shadow-2xl cursor-pointer relative`}
    >
      {property.isFeatured && (
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
          <Star className="w-4 h-4" />
          Nổi bật
        </div>
      )}
      
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/30 transition-all duration-300">
          <Heart className="w-4 h-4 text-white" />
        </button>
        <button className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/30 transition-all duration-300">
          <Share2 className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="h-64 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500 relative">
        {property.image}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white text-sm">
          <Eye className="w-4 h-4" />
          {property.views} lượt xem
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="text-2xl font-bold text-indigo-600">
            {property.price}
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-semibold">{property.rating}</span>
          </div>
        </div>
        
        <div
          className={`text-xl font-semibold ${textPrimaryClasses} mb-2`}
        >
          {property.title}
        </div>
        
        <div
          className={`${textSecondaryClasses} mb-4 flex items-center gap-1`}
        >
          <MapPin className="w-4 h-4" />
          {property.location}
        </div>
        
        <div className="flex gap-2 mb-4 text-sm flex-wrap">
          <span className={`${glassClasses} px-3 py-1 rounded-full`}>
            🛏️ {property.bedrooms}PN
          </span>
          <span className={`${glassClasses} px-3 py-1 rounded-full`}>
            🚿 {property.bathrooms}WC
          </span>
          <span className={`${glassClasses} px-3 py-1 rounded-full`}>
            📐 {property.area}m²
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className={`text-xs px-2 py-1 rounded-full ${glassClasses} ${textSecondaryClasses}`}
            >
              {amenity}
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className={`text-xs px-2 py-1 rounded-full ${glassClasses} ${textSecondaryClasses}`}>
              +{property.amenities.length - 3} tiện ích
            </span>
          )}
        </div>

        <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;