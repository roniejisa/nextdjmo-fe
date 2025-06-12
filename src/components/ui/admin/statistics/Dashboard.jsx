import { httpClient } from "@/utils/client/http";
import React, { useState, useEffect } from "react";
import {
  Pie,
  PieChart,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-2xl">
        <p className="text-white font-medium mb-2">{`Ngày: ${label}`}</p>
        {payload.map((entry, index) => {
          return (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === "total_views" &&
                `Tổng lượt xem: ${entry.payload?.[entry.dataKey]}`}
              {entry.dataKey === "avg_engagement" &&
                `Tương tác TB: ${entry.payload?.[entry.dataKey].toFixed(2)}%`}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

const AnalyticsDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [alerts, setAlerts] = useState([]);

  // Lấy dữ liệu dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [summaryResponse, overviewResponse, comparisonResponse] =
        await Promise.all([
          httpClient(
            process.env.NEXT_PUBLIC_ENDPOINT_URL +
              "api/analytics/dashboard-summary/"
          ),
          httpClient(
            process.env.NEXT_PUBLIC_ENDPOINT_URL +
              `api/analytics/system-overview/?period=${selectedPeriod}&include_trends=true`
          ),
          httpClient(
            process.env.NEXT_PUBLIC_ENDPOINT_URL +
              `api/analytics/module-comparison/?period=${selectedPeriod}`
          ),
        ]);

      const [summary, overview, comparison] = await Promise.all([
        summaryResponse.data,
        overviewResponse.data,
        comparisonResponse.data,
      ]);
      setDashboardData({
        summary: summary.summary,
        overview: overview.overview,
        trends: overview.trends,
        comparison: comparison.comparison,
        topModules: summary.top_modules_today,
        hourlyActivity: summary.hourly_activity,
      });
      // Kiểm tra cảnh báo
      const alertsData = [];
      if (summary.summary.changes.views_change_percent < -20) {
        alertsData.push({
          type: "warning",
          message: `Lượt xem giảm ${Math.abs(
            summary.summary.changes.views_change_percent
          )}% so với hôm qua`,
        });
      }
      if (summary.summary.changes.views_change_percent > 50) {
        alertsData.push({
          type: "success",
          message: `Lượt xem tăng ${summary.summary.changes.views_change_percent}% so với hôm qua!`,
        });
      }
      setAlerts(alertsData);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Tự động làm mới mỗi 5 phút
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-400 border-t-transparent"></div>
          <div className="absolute inset-0 animate-pulse rounded-full bg-purple-500/20"></div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
          <p className="text-white/80 text-lg">
            ⚠️ Không thể tải dữ liệu dashboard
          </p>
        </div>
      </div>
    );
  }

  const { summary, overview, trends, comparison, topModules, hourlyActivity } =
    dashboardData;

  const currentStats =
    selectedPeriod === "today" ? summary.today : overview.system_totals;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-500/5 rounded-full blur-3xl animate-ping"></div>
      </div>

      <div className="relative z-10">
        {/* Header with Improved Responsive Layout */}
        <div className="mb-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                📊 Bảng điều khiển Phân tích
              </h1>
              <p className="text-white/60 mt-2">
                Theo dõi hiệu suất trong thời gian thực
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-w-0">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:bg-white/20 text-sm lg:text-base min-w-0"
              >
                <option value="today" className="bg-slate-800">
                  Hôm nay
                </option>
                <option value="yesterday" className="bg-slate-800">
                  Hôm qua
                </option>
                <option value="7days" className="bg-slate-800">
                  7 ngày qua
                </option>
                <option value="30days" className="bg-slate-800">
                  30 ngày qua
                </option>
                <option value="thisweek" className="bg-slate-800">
                  Tuần này
                </option>
                <option value="thismonth" className="bg-slate-800">
                  Tháng này
                </option>
              </select>
              <button
                onClick={fetchDashboardData}
                className="px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-white/20 text-sm lg:text-base whitespace-nowrap"
              >
                🔄 Làm mới
              </button>
            </div>
          </div>
        </div>

        {/* Alerts with Animation */}
        {alerts.length > 0 && (
          <div className="mb-8 space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border backdrop-blur-md transform transition-all duration-500 hover:scale-[1.02] ${
                  alert.type === "success"
                    ? "bg-green-500/20 border-green-400/50 text-green-200"
                    : "bg-yellow-500/20 border-yellow-400/50 text-yellow-200"
                } animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {alert.type === "success" ? "🎉" : "⚠️"}
                  </span>
                  {alert.message}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* KPI Cards with Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:border-purple-400/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium">
                  Tổng lượt xem
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {currentStats.total_views.toLocaleString()}
                </p>
                {selectedPeriod === "today" &&
                  summary.changes.views_change_percent !== 0 && (
                    <div className="flex items-center mt-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                          summary.changes.views_change_percent > 0
                            ? "bg-green-500/20 text-green-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {summary.changes.views_change_percent > 0 ? "↗️" : "↘️"}
                        {Math.abs(summary.changes.views_change_percent)}%
                      </span>
                    </div>
                  )}
              </div>
              <div className="text-4xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                👁️
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:border-blue-400/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium">
                  Người truy cập duy nhất
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {currentStats.unique_visitors.toLocaleString()}
                </p>
              </div>
              <div className="text-4xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                👥
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:border-green-400/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium">
                  Mức độ tương tác TB
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {currentStats.avg_engagement_score}/100
                </p>
                {selectedPeriod === "today" &&
                  summary.changes.engagement_change_percent !== 0 && (
                    <div className="flex items-center mt-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                          summary.changes.engagement_change_percent > 0
                            ? "bg-green-500/20 text-green-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {summary.changes.engagement_change_percent > 0
                          ? "↗️"
                          : "↘️"}
                        {Math.abs(summary.changes.engagement_change_percent)}%
                      </span>
                    </div>
                  )}
              </div>
              <div className="text-4xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                📊
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:border-pink-400/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium">
                  Tỷ lệ đọc sâu
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {currentStats.deep_read_rate}%
                </p>
              </div>
              <div className="text-4xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                📚
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row with Modern Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Trends Chart */}
          {trends && trends.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:border-purple-400/50 transition-all duration-300 shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <span className="text-2xl">📈</span>
                Xu Hướng Lượt Xem & Tương Tác
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trends}>
                  <defs>
                    <linearGradient
                      id="viewsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#8B5CF6"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="engagementGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#10B981"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.6)"
                    tick={{ fill: "rgba(255,255,255,0.8)" }}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="rgba(255,255,255,0.6)"
                    tick={{ fill: "rgba(255,255,255,0.8)" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="rgba(255,255,255,0.6)"
                    tick={{ fill: "rgba(255,255,255,0.8)" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="total_views"
                    stroke="#8B5CF6"
                    fillOpacity={1}
                    fill="url(#viewsGradient)"
                    strokeWidth={3}
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="avg_engagement"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#engagementGradient)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">Lượt xem</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">Tương tác (%)</span>
                </div>
              </div>
            </div>
          )}

          {/* Hourly Activity */}
          {hourlyActivity && hourlyActivity.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:border-blue-400/50 transition-all duration-300 shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <span className="text-2xl">⏰</span>
                Hoạt động theo giờ ({hourlyActivity.length} điểm dữ liệu)
              </h3>

              {/* Debug info - có thể xóa sau khi fix */}
              <div className="mb-4 p-2 bg-white/5 rounded text-xs text-white/60">
                <p>Tổng số giờ: {hourlyActivity.length}</p>
                <p>
                  Giờ có dữ liệu:{" "}
                  {hourlyActivity
                    .filter((h) => h.views > 0)
                    .map((h) => h.hour)
                    .join(", ")}
                </p>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={hourlyActivity}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9} />
                      <stop
                        offset="95%"
                        stopColor="#1D4ED8"
                        stopOpacity={0.6}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="hour"
                    stroke="rgba(255,255,255,0.6)"
                    interval={0} // Hiển thị tất cả labels
                    angle={-45} // Xoay labels để tránh chồng lên nhau
                    textAnchor="end"
                    fontSize={12}
                    height={60} // Tăng chiều cao để chứa labels xoay
                  />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "12px",
                      color: "white",
                    }}
                    formatter={(value, name) => [
                      value,
                      name === "views" ? "Lượt xem" : name,
                    ]}
                    labelFormatter={(hour) => `Giờ ${hour}:00`}
                  />
                  <Bar
                    dataKey="views"
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                    name="views"
                  />
                </BarChart>
              </ResponsiveContainer>

              {/* Alternative: Table view for debugging */}
              <details className="mt-4">
                <summary className="text-white/60 cursor-pointer hover:text-white/80 text-sm">
                  📋 Xem dữ liệu chi tiết
                </summary>
                <div className="mt-2 max-h-40 overflow-y-auto">
                  <div className="grid grid-cols-6 gap-2 text-xs">
                    {hourlyActivity.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white/5 p-2 rounded text-center"
                      >
                        <div className="text-white/80">{item.hour}h</div>
                        <div className="text-white font-bold">{item.views}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            </div>
          )}
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Module Comparison */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:border-green-400/50 transition-all duration-300 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="text-2xl">🔧</span>
              So sánh Loại Module
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 text-white/80 font-medium">
                      Loại Module
                    </th>
                    <th className="text-right py-3 text-white/80 font-medium">
                      Lượt xem
                    </th>
                    <th className="text-right py-3 text-white/80 font-medium">
                      Tương tác
                    </th>
                    <th className="text-right py-3 text-white/80 font-medium">
                      Đọc sâu
                    </th>
                    <th className="text-right py-3 text-white/80 font-medium">
                      Chia sẻ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.slice(0, 10).map((module, index) => (
                    <tr
                      key={index}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="py-3 font-medium text-white">
                        {module.module_type}
                      </td>
                      <td className="text-right py-3 text-white/80">
                        {module.views.toLocaleString()}
                      </td>
                      <td className="text-right py-3 text-white/80">
                        {module.avg_engagement_score}
                      </td>
                      <td className="text-right py-3 text-white/80">
                        {module.deep_read_rate}%
                      </td>
                      <td className="text-right py-3 text-white/80">
                        {module.view_share}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Performing Modules */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:border-yellow-400/50 transition-all duration-300 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              Module hàng đầu hôm nay
            </h3>
            <div className="space-y-4">
              {topModules && topModules.length > 0 ? (
                topModules.slice(0, 5).map((module, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">
                          {module.module_type || "N/A"}
                        </p>
                        <p className="text-xs text-white/60">
                          ID: {module.module_id || module.id || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">
                        {module.avg_engagement ||
                          module.engagement_score ||
                          "0"}
                      </p>
                      <p className="text-xs text-white/60">tương tác</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4 opacity-50">📊</div>
                  <p className="text-white/60">Chưa có dữ liệu module</p>
                  <p className="text-white/40 text-sm mt-2">
                    Dữ liệu sẽ xuất hiện khi có hoạt động
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AnalyticsDashboard;
