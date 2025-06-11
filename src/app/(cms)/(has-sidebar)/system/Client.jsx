"use client";
import { useEffect, useState } from "react";
import ItemCount from "@/components/ui/admin/statistics/ItemCount";
import OrderChart from "@/components/ui/admin/statistics/OrderChart";
import NewsChart from "@/components/ui/admin/statistics/NewsChart";
import ImageCustom from "@/components/Maintain/Image";
import HistoryTab from "./HistoryTab";
import { showImageUrl } from "@/utils/client";
import AnalyticsDashboard from "@/components/ui/admin/statistics/Dashboard";

// Configuration constants
const ORDER_STATISTICS = [
  {
    module: "orders",
    name: "Đơn hàng",
    icon: "ecommerce",
    class: "bg-gradient-to-br from-purple-50 to-purple-100",
    link: "orders",
  },
];

const GENERAL_STATISTICS = [
  {
    module: "customers",
    name: "Tài khoản",
    icon: "customer",
    class: "bg-gradient-to-br from-cyan-50 to-blue-100",
    link: "customers",
  },
  {
    module: "posts",
    name: "Thông tin",
    icon: "link",
    class: "bg-gradient-to-br from-rose-50 to-red-100",
    link: "posts",
  },
  {
    module: "topics",
    name: "Chủ đề",
    icon: "link",
    class: "bg-gradient-to-br from-emerald-50 to-green-100",
    link: "authors",
  },
  {
    module: "features",
    name: "Chuyên đề",
    icon: "link",
    class: "bg-gradient-to-br from-amber-50 to-yellow-100",
    link: "features",
  },
  {
    module: "internal-news",
    name: "Tin tức nội bộ",
    icon: "link",
    class: "bg-gradient-to-br from-indigo-50 to-purple-100",
    link: "internal-news",
  },
];

const TAB_CONFIG = [
  { id: "general", label: "Tổng quan", icon: "📊" },
  { id: "ecommerce", label: "Ecommerce", icon: "🛒" },
  { id: "reports", label: "Báo cáo", icon: "📈" },
  { id: "history", label: "Lịch sử", icon: "📋" },
];

// Custom Hook for tab management
const useTabNavigation = (initialTab = "general") => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const switchTab = (tabId) => {
    setActiveTab(tabId);
  };

  return { activeTab, switchTab };
};

// Tab Navigation Component
const TabNavigation = ({ activeTab, onTabChange, availableTabs }) => {
  return (
    <nav className="mb-8">
      <div className="flex flex-wrap gap-2 sm:gap-4 p-1 bg-gray-50 rounded-2xl shadow-inner">
        {availableTabs.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          />
        ))}
      </div>
    </nav>
  );
};

// Individual Tab Button Component
const TabButton = ({ tab, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm sm:text-base
        transition-all duration-300 ease-out transform hover:scale-105
        ${
          isActive
            ? "bg-white text-blue-600 shadow-lg shadow-blue-100 font-bold border-2 border-blue-200"
            : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
        }
      `}
    >
      <span className="text-lg">{tab.icon}</span>
      <span className="hidden sm:inline">{tab.label}</span>
      <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
    </button>
  );
};

// Statistics Grid Component
const StatisticsGrid = ({ statistics, className = "" }) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
    >
      {statistics.map((item, index) => (
        <div
          key={index}
          className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <ItemCount item={item} className="h-full" />
        </div>
      ))}
    </div>
  );
};

// Chart Statistics Overview Component
const ChartStatisticsOverview = ({ title, icon, bgColor, stats }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`w-10 h-10 bg-gradient-to-br ${bgColor} rounded-xl flex items-center justify-center`}
        >
          <span className="text-white text-lg">{icon}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
            >
              <div
                className={`text-2xl font-bold ${
                  stat.color || "text-gray-800"
                }`}
              >
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              {stat.change && (
                <div
                  className={`text-xs mt-1 flex items-center justify-center gap-1 ${
                    stat.change > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <span>{stat.change > 0 ? "↗" : "↘"}</span>
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Hot Products Section Component
const HotProductsSection = ({ hotProducts }) => {
  if (!hotProducts?.products?.length) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
          <span className="text-white text-lg">🔥</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800">Sản phẩm bán chạy</h3>
      </div>

      <div className="space-y-4">
        {hotProducts.products.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </div>
  );
};

// Individual Product Card Component
const ProductCard = ({ product }) => {
  return (
    <div className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
      <div className="relative w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-200">
        <ImageCustom
          src={showImageUrl(product.image)}
          fill={true}
          className="object-contain p-2"
          alt={product.name}
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors duration-200">
          {product.name}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">Đã bán:</span>
          <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
            {product.qty}
          </span>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Client Component
const Client = ({ hotProducts, profile }) => {
  const { activeTab, switchTab } = useTabNavigation("general");

  useEffect(() => {
    // Preserve original useEffect logic
  }, [hotProducts]);

  // Filter general statistics based on user permissions
  const filteredGeneralStats = GENERAL_STATISTICS.filter((item) => {
    return profile?.permissions?.some((permission) =>
      permission?.includes(`${item.module}.read`)
    );
  });

  // Check history permission
  const hasHistoryPermission = profile?.permissions?.some((permission) =>
    permission.includes("history.read")
  );

  // Determine available tabs
  const availableTabs = TAB_CONFIG.filter((tab) => {
    if (tab.id === "general") return filteredGeneralStats.length > 0;
    if (tab.id === "history") return hasHistoryPermission;
    if (tab.id === "reports") return true; // Reports always available
    return true; // ecommerce is always available
  });

  return (
    <div className="space-y-8 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
          Dashboard Quản Trị
        </h1>
        <p className="text-gray-600">Tổng quan hoạt động hệ thống</p>
      </div>

      {/* Tab Navigation */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={switchTab}
        availableTabs={availableTabs}
      />

      {/* History Tab Content */}
      {hasHistoryPermission && (
        <div
          className={`transition-all duration-500 ${
            activeTab === "history" ? "block" : "hidden"
          }`}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <HistoryTab />
          </div>
        </div>
      )}

      {/* General Tab Content */}
      <div
        className={`transition-all duration-500 space-y-8 ${
          activeTab === "general" ? "block" : "hidden"
        }`}
      >
        {filteredGeneralStats.length > 0 && (
          <StatisticsGrid statistics={filteredGeneralStats} className="mb-8" />
        )}
      </div>

      <div
        className={`transition-all duration-500 space-y-8 ${
          activeTab === "reports" ? "block" : "hidden"
        }`}
      >
        {/* News Chart */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">📈</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Biểu đồ tin tức</h3>
          </div>
          <AnalyticsDashboard />
          {/* <NewsChart /> */}
      </div>

      {/* Ecommerce Tab Content */}
      <div
        className={`transition-all duration-500 space-y-8 ${
          activeTab === "ecommerce" ? "block" : "hidden"
        }`}
      >
        <StatisticsGrid statistics={ORDER_STATISTICS} />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Order Chart - Takes up 3/4 of the width on xl screens */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">📊</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Biểu đồ đơn hàng
                </h3>
              </div>
              <OrderChart />
            </div>
          </div>

          {/* Hot Products - Takes up 1/4 of the width on xl screens */}
          <div className="xl:col-span-1">
            <HotProductsSection hotProducts={hotProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Client;
