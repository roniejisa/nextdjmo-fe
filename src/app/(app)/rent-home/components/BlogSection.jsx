import { Calendar, Clock } from "lucide-react";

const BlogSection = ({ glassClasses, textPrimaryClasses, textSecondaryClasses }) => {
  const blogPosts = [
    {
      id: 1,
      title: "10 Lời Khuyên Khi Thuê Nhà Lần Đầu",
      excerpt:
        "Những điều cần lưu ý để tránh rơi vào bẫy khi thuê nhà lần đầu tiên...",
      image: "📝",
      author: "Admin",
      date: "15/06/2025",
      readTime: "5 phút",
    },
    {
      id: 2,
      title: "Xu Hướng Giá Thuê Nhà 2025",
      excerpt: "Phân tích thị trường bất động sản cho thuê trong năm 2025...",
      image: "📊",
      author: "Chuyên gia BDS",
      date: "10/06/2025",
      readTime: "7 phút",
    },
    {
      id: 3,
      title: "Cách Trang Trí Căn Hộ Thuê",
      excerpt:
        "Biến căn hộ thuê thành không gian sống lý tưởng với ngân sách hạn chế...",
      image: "🎨",
      author: "Kiến trúc sư",
      date: "08/06/2025",
      readTime: "6 phút",
    },
  ];

  return (
    <section className="py-20" id="blog">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-bold ${textPrimaryClasses} mb-6`}
          >
            Blog & Tin Tức
          </h2>
          <p className={`text-xl ${textSecondaryClasses} max-w-2xl mx-auto`}>
            Cập nhật xu hướng thị trường và mẹo thuê nhà hữu ích
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className={`${glassClasses} rounded-3xl overflow-hidden hover:scale-105 transition-all duration-500 group hover:shadow-2xl cursor-pointer`}
            >
              <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                {post.image}
              </div>

              <div className="p-6">
                <h3
                  className={`text-xl font-bold ${textPrimaryClasses} mb-3 group-hover:text-indigo-500 transition-colors`}
                >
                  {post.title}
                </h3>

                <p className={`${textSecondaryClasses} mb-4 leading-relaxed`}>
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className={`${textSecondaryClasses}`}>
                      👤 {post.author}
                    </span>
                    <span
                      className={`${textSecondaryClasses} flex items-center gap-1`}
                    >
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                  </div>
                  <span
                    className={`${textSecondaryClasses} flex items-center gap-1`}
                  >
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-105 transition-all duration-300">
            Xem tất cả bài viết
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;