// components/EmptyRepeatState.jsx
import React from "react";

const EmptyRepeatState = ({ fields, icon: Icon }) => (
  <div className="text-center py-8 text-gray-500">
    <div className="flex flex-col items-center gap-2">
      <Icon className="w-8 h-8 text-gray-300" />
      <p className="text-sm">
        {!fields?.length
          ? 'Chưa có schema. Nhấn "Thêm Field" để thiết lập schema trước.'
          : 'Nhấn "Thêm Item" để bắt đầu tạo dữ liệu.'}
      </p>
    </div>
  </div>
);

export default EmptyRepeatState;