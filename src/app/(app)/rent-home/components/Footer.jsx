import { Home, Phone, Mail, MapPin, Award, TrendingUp, Shield } from "lucide-react";

const Footer = ({ glassClasses, textPrimaryClasses, textSecondaryClasses, isDarkMode }) => {
  return (
    <footer className={`${glassClasses} mt-20`}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Home className="text-indigo-500 w-8 h-8" />
              <span className={`text-2xl font-bold ${textPrimaryClasses}`}>
                RentHome
              </span>
            </div>
            <p className={`${textSecondaryClasses} mb-6 leading-relaxed`}>
              Nền tảng cho thuê nhà hàng đầu Việt Nam, kết nối người thuê và
              chủ nhà một cách nhanh chóng, an toàn và tiện lợi.
            </p>
            <div className="flex gap-4">
              <Award className="w-6 h-6 text-yellow-500" />
              <TrendingUp className="w-6 h-6 text-green-500" />
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className={`text-lg font-semibold ${textPrimaryClasses} mb-6`}
            >
              Liên kết nhanh
            </h3>
            <ul className="space-y-3">
              {[
                "Trang chủ",
                "Nhà cho thuê",
                "Đăng tin",
                "Về chúng tôi",
                "Liên hệ",
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className={`${textSecondaryClasses} hover:text-indigo-500 transition-colors`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3
              className={`text-lg font-semibold ${textPrimaryClasses} mb-6`}
            >
              Dịch vụ
            </h3>
            <ul className="space-y-3">
              {[
                "Thuê chung cư",
                "Thuê nhà riêng",
                "Thuê phòng trọ",
                "Thuê studio",
                "Tư vấn BDS",
              ].map((service, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className={`${textSecondaryClasses} hover:text-indigo-500 transition-colors`}
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3
              className={`text-lg font-semibold ${textPrimaryClasses} mb-6`}
            >
              Thông tin liên hệ
            </h3>
            <div className="space-y-3">
              <div
                className={`flex items-center gap-2 ${textSecondaryClasses}`}
              >
                <Phone className="w-4 h-4" />
                <span>1900-1234</span>
              </div>
              <div
                className={`flex items-center gap-2 ${textSecondaryClasses}`}
              >
                <Mail className="w-4 h-4" />
                <span>info@renthome.vn</span>
              </div>
              <div
                className={`flex items-center gap-2 ${textSecondaryClasses}`}
              >
                <MapPin className="w-4 h-4" />
                <span>123 Nguyễn Huệ, Q1, TP.HCM</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`border-t ${
            isDarkMode ? "border-white/20" : "border-gray-300"
          } mt-12 pt-8 text-center`}
        >
          <p className={`${textSecondaryClasses}`}>
            © 2025 RentHome. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;