"use client"
import React, { useState } from "react";
import {
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Smartphone,
  Monitor,
  Clock,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Volume2,
  VolumeX,
  Moon,
  Sun,
} from "lucide-react";

const NotificationTabContent = () => {
  // Mock data cho các loại thông báo
  const [notificationSettings, setNotificationSettings] = useState({
    // Thông báo email
    email: {
      enabled: true,
      orderUpdates: true,
      promotions: false,
      systemAlerts: true,
      weeklyReport: true,
      frequency: "immediate", // immediate, daily, weekly
      quietHours: {
        enabled: true,
        start: "22:00",
        end: "08:00",
      },
    },
    // Thông báo push
    push: {
      enabled: true,
      orderUpdates: true,
      chatMessages: true,
      systemAlerts: true,
      promotions: false,
      sound: true,
      vibration: true,
      badge: true,
    },
    // Thông báo SMS
    sms: {
      enabled: false,
      orderUpdates: false,
      securityAlerts: true,
      urgentOnly: true,
      phoneNumber: "+84987654321",
    },
    // Thông báo in-app
    inApp: {
      enabled: true,
      orderUpdates: true,
      chatMessages: true,
      systemAlerts: true,
      promotions: true,
      position: "top-right", // top-right, top-left, bottom-right, bottom-left
      autoHide: true,
      hideDelay: 5000,
    },
  });

  // Mock data cho template thông báo
  const [notificationTemplates, setNotificationTemplates] = useState([
    {
      id: 1,
      name: "Đơn hàng mới",
      type: "order_new",
      title: "Đơn hàng mới #{orderId}",
      content:
        "Bạn có đơn hàng mới từ {customerName}. Tổng giá trị: {totalAmount}",
      channels: ["email", "push", "inApp"],
      priority: "high",
      active: true,
      variables: ["orderId", "customerName", "totalAmount", "orderDate"],
    },
    {
      id: 2,
      name: "Thanh toán thành công",
      type: "payment_success",
      title: "Thanh toán thành công",
      content: "Thanh toán đơn hàng #{orderId} đã được xử lý thành công",
      channels: ["email", "sms", "inApp"],
      priority: "medium",
      active: true,
      variables: ["orderId", "amount", "paymentMethod"],
    },
    {
      id: 3,
      name: "Cảnh báo bảo mật",
      type: "security_alert",
      title: "Cảnh báo bảo mật",
      content: "Phát hiện đăng nhập từ thiết bị mới tại {location}",
      channels: ["email", "sms", "push"],
      priority: "urgent",
      active: true,
      variables: ["location", "device", "ipAddress", "time"],
    },
  ]);

  // Mock data cho lịch sử thông báo
  const [notificationHistory, setNotificationHistory] = useState([
    {
      id: 1,
      type: "order_new",
      title: "Đơn hàng mới #12345",
      content: "Bạn có đơn hàng mới từ Nguyễn Văn A",
      channel: "email",
      status: "delivered",
      sentAt: "2024-06-12T10:30:00Z",
      deliveredAt: "2024-06-12T10:30:15Z",
      recipient: "admin@example.com",
    },
    {
      id: 2,
      type: "payment_success",
      title: "Thanh toán thành công",
      content: "Thanh toán đơn hàng #12345 đã được xử lý",
      channel: "push",
      status: "delivered",
      sentAt: "2024-06-12T10:25:00Z",
      deliveredAt: "2024-06-12T10:25:02Z",
      recipient: "device_token_123",
    },
    {
      id: 3,
      type: "security_alert",
      title: "Cảnh báo bảo mật",
      content: "Đăng nhập từ thiết bị mới",
      channel: "sms",
      status: "failed",
      sentAt: "2024-06-12T09:15:00Z",
      error: "Invalid phone number",
      recipient: "+84987654321",
    },
  ]);

  const [activeTab, setActiveTab] = useState("settings");

  const handleSettingChange = (category, setting, value) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleNestedSettingChange = (
    category,
    nestedCategory,
    setting,
    value
  ) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [nestedCategory]: {
          ...prev[category][nestedCategory],
          [setting]: value,
        },
      },
    }));
  };

  const ToggleSwitch = ({ enabled, onChange, size = "md" }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        size === "sm" ? "h-5 w-9" : "h-6 w-11"
      } ${enabled ? "bg-blue-600" : "bg-gray-200"}`}
    >
      <span
        className={`inline-block rounded-full bg-white shadow transform transition-transform ${
          size === "sm" ? "h-4 w-4" : "h-5 w-5"
        } ${
          enabled
            ? size === "sm"
              ? "translate-x-4"
              : "translate-x-5"
            : "translate-x-0.5"
        }`}
      />
    </button>
  );

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      failed: { color: "bg-red-100 text-red-800", icon: XCircle },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {status === "delivered"
          ? "Đã gửi"
          : status === "failed"
          ? "Thất bại"
          : "Đang gửi"}
      </span>
    );
  };

  const PriorityBadge = ({ priority }) => {
    const priorityConfig = {
      urgent: { color: "bg-red-100 text-red-800", text: "Khẩn cấp" },
      high: { color: "bg-orange-100 text-orange-800", text: "Cao" },
      medium: { color: "bg-yellow-100 text-yellow-800", text: "Trung bình" },
      low: { color: "bg-gray-100 text-gray-800", text: "Thấp" },
    };

    const config = priorityConfig[priority] || priorityConfig.medium;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getChannelIcon = (channel) => {
    const channelConfig = {
      email: { icon: Mail, color: "text-blue-600" },
      push: { icon: Smartphone, color: "text-green-600" },
      sms: { icon: Phone, color: "text-yellow-600" },
      inApp: { icon: Monitor, color: "text-purple-600" },
    };

    const config = channelConfig[channel] || channelConfig.email;
    const Icon = config.icon;

    return <Icon className={`w-4 h-4 ${config.color}`} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Cấu hình thông báo
        </h1>
        <p className="text-gray-600">
          Quản lý và thiết lập các tùy chọn thông báo chi tiết cho hệ thống
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "settings", name: "Cài đặt", icon: Settings },
            { id: "templates", name: "Mẫu thông báo", icon: MessageSquare },
            { id: "history", name: "Lịch sử", icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-8">
          {/* Email Notifications */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Thông báo Email
                </h3>
                <p className="text-sm text-gray-500">
                  Cấu hình thông báo qua email
                </p>
              </div>
              <div className="ml-auto">
                <ToggleSwitch
                  enabled={notificationSettings.email.enabled}
                  onChange={(value) =>
                    handleSettingChange("email", "enabled", value)
                  }
                />
              </div>
            </div>

            {notificationSettings.email.enabled && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Cập nhật đơn hàng
                    </span>
                    <ToggleSwitch
                      size="sm"
                      enabled={notificationSettings.email.orderUpdates}
                      onChange={(value) =>
                        handleSettingChange("email", "orderUpdates", value)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Khuyến mãi
                    </span>
                    <ToggleSwitch
                      size="sm"
                      enabled={notificationSettings.email.promotions}
                      onChange={(value) =>
                        handleSettingChange("email", "promotions", value)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Cảnh báo hệ thống
                    </span>
                    <ToggleSwitch
                      size="sm"
                      enabled={notificationSettings.email.systemAlerts}
                      onChange={(value) =>
                        handleSettingChange("email", "systemAlerts", value)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Báo cáo hàng tuần
                    </span>
                    <ToggleSwitch
                      size="sm"
                      enabled={notificationSettings.email.weeklyReport}
                      onChange={(value) =>
                        handleSettingChange("email", "weeklyReport", value)
                      }
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 mb-4">
                    <Moon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Giờ im lặng
                    </span>
                    <ToggleSwitch
                      size="sm"
                      enabled={notificationSettings.email.quietHours.enabled}
                      onChange={(value) =>
                        handleNestedSettingChange(
                          "email",
                          "quietHours",
                          "enabled",
                          value
                        )
                      }
                    />
                  </div>
                  {notificationSettings.email.quietHours.enabled && (
                    <div className="flex items-center space-x-4 ml-8">
                      <div className="flex items-center space-x-2">
                        <label className="text-xs text-gray-500">Từ:</label>
                        <input
                          type="time"
                          value={notificationSettings.email.quietHours.start}
                          onChange={(e) =>
                            handleNestedSettingChange(
                              "email",
                              "quietHours",
                              "start",
                              e.target.value
                            )
                          }
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-xs text-gray-500">Đến:</label>
                        <input
                          type="time"
                          value={notificationSettings.email.quietHours.end}
                          onChange={(e) =>
                            handleNestedSettingChange(
                              "email",
                              "quietHours",
                              "end",
                              e.target.value
                            )
                          }
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Push Notifications */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Smartphone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Thông báo Push
                </h3>
                <p className="text-sm text-gray-500">
                  Thông báo trên thiết bị di động và desktop
                </p>
              </div>
              <div className="ml-auto">
                <ToggleSwitch
                  enabled={notificationSettings.push.enabled}
                  onChange={(value) =>
                    handleSettingChange("push", "enabled", value)
                  }
                />
              </div>
            </div>

            {notificationSettings.push.enabled && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Cập nhật đơn hàng
                    </span>
                    <ToggleSwitch
                      size="sm"
                      enabled={notificationSettings.push.orderUpdates}
                      onChange={(value) =>
                        handleSettingChange("push", "orderUpdates", value)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Tin nhắn chat
                    </span>
                    <ToggleSwitch
                      size="sm"
                      enabled={notificationSettings.push.chatMessages}
                      onChange={(value) =>
                        handleSettingChange("push", "chatMessages", value)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Cảnh báo hệ thống
                    </span>
                    <ToggleSwitch
                      size="sm"
                      enabled={notificationSettings.push.systemAlerts}
                      onChange={(value) =>
                        handleSettingChange("push", "systemAlerts", value)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Khuyến mãi
                    </span>
                    <ToggleSwitch
                      size="sm"
                      enabled={notificationSettings.push.promotions}
                      onChange={(value) =>
                        handleSettingChange("push", "promotions", value)
                      }
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Tùy chọn nâng cao
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Volume2 className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          Âm thanh
                        </span>
                      </div>
                      <ToggleSwitch
                        size="sm"
                        enabled={notificationSettings.push.sound}
                        onChange={(value) =>
                          handleSettingChange("push", "sound", value)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          Rung
                        </span>
                      </div>
                      <ToggleSwitch
                        size="sm"
                        enabled={notificationSettings.push.vibration}
                        onChange={(value) =>
                          handleSettingChange("push", "vibration", value)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          Badge
                        </span>
                      </div>
                      <ToggleSwitch
                        size="sm"
                        enabled={notificationSettings.push.badge}
                        onChange={(value) =>
                          handleSettingChange("push", "badge", value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SMS Notifications */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Phone className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Thông báo SMS
                </h3>
                <p className="text-sm text-gray-500">
                  Thông báo quan trọng qua tin nhắn
                </p>
              </div>
              <div className="ml-auto">
                <ToggleSwitch
                  enabled={notificationSettings.sms.enabled}
                  onChange={(value) =>
                    handleSettingChange("sms", "enabled", value)
                  }
                />
              </div>
            </div>

            {notificationSettings.sms.enabled && (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">
                        Lưu ý quan trọng
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        SMS có thể phát sinh chi phí. Chỉ bật cho các thông báo
                        quan trọng.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Cảnh báo bảo mật
                    </span>
                    <ToggleSwitch
                      size="sm"
                      enabled={notificationSettings.sms.securityAlerts}
                      onChange={(value) =>
                        handleSettingChange("sms", "securityAlerts", value)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Chỉ khẩn cấp
                    </span>
                    <ToggleSwitch
                      size="sm"
                      enabled={notificationSettings.sms.urgentOnly}
                      onChange={(value) =>
                        handleSettingChange("sms", "urgentOnly", value)
                      }
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={notificationSettings.sms.phoneNumber}
                    onChange={(e) =>
                      handleSettingChange("sms", "phoneNumber", e.target.value)
                    }
                    className="block w-full max-w-xs border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="+84987654321"
                  />
                </div>
              </div>
            )}
          </div>

          {/* In-App Notifications */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Monitor className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Thông báo In-App
                </h3>
                <p className="text-sm text-gray-500">
                  Thông báo hiển thị trong ứng dụng
                </p>
              </div>
              <div className="ml-auto">
                <ToggleSwitch
                  enabled={notificationSettings.inApp.enabled}
                  onChange={(value) =>
                    handleSettingChange("inApp", "enabled", value)
                  }
                />
              </div>
            </div>

            {notificationSettings.inApp.enabled && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Cập nhật đơn hàng
                    </span>
                    <ToggleSwitch
                      size="sm"
                      enabled={notificationSettings.inApp.orderUpdates}
                      onChange={(value) =>
                        handleSettingChange("inApp", "orderUpdates", value)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Tin nhắn chat
                    </span>
                    <ToggleSwitch
                      size="sm"
                      enabled={notificationSettings.inApp.chatMessages}
                      onChange={(value) =>
                        handleSettingChange("inApp", "chatMessages", value)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Cảnh báo hệ thống
                    </span>
                    <ToggleSwitch
                      size="sm"
                      enabled={notificationSettings.inApp.systemAlerts}
                      onChange={(value) =>
                        handleSettingChange("inApp", "systemAlerts", value)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Khuyến mãi
                    </span>
                    <ToggleSwitch
                      size="sm"
                      enabled={notificationSettings.inApp.promotions}
                      onChange={(value) =>
                        handleSettingChange("inApp", "promotions", value)
                      }
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vị trí hiển thị
                      </label>
                      <select
                        value={notificationSettings.inApp.position}
                        onChange={(e) =>
                          handleSettingChange(
                            "inApp",
                            "position",
                            e.target.value
                          )
                        }
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      >
                        <option value="top-right">Góc trên phải</option>
                        <option value="top-left">Góc trên trái</option>
                        <option value="bottom-right">Góc dưới phải</option>
                        <option value="bottom-left">Góc dưới trái</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thời gian ẩn tự động (ms)
                      </label>
                      <input
                        type="number"
                        value={notificationSettings.inApp.hideDelay}
                        onChange={(e) =>
                          handleSettingChange(
                            "inApp",
                            "hideDelay",
                            parseInt(e.target.value)
                          )
                        }
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        min="1000"
                        max="10000"
                        step="1000"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mt-4">
                    <span className="text-sm font-medium text-gray-700">
                      Tự động ẩn
                    </span>
                    <ToggleSwitch
                      size="sm"
                      enabled={notificationSettings.inApp.autoHide}
                      onChange={(value) =>
                        handleSettingChange("inApp", "autoHide", value)
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Mẫu thông báo
            </h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Tạo mẫu mới</span>
            </button>
          </div>

          <div className="grid gap-6">
            {notificationTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {template.name}
                      </h3>
                      <PriorityBadge priority={template.priority} />
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          template.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {template.active ? "Đang hoạt động" : "Tạm dừng"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      Loại: {template.type}
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Tiêu đề:
                      </h4>
                      <p className="text-sm text-gray-900 mb-3">
                        {template.title}
                      </p>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Nội dung:
                      </h4>
                      <p className="text-sm text-gray-900">
                        {template.content}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">
                          Kênh gửi:
                        </span>
                        <div className="flex space-x-2">
                          {template.channels.map((channel) => (
                            <div
                              key={channel}
                              className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded"
                            >
                              {getChannelIcon(channel)}
                              <span className="text-xs text-gray-700 capitalize">
                                {channel}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">
                          Biến có sẵn:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {template.variables.map((variable) => (
                            <span
                              key={variable}
                              className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            >
                              {`{${variable}}`}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Settings className="w-4 h-4" />
                    </button>
                    <ToggleSwitch
                      enabled={template.active}
                      onChange={(value) => {
                        setNotificationTemplates((prev) =>
                          prev.map((t) =>
                            t.id === template.id ? { ...t, active: value } : t
                          )
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Lịch sử thông báo
            </h2>
            <div className="flex items-center space-x-4">
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="all">Tất cả trạng thái</option>
                <option value="delivered">Đã gửi</option>
                <option value="failed">Thất bại</option>
                <option value="pending">Đang gửi</option>
              </select>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="all">Tất cả kênh</option>
                <option value="email">Email</option>
                <option value="push">Push</option>
                <option value="sms">SMS</option>
                <option value="inApp">In-App</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thông báo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kênh
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người nhận
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notificationHistory.map((notification) => (
                    <tr key={notification.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {notification.content}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getChannelIcon(notification.channel)}
                          <span className="text-sm text-gray-900 capitalize">
                            {notification.channel}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {notification.recipient}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={notification.status} />
                        {notification.error && (
                          <div className="text-xs text-red-600 mt-1">
                            {notification.error}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div>Gửi: {formatDate(notification.sentAt)}</div>
                          {notification.deliveredAt && (
                            <div className="text-xs text-gray-500">
                              Nhận: {formatDate(notification.deliveredAt)}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">1</span> đến{" "}
              <span className="font-medium">3</span> của{" "}
              <span className="font-medium">3</span> kết quả
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                disabled
              >
                Trước
              </button>
              <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md">
                1
              </button>
              <button
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                disabled
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default NotificationTabContent;