// components/FeaturesSection.jsx
import { Search, Check, Users, Shield } from "lucide-react";

const FeaturesSection = ({ glassClasses, textPrimaryClasses, textSecondaryClasses }) => {
  const features = [
    {
      icon: Search,
      title: "Tìm kiếm thông minh",
      description:
        "Bộ lọc thông minh giúp bạn tìm được căn nhà phù hợp nhất với nhu cầu và ngân sách",
      color: "from-blue-400 to-purple-500",
    },
    {
      icon: Check,
      title: "Xác minh chất lượng",
      description:
        "Mọi tin đăng đều được kiểm duyệt kỹ lưỡng để đảm bảo thông tin chính xác và đáng tin cậy",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: Users,
      title: "Hỗ trợ 24/7",
      description:
        "Đội ngũ tư vấn chuyên nghiệp luôn sẵn sàng hỗ trợ bạn trong suốt quá trình thuê nhà",
      color: "from-orange-400 to-pink-500",
    },
    {
      icon: Shield,
      title: "Bảo mật tuyệt đối",
      description:
        "Thông tin cá nhân được bảo vệ nghiêm ngặt với công nghệ mã hóa tiên tiến",
      color: "from-purple-400 to-indigo-500",
    }
  ];

  return (
    <section className="py-20" id="services">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-bold ${textPrimaryClasses} mb-6`}
          >
            Tại Sao Chọn RentHome?
          </h2>
          <p className={`text-xl ${textSecondaryClasses} max-w-2xl mx-auto`}>
            Chúng tôi mang đến trải nghiệm thuê nhà tốt nhất với công nghệ
            hiện đại
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`${glassClasses} p-8 rounded-3xl hover:scale-105 transition-all duration-500 group hover:shadow-2xl`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3
                  className={`text-2xl font-bold ${textPrimaryClasses} mb-4`}
                >
                  {feature.title}
                </h3>
                <p className={`${textSecondaryClasses} leading-relaxed`}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;