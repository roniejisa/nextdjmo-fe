import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const TestimonialsSection = ({ glassClasses, textPrimaryClasses, textSecondaryClasses }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Nguyễn Thị Mai",
      role: "Sinh viên",
      content:
        "RentHome giúp tôi tìm được căn phòng hoàn hảo gần trường đại học với giá cả hợp lý. Dịch vụ tuyệt vời!",
      rating: 5,
      avatar: "👩‍🎓",
    },
    {
      name: "Trần Văn Nam",
      role: "Kỹ sư IT",
      content:
        "Giao diện dễ sử dụng, tìm kiếm nhanh chóng. Tôi đã thuê được căn hộ mơ ước chỉ trong 3 ngày!",
      rating: 5,
      avatar: "👨‍💻",
    },
    {
      name: "Lê Thị Hoa",
      role: "Nhân viên văn phòng",
      content:
        "Đội ngũ hỗ trợ rất nhiệt tình và chuyên nghiệp. Họ đã giúp tôi giải quyết mọi thắc mắc một cách nhanh chóng.",
      rating: 5,
      avatar: "👩‍💼",
    },
  ];

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(testimonialInterval);
  }, [testimonials.length]);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-bold ${textPrimaryClasses} mb-6`}
          >
            Khách Hàng Nói Gì?
          </h2>
          <p className={`text-xl ${textSecondaryClasses} max-w-2xl mx-auto`}>
            Hàng nghìn khách hàng đã tin tưởng và hài lòng với dịch vụ của
            chúng tôi
          </p>
        </div>

        <div
          className={`${glassClasses} rounded-3xl p-8 max-w-4xl mx-auto relative overflow-hidden`}
        >
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() =>
                setCurrentTestimonial(
                  (prev) =>
                    (prev - 1 + testimonials.length) % testimonials.length
                )
              }
              className={`${glassClasses} p-3 rounded-full hover:scale-110 transition-all duration-300`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setCurrentTestimonial(
                  (prev) => (prev + 1) % testimonials.length
                )
              }
              className={`${glassClasses} p-3 rounded-full hover:scale-110 transition-all duration-300`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center">
            <div className="text-6xl mb-6">
              {testimonials[currentTestimonial].avatar}
            </div>
            <div className="flex justify-center mb-4">
              {[...Array(testimonials[currentTestimonial].rating)].map(
                (_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                )
              )}
            </div>
            <p
              className={`text-xl ${textPrimaryClasses} mb-6 leading-relaxed italic`}
            >
              {'"'}
              {testimonials[currentTestimonial].content}
              {'"'}
            </p>
            <div>
              <div className={`text-lg font-semibold ${textPrimaryClasses}`}>
                {testimonials[currentTestimonial].name}
              </div>
              <div className={`${textSecondaryClasses}`}>
                {testimonials[currentTestimonial].role}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? "bg-indigo-500 scale-125"
                    : "bg-gray-400 hover:bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;