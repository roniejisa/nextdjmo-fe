import React from "react";
import {
  Navigation,
  Save,
  Download,
  Upload,
  RefreshCw,
} from "lucide-react";

const MenuHeader = ({
  menuItems = [],
  menuSchema = [],
  isLoading = false,
  onSaveToDatabase,
  onLoadFromDatabase,
  onExportData,
  onImportData,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Navigation className="w-8 h-8 text-blue-600" />
            Quản lý Menu
          </h1>
          <p className="text-gray-600 mt-1">
            Tạo và quản lý Menu
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Data Management Buttons */}
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200">
            <button
              onClick={onSaveToDatabase}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
              title="Lưu vào database"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Lưu DB
            </button>
            <button
              onClick={onLoadFromDatabase}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              title="Tải từ database"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Tải DB
            </button>
          </div>

          <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200">
            <button
              onClick={onExportData}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Export dữ liệu"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <label className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={onImportData}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex items-center gap-4 text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>{menuItems.length} menu items</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>{menuSchema.length} schema fields</span>
        </div>
      </div>
    </div>
  );
};

export default MenuHeader;