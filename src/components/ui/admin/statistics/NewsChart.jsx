import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Download,
  Filter,
  Users,
  FileText,
  Eye,
  TrendingUp,
  Globe,
  Award,
  X,
  Search,
  ChevronDown,
  Plus,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Custom number formatting function to ensure consistency
const formatNumber = (num) => {
  if (typeof num !== "number") return num;
  return new Intl.NumberFormat("vi-VN").format(num);
};

// Mock data - Enhanced with more detailed information
const mockData = {
  overview: {
    totalPosts: 1247,
    activePosts: 1089,
    inactivePosts: 158,
    totalViews: 89432,
    totalAuthors: 23,
    totalCategories: 8,
    avgViewsPerPost: 72,
    publishedThisMonth: 89,
  },
  trendsData: [
    { date: "2024-01", posts: 45, views: 2340, published: 42, month: "T1" },
    { date: "2024-02", posts: 52, views: 2890, published: 48, month: "T2" },
    { date: "2024-03", posts: 38, views: 2156, published: 35, month: "T3" },
    { date: "2024-04", posts: 67, views: 3421, published: 63, month: "T4" },
    { date: "2024-05", posts: 71, views: 3876, published: 68, month: "T5" },
    { date: "2024-06", posts: 59, views: 3234, published: 54, month: "T6" },
  ],
  topAuthors: [
    { name: "Nguyễn Văn A", posts: 45, views: 12340, status: "active" },
    { name: "Trần Thị B", posts: 38, views: 9876, status: "active" },
    { name: "Lê Văn C", posts: 32, views: 8765, status: "active" },
    { name: "Phạm Thị D", posts: 28, views: 7654, status: "inactive" },
    { name: "Hoàng Văn E", posts: 24, views: 6543, status: "active" },
  ],
  topCategories: [
    { name: "Công nghệ", posts: 234, color: "#3B82F6", status: "active" },
    { name: "Kinh doanh", posts: 198, color: "#10B981", status: "active" },
    { name: "Giáo dục", posts: 167, color: "#F59E0B", status: "active" },
    { name: "Sức khỏe", posts: 143, color: "#EF4444", status: "active" },
    { name: "Du lịch", posts: 128, color: "#8B5CF6", status: "inactive" },
    { name: "Ẩm thực", posts: 112, color: "#EC4899", status: "active" },
  ],
  languageDistribution: [
    { name: "Tiếng Việt", value: 756, color: "#3B82F6" },
    { name: "Tiếng Anh", value: 312, color: "#10B981" },
    { name: "Tiếng Trung", value: 89, color: "#F59E0B" },
    { name: "Tiếng Nhật", value: 67, color: "#EF4444" },
    { name: "Khác", value: 23, color: "#8B5CF6" },
  ],
  topPosts: [
    {
      title: "Hướng dẫn Next.js 14 từ cơ bản đến nâng cao",
      views: 2340,
      author: "Nguyễn Văn A",
      category: "Công nghệ",
      status: "published",
      date: "2024-06-01",
    },
    {
      title: "Chiến lược Marketing Digital 2024",
      views: 1876,
      author: "Trần Thị B",
      category: "Kinh doanh",
      status: "published",
      date: "2024-05-28",
    },
    {
      title: "10 mẹo học tiếng Anh hiệu quả",
      views: 1654,
      author: "Lê Văn C",
      category: "Giáo dục",
      status: "published",
      date: "2024-05-25",
    },
    {
      title: "Bí quyết sống khỏe mạnh sau tuổi 30",
      views: 1432,
      author: "Phạm Thị D",
      category: "Sức khỏe",
      status: "draft",
      date: "2024-05-20",
    },
    {
      title: "Du lịch Hà Nội với 1 triệu đồng",
      views: 1298,
      author: "Hoàng Văn E",
      category: "Du lịch",
      status: "published",
      date: "2024-05-15",
    },
  ],
};

const quickFilters = [
  { label: "Hôm qua", value: "1d" },
  { label: "7 ngày qua", value: "7d" },
  { label: "30 ngày qua", value: "30d" },
  { label: "90 ngày qua", value: "90d" },
  { label: "6 tháng qua", value: "6m" },
  { label: "1 năm qua", value: "1y" },
];

// Advanced Filter Options
const filterOptions = {
  authors: [
    "Tất cả",
    "Nguyễn Văn A",
    "Trần Thị B",
    "Lê Văn C",
    "Phạm Thị D",
    "Hoàng Văn E",
  ],
  categories: [
    "Tất cả",
    "Công nghệ",
    "Kinh doanh",
    "Giáo dục",
    "Sức khỏe",
    "Du lịch",
    "Ẩm thực",
  ],
  languages: ["Tất cả", "Tiếng Việt", "Tiếng Anh", "Tiếng Trung", "Tiếng Nhật"],
  status: ["Tất cả", "Đã xuất bản", "Bản nháp", "Đã lưu trữ"],
  viewRanges: [
    "Tất cả",
    "< 100 lượt xem",
    "100-500 lượt xem",
    "500-1000 lượt xem",
    "> 1000 lượt xem",
  ],
};

// Custom Tooltip Components
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {formatNumber(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{data.name}</p>
        <p style={{ color: data.color }} className="text-sm">
          Số bài: {formatNumber(data.value)} (
          {((data.value / 1247) * 100).toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
};

// Components
const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "blue",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
    red: "bg-red-50 border-red-200 text-red-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {mounted ? formatNumber(value) : value}
          </p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-sm text-green-600 font-medium">{trend}</span>
        </div>
      )}
    </div>
  );
};

const ChartContainer = ({ title, children, exportable = true }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {exportable && (
        <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
          <Download className="w-4 h-4 mr-1" />
          Export
        </button>
      )}
    </div>
    {children}
  </div>
);

const CustomDateRangePicker = ({
  startDate,
  endDate,
  onDateChange,
  onApply,
  onCancel,
}) => {
  return (
    <div className="absolute top-12 left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-80">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Từ ngày
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onDateChange("start", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Đến ngày
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onDateChange("end", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          onClick={onApply}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Áp dụng
        </button>
      </div>
    </div>
  );
};

const AdvancedFilters = ({ filters, onFilterChange, onClearAll }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v && v !== "Tất cả"
  ).length;

  const DropdownFilter = ({ label, options, value, onChange, filterKey }) => (
    <div className="relative">
      <button
        onClick={() =>
          setOpenDropdown(openDropdown === filterKey ? null : filterKey)
        }
        className="flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 bg-white"
      >
        <span className="truncate">{value || "Tất cả"}</span>
        <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
      </button>
      {openDropdown === filterKey && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setOpenDropdown(null);
              }}
              className="block w-full px-3 py-2 text-sm text-left hover:bg-gray-50 focus:bg-gray-50"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 bg-white"
      >
        <Filter className="w-4 h-4 mr-2" />
        Bộ lọc nâng cao
        {activeFiltersCount > 0 && (
          <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
            {activeFiltersCount}
          </span>
        )}
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 z-40 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-96">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Bộ lọc nâng cao</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tác giả
              </label>
              <DropdownFilter
                label="Tác giả"
                options={filterOptions.authors}
                value={filters.author}
                onChange={(value) => onFilterChange("author", value)}
                filterKey="author"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục
              </label>
              <DropdownFilter
                label="Danh mục"
                options={filterOptions.categories}
                value={filters.category}
                onChange={(value) => onFilterChange("category", value)}
                filterKey="category"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngôn ngữ
              </label>
              <DropdownFilter
                label="Ngôn ngữ"
                options={filterOptions.languages}
                value={filters.language}
                onChange={(value) => onFilterChange("language", value)}
                filterKey="language"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <DropdownFilter
                label="Trạng thái"
                options={filterOptions.status}
                value={filters.status}
                onChange={(value) => onFilterChange("status", value)}
                filterKey="status"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Khoảng lượt xem
              </label>
              <DropdownFilter
                label="Khoảng lượt xem"
                options={filterOptions.viewRanges}
                value={filters.viewRange}
                onChange={(value) => onFilterChange("viewRange", value)}
                filterKey="viewRange"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClearAll}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Xóa tất cả
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const QuickFilters = ({ activeFilter, onFilterChange }) => (
  <div className="flex flex-wrap gap-2">
    {quickFilters.map((filter) => (
      <button
        key={filter.value}
        onClick={() => onFilterChange(filter.value)}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          activeFilter === filter.value
            ? "bg-blue-100 text-blue-700 border border-blue-300"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        {filter.label}
      </button>
    ))}
  </div>
);

const ExportButton = ({ onExport, type }) => (
  <button
    onClick={() => onExport(type)}
    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  >
    <Download className="w-4 h-4 mr-2" />
    Export {type.toUpperCase()}
  </button>
);

const TopPostsTable = ({ posts, filters }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (
        filters.author &&
        filters.author !== "Tất cả" &&
        post.author !== filters.author
      )
        return false;
      if (
        filters.category &&
        filters.category !== "Tất cả" &&
        post.category !== filters.category
      )
        return false;
      if (filters.status && filters.status !== "Tất cả") {
        const statusMap = {
          "Đã xuất bản": "published",
          "Bản nháp": "draft",
          "Đã lưu trữ": "archived",
        };
        if (post.status !== statusMap[filters.status]) return false;
      }
      if (filters.viewRange && filters.viewRange !== "Tất cả") {
        const views = post.views;
        switch (filters.viewRange) {
          case "< 100 lượt xem":
            return views < 100;
          case "100-500 lượt xem":
            return views >= 100 && views <= 500;
          case "500-1000 lượt xem":
            return views >= 500 && views <= 1000;
          case "> 1000 lượt xem":
            return views > 1000;
          default:
            return true;
        }
      }
      return true;
    });
  }, [posts, filters]);

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 text-sm text-gray-600">
        Hiển thị {filteredPosts.length} / {posts.length} bài viết
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tiêu đề
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lượt xem
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tác giả
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Danh mục
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày tạo
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredPosts.map((post, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                {post.title}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {mounted ? formatNumber(post.views) : post.views}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{post.author}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {post.category}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    post.status === "published"
                      ? "bg-green-100 text-green-800"
                      : post.status === "draft"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {post.status === "published"
                    ? "Đã xuất bản"
                    : post.status === "draft"
                    ? "Bản nháp"
                    : "Đã lưu trữ"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(post.date).toLocaleDateString("vi-VN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main Dashboard Component
const NewsChart = () => {
  const [activeFilter, setActiveFilter] = useState("30d");
  const [customDateRange, setCustomDateRange] = useState({
    start: "",
    end: "",
  });
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    author: "",
    category: "",
    language: "",
    status: "",
    viewRange: "",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExport = (type) => {
    if (type === "pdf") {
      alert("Đang xuất PDF... (Chức năng mô phỏng)");
    } else if (type === "excel") {
      alert("Đang xuất Excel... (Chức năng mô phỏng)");
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setShowCustomDate(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleCustomDateApply = () => {
    setActiveFilter("custom");
    setShowCustomDate(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleAdvancedFilterChange = (key, value) => {
    setAdvancedFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAdvancedFilters = () => {
    setAdvancedFilters({
      author: "",
      category: "",
      language: "",
      status: "",
      viewRange: "",
    });
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto px-4">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Báo cáo thống kê bài viết
            </h1>
            <p className="text-gray-600 mt-1">
              Tổng quan và phân tích chi tiết hoạt động nội dung
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 py-8">
        {/* Enhanced Filters */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-700">Thời gian:</span>
                <QuickFilters
                  activeFilter={activeFilter}
                  onFilterChange={handleFilterChange}
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowCustomDate(!showCustomDate)}
                    className={`flex items-center px-3 py-1 text-sm rounded-full transition-colors ${
                      activeFilter === "custom"
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Tùy chỉnh
                  </button>
                  {showCustomDate && (
                    <CustomDateRangePicker
                      startDate={customDateRange.start}
                      endDate={customDateRange.end}
                      onDateChange={(type, value) =>
                        setCustomDateRange((prev) => ({
                          ...prev,
                          [type]: value,
                        }))
                      }
                      onApply={handleCustomDateApply}
                      onCancel={() => setShowCustomDate(false)}
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <AdvancedFilters
                  filters={advancedFilters}
                  onFilterChange={handleAdvancedFilterChange}
                  onClearAll={clearAdvancedFilters}
                />
                <div className="flex gap-2">
                  <ExportButton onExport={handleExport} type="pdf" />
                  <ExportButton onExport={handleExport} type="excel" />
                </div>
              </div>
            </div>
          </div>
          {/* Active Filters Display */}
          {Object.values(advancedFilters).some((v) => v && v !== "Tất cả") && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">
                Bộ lọc đang áp dụng:
              </span>
              {Object.entries(advancedFilters).map(([key, value]) => {
                if (!value || value === "Tất cả") return null;
                const labels = {
                  author: "Tác giả",
                  category: "Danh mục",
                  language: "Ngôn ngữ",
                  status: "Trạng thái",
                  viewRange: "Lượt xem",
                };
                return (
                  <span
                    key={key}
                    className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    {labels[key]}: {value}
                    <button
                      onClick={() => handleAdvancedFilterChange(key, "")}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Tổng số bài viết"
                value={mockData.overview.totalPosts}
                subtitle="Tất cả bài viết"
                icon={FileText}
                trend="+12% so với tháng trước"
                color="blue"
              />
              <StatCard
                title="Tổng lượt xem"
                value={mockData.overview.totalViews}
                subtitle="Tất cả bài viết"
                icon={Eye}
                trend="+8% so với tháng trước"
                color="green"
              />
              <StatCard
                title="Tác giả hoạt động"
                value={mockData.overview.totalAuthors}
                subtitle="Đang hoạt động"
                icon={Users}
                trend="+3 tác giả mới"
                color="purple"
              />
              <StatCard
                title="Bài viết tháng này"
                value={mockData.overview.publishedThisMonth}
                subtitle="Đã xuất bản"
                icon={TrendingUp}
                trend="+15% so với tháng trước"
                color="yellow"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
              {/* Trends Chart */}
              <ChartContainer title="Xu hướng bài viết theo thời gian">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockData.trendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="posts"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      name="Số bài viết"
                    />
                    <Line
                      type="monotone"
                      dataKey="published"
                      stroke="#10B981"
                      strokeWidth={2}
                      name="Đã xuất bản"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>

              {/* Views Chart */}
              <ChartContainer title="Lượt xem theo thời gian">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockData.trendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.3}
                      name="Lượt xem"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {/* Secondary Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              {/* Top Authors */}
              <ChartContainer title="Top tác giả">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockData.topAuthors}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="posts" fill="#3B82F6" name="Số bài viết" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              {/* Categories Distribution */}
              <ChartContainer title="Phân bố danh mục">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockData.topCategories}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="posts"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {mockData.topCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>

              {/* Language Distribution */}
              <ChartContainer title="Phân bố ngôn ngữ">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockData.languageDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {mockData.languageDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {/* Top Posts Table */}
            <ChartContainer title="Bài viết nổi bật" exportable={false}>
              <TopPostsTable
                posts={mockData.topPosts}
                filters={advancedFilters}
              />
            </ChartContainer>
          </>
        )}
      </div>
    </div>
  );
};
export default NewsChart;