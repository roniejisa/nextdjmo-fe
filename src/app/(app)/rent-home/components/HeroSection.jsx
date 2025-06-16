// components/HeroSection.jsx
import { Search } from "lucide-react";

const HeroSection = ({
  textPrimaryClasses,
  textSecondaryClasses,
  glassClasses,
}) => {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    alert("Chức năng tìm kiếm đang được phát triển!");
  };

  return (
    <section className="pt-32 pb-20" id="home">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1
            className={`text-5xl md:text-7xl font-bold ${textPrimaryClasses} mb-6 leading-tight`}
          >
            Tìm Ngôi Nhà
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Mơ Ước
            </span>
            <br />
            Của Bạn
          </h1>
          <p
            className={`text-xl md:text-2xl ${textSecondaryClasses} mb-12 leading-relaxed`}
          >
            Nền tảng cho thuê nhà hàng đầu Việt Nam với hàng nghìn lựa chọn chất
            lượng
          </p>

          <div className={`${glassClasses} p-8 rounded-3xl max-w-4xl mx-auto`}>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                className={`flex-1 px-6 py-4 rounded-2xl ${glassClasses} ${textPrimaryClasses} placeholder-gray-500 border-0 focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
                placeholder="Nhập địa điểm..."
              />
              <select
                className={`flex-1 px-6 py-4 rounded-2xl ${glassClasses} ${textPrimaryClasses} border-0 focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
              >
                <option>Loại nhà</option>
                <option>Chung cư</option>
                <option>Nhà riêng</option>
                <option>Studio</option>
              </select>
              <input
                type="text"
                className={`flex-1 px-6 py-4 rounded-2xl ${glassClasses} ${textPrimaryClasses} placeholder-gray-500 border-0 focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
                placeholder="Giá thuê"
              />
              <button
                onClick={handleSearchSubmit}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
