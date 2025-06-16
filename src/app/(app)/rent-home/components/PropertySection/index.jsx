// components/PropertiesSection.jsx
import { Filter, SortAsc } from "lucide-react";
import PropertyCard from "./PropertyCard";

const PropertiesSection = ({ glassClasses, textPrimaryClasses, textSecondaryClasses }) => {
  const properties = [
    {
      id: 1,
      price: "15 triệu/tháng",
      title: "Chung cư cao cấp Q1",
      location: "Quận 1, TP.HCM",
      bedrooms: 2,
      bathrooms: 2,
      area: 80,
      image: "🏙️",
      rating: 4.8,
      views: 152,
      isFeatured: true,
      amenities: ["WiFi", "Gym", "Hồ bơi", "An ninh 24/7"]
    },
    {
      id: 2,
      price: "12 triệu/tháng",
      title: "Nhà riêng Q7",
      location: "Quận 7, TP.HCM",
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      image: "🏘️",
      rating: 4.6,
      views: 89,
      isFeatured: false,
      amenities: ["Sân vườn", "Chỗ đỗ xe", "An ninh"]
    },
    {
      id: 3,
      price: "8 triệu/tháng",
      title: "Studio hiện đại",
      location: "Quận 3, TP.HCM",
      bedrooms: 1,
      bathrooms: 1,
      area: 45,
      image: "🏢",
      rating: 4.4,
      views: 203,
      isFeatured: true,
      amenities: ["WiFi", "Máy lạnh", "Bếp"]
    },
    {
      id: 4,
      price: "18 triệu/tháng",
      title: "Penthouse Q2",
      location: "Quận 2, TP.HCM",
      bedrooms: 3,
      bathrooms: 3,
      area: 150,
      image: "🌆",
      rating: 4.9,
      views: 76,
      isFeatured: true,
      amenities: ["View sông", "Gym", "Hồ bơi", "Spa"]
    },
    {
      id: 5,
      price: "10 triệu/tháng",
      title: "Nhà phố Q10",
      location: "Quận 10, TP.HCM",
      bedrooms: 2,
      bathrooms: 2,
      area: 95,
      image: "🏠",
      rating: 4.5,
      views: 134,
      isFeatured: false,
      amenities: ["Sân thượng", "Chỗ đỗ xe", "An ninh"]
    },
    {
      id: 6,
      price: "6 triệu/tháng",
      title: "Căn hộ mini Q4",
      location: "Quận 4, TP.HCM",
      bedrooms: 1,
      bathrooms: 1,
      area: 35,
      image: "🏨",
      rating: 4.2,
      views: 167,
      isFeatured: false,
      amenities: ["WiFi", "Máy lạnh", "Gần trung tâm"]
    }
  ];

  return (
    <section className="py-20" id="properties">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-16">
          <div>
            <h2
              className={`text-4xl md:text-5xl font-bold ${textPrimaryClasses} mb-6`}
            >
              Nhà Cho Thuê Nổi Bật
            </h2>
            <p className={`text-xl ${textSecondaryClasses} max-w-2xl`}>
              Khám phá những căn nhà được yêu thích nhất tại các khu vực hot
              nhất TP.HCM
            </p>
          </div>
          <div className="flex gap-4">
            <button className={`${glassClasses} p-3 rounded-xl hover:scale-105 transition-all duration-300`}>
              <Filter className="w-5 h-5" />
            </button>
            <button className={`${glassClasses} p-3 rounded-xl hover:scale-105 transition-all duration-300`}>
              <SortAsc className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              glassClasses={glassClasses}
              textPrimaryClasses={textPrimaryClasses}
              textSecondaryClasses={textSecondaryClasses}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-105 transition-all duration-300">
            Xem tất cả nhà cho thuê
          </button>
        </div>
      </div>
    </section>
  );
};

export default PropertiesSection;