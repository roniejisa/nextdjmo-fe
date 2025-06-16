// components/StatsSection.jsx
import { Home, Users, MapPin, Star } from "lucide-react";

const StatsSection = ({ glassClasses, textPrimaryClasses, textSecondaryClasses }) => {
  const stats = [
    { number: "50,000+", label: "Căn nhà", icon: Home },
    { number: "200,000+", label: "Khách hàng", icon: Users },
    { number: "15+", label: "Tỉnh thành", icon: MapPin },
    { number: "98%", label: "Hài lòng", icon: Star }
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className={`${glassClasses} p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300`}
              >
                <div className="flex justify-center mb-4">
                  <IconComponent className="w-8 h-8 text-indigo-500" />
                </div>
                <div className={`text-3xl font-bold ${textPrimaryClasses} mb-2`}>
                  {stat.number}
                </div>
                <div className={`${textSecondaryClasses}`}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;