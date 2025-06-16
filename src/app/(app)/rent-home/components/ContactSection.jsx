import { Mail, Phone, MapPin, Clock } from "lucide-react";

const ContactSection = ({ glassClasses, textPrimaryClasses, textSecondaryClasses, onSubmit }) => {
  const contactDetails = [
    { icon: Mail, text: "info@renthome.vn" },
    { icon: Phone, text: "1900-1234" },
    { icon: MapPin, text: "123 Nguyễn Huệ, Q1, TP.HCM" },
    { icon: Clock, text: "8:00 - 22:00 (Thứ 2 - Chủ nhật)" },
  ];

  return (
    <section className="py-20" id="contact">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-bold ${textPrimaryClasses} mb-6`}
          >
            Liên Hệ Với Chúng Tôi
          </h2>
          <p className={`text-xl ${textSecondaryClasses} max-w-2xl mx-auto`}>
            Đội ngũ chuyên gia luôn sẵn sàng hỗ trợ bạn tìm ngôi nhà hoàn hảo
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className={`${glassClasses} rounded-3xl p-8`}>
            <h3 className={`text-2xl font-bold ${textPrimaryClasses} mb-8`}>
              Thông Tin Liên Hệ
            </h3>

            <div className="space-y-6">
              {contactDetails.map((detail, index) => {
                const IconComponent = detail.icon;
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <span className={`${textPrimaryClasses} text-lg`}>
                      {detail.text}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-12">
              <h4
                className={`text-lg font-semibold ${textPrimaryClasses} mb-4`}
              >
                Theo dõi chúng tôi
              </h4>
              <div className="flex gap-4">
                {["facebook", "instagram", "youtube", "tiktok"].map(
                  (social, index) => (
                    <button
                      key={index}
                      className={`w-12 h-12 rounded-xl ${glassClasses} hover:scale-110 transition-all duration-300 flex items-center justify-center`}
                    >
                      <span className="text-2xl">
                        {social === "facebook" && "📘"}
                        {social === "instagram" && "📷"}
                        {social === "youtube" && "📺"}
                        {social === "tiktok" && "🎵"}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`${glassClasses} rounded-3xl p-8`}>
            <h3 className={`text-2xl font-bold ${textPrimaryClasses} mb-8`}>
              Gửi Tin Nhắn
            </h3>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  className={`w-full px-6 py-4 rounded-2xl ${glassClasses} ${textPrimaryClasses} placeholder-gray-500 border-0 focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
                  placeholder="Họ tên"
                />
                <input
                  type="email"
                  className={`w-full px-6 py-4 rounded-2xl ${glassClasses} ${textPrimaryClasses} placeholder-gray-500 border-0 focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
                  placeholder="Email"
                />
              </div>

              <input
                type="tel"
                className={`w-full px-6 py-4 rounded-2xl ${glassClasses} ${textPrimaryClasses} placeholder-gray-500 border-0 focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
                placeholder="Số điện thoại"
              />

              <select
                className={`w-full px-6 py-4 rounded-2xl ${glassClasses} ${textPrimaryClasses} border-0 focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
              >
                <option>Chọn dịch vụ quan tâm</option>
                <option>Thuê nhà</option>
                <option>Đăng tin cho thuê</option>
                <option>Tư vấn đầu tư</option>
                <option>Khác</option>
              </select>

              <textarea
                rows={5}
                className={`w-full px-6 py-4 rounded-2xl ${glassClasses} ${textPrimaryClasses} placeholder-gray-500 border-0 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none`}
                placeholder="Nội dung tin nhắn..."
              ></textarea>

              <button
                onClick={onSubmit}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-105 transition-all duration-300"
              >
                Gửi tin nhắn
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;