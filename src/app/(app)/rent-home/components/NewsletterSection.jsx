const NewsletterSection = ({ glassClasses, textPrimaryClasses, textSecondaryClasses, onSubmit }) => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`${glassClasses} rounded-3xl p-12 text-center`}>
          <div className="max-w-2xl mx-auto">
            <div className="text-5xl mb-6">📧</div>
            <h2
              className={`text-3xl md:text-4xl font-bold ${textPrimaryClasses} mb-6`}
            >
              Đăng Ký Nhận Tin
            </h2>
            <p className={`text-lg ${textSecondaryClasses} mb-8`}>
              Nhận thông báo về những căn nhà mới nhất và ưu đãi đặc biệt
            </p>

            <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                className={`flex-1 px-6 py-4 rounded-2xl ${glassClasses} ${textPrimaryClasses} placeholder-gray-500 border-0 focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
                placeholder="Nhập email của bạn"
              />
              <button
                onClick={onSubmit}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-105 transition-all duration-300 whitespace-nowrap"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;