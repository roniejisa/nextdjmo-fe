import React from "react";
import { X } from "lucide-react";
import { renderFormField } from "./FormField";

const MenuForm = ({
  isOpen = false,
  formData = {},
  menuSchema = [],
  editingItem = null,
  parentId = null,
  onClose,
  onSubmit,
  onFormDataChange,
}) => {
  if (!isOpen) return null;

  const getModalTitle = () => {
    if (parentId) return "Thêm menu con";
    if (editingItem) return "Chỉnh sửa menu";
    return "Thêm menu mới";
  };

  const getSubmitButtonText = () => {
    return editingItem ? "Cập nhật" : "Thêm";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleClose = () => {
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {getModalTitle()}
            </h3>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-6">
              {/* Kiểm tra nếu thêm menu mới thì thêm phần loại */}
              {!parentId && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      className={
                        "block text-sm font-semibold text-gray-800 mb-2"
                      }
                    >
                      <div className="flex items-center gap-2">Loại Menu</div>
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        onFormDataChange({ ...formData, type: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={"simple"}>Đơn cấp</option>
                      <option value={"dropdown"}>Đa cấp</option>
                      <option value={"megamenu"}>Đặc biệt</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Schema Fields */}
              <div className="space-y-4">
                {menuSchema.map((field) =>
                  renderFormField(field, onFormDataChange, formData)
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {getSubmitButtonText()}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuForm;
